import { Side, EventType } from "../generated/prisma/enums";
import { prisma } from "./prisma";

const STAT_FIELDS = [
  "redcards",
  "yellowcards",
  "fouls",
  "foulssuffered",
  "tackles",
  "tacklescompleted",
  "goalsconceded",
  "shots",
  "shotsontarget",
  "passescompleted",
  "interceptions",
  "offsides",
  "goals",
  "owngoals",
  "assists",
  "passes",
  "freekicks",
  "penalties",
  "corners",
  "throwins",
  "saves",
  "goalkicks",
  "possession",
  "distancecovered",
  "savescaught",
  "keypasses",
  "chancescreated",
  "secondassists"
] as const;

const EVENT_TYPE_MAP: Record<string, EventType | null> = {
  GOAL: EventType.GOAL,
  "YELLOW CARD": EventType.YELLOW_CARD,
  "SECOND YELLOW": EventType.SECOND_YELLOW,
  "RED CARD": EventType.RED_CARD,
  "OWN GOAL": EventType.OWN_GOAL
};

type RawMatchData = {
  matchData: {
    statisticTypes: string[];
    matchInfo: {
      startTime: number;
      endTime: number;
      format: number;
    };
    teams: {
      matchTotal: {
        name: string;
        side: string;
        statistics: number[];
      };
    }[];
    players: {
      info: {
        steamId: string;
        name: string;
      };
      matchPeriodData: {
        info: {
          startSecond: number;
          endSecond: number;
          team: string;
          position: string;
        };
        statistics: number[];
      }[];
    }[];
    matchEvents: {
      second: number;
      event: string;
      team: string;
      player1SteamId: string;
      player2SteamId: string;
      player3SteamId: string;
    }[];
  };
};

function sumStats(
  periods: RawMatchData["matchData"]["players"][0]["matchPeriodData"],
  side: string
) {
  const totals = new Array(STAT_FIELDS.length).fill(0);
  for (const period of periods) {
    if (period.info.team !== side) continue;
    for (let i = 0; i < period.statistics.length; i++) {
      totals[i] += period.statistics[i];
    }
  }
  return totals;
}

function buildPositions(
  periods: RawMatchData["matchData"]["players"][0]["matchPeriodData"],
  side: string
) {
  const posMap = new Map<string, number>();
  for (const period of periods) {
    if (period.info.team !== side) continue;
    const seconds = period.info.endSecond - period.info.startSecond;
    if (seconds <= 0) continue;
    posMap.set(
      period.info.position,
      (posMap.get(period.info.position) ?? 0) + seconds
    );
  }
  return Array.from(posMap.entries()).map(([position, secondsPlayed]) => ({
    position,
    secondsPlayed
  }));
}

function statsToObject(stats: number[]) {
  return Object.fromEntries(
    STAT_FIELDS.map((field, i) => [field, stats[i] ?? 0])
  );
}

export async function ingestMatch(
  json: RawMatchData,
  tournament: string,
  filename?: string
) {
  const { matchData } = json;
  const { matchInfo, teams, players, matchEvents } = matchData;

  const homeTeamRaw = teams.find(t => t.matchTotal.side === "home")!;
  const awayTeamRaw = teams.find(t => t.matchTotal.side === "away")!;

  const goalsIdx = STAT_FIELDS.indexOf("goals");
  const ownGoalsIdx = STAT_FIELDS.indexOf("owngoals");

  const homeGoals = homeTeamRaw.matchTotal.statistics[goalsIdx];
  const awayGoals = awayTeamRaw.matchTotal.statistics[goalsIdx];
  const homeOwnGoals = homeTeamRaw.matchTotal.statistics[ownGoalsIdx];
  const awayOwnGoals = awayTeamRaw.matchTotal.statistics[ownGoalsIdx];

  const homeScore = homeGoals + homeOwnGoals;
  const awayScore = awayGoals + awayOwnGoals;

  const secondsPlayed = matchInfo.endTime - matchInfo.startTime;
  const date = new Date(matchInfo.startTime * 1000);

  return await prisma.$transaction(async tx => {
    const homeTeam = await tx.team.upsert({
      where: { name: homeTeamRaw.matchTotal.name },
      create: { name: homeTeamRaw.matchTotal.name, shortname: "", logo: "" },
      update: {}
    });

    const awayTeam = await tx.team.upsert({
      where: { name: awayTeamRaw.matchTotal.name },
      create: { name: awayTeamRaw.matchTotal.name, shortname: "", logo: "" },
      update: {}
    });

    const match = await tx.match.create({
      data: {
        sourceJSON: json as object,
        tournament,
        homeScore,
        awayScore,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        date,
        filename: filename ?? null,
        secondsPlayed,
        format: matchInfo.format
      }
    });

    // upsert all players and build steamId -> Player map
    const steamIds = players
      .map(p => p.info.steamId)
      .filter(id => id !== "BOT");

    const playerRecords = await Promise.all(
      steamIds.map(steamId => {
        const info = players.find(p => p.info.steamId === steamId)!.info;
        return tx.player.upsert({
          where: { steamid: steamId },
          create: { name: info.name, steamid: steamId },
          update: {}
        });
      })
    );

    const playerBySteamId = new Map(
      playerRecords.map((p, i) => [steamIds[i], p])
    );

    // create MatchPlayer rows (one per player per side they played on)
    for (const rawPlayer of players) {
      if (rawPlayer.info.steamId === "BOT") continue;
      if (rawPlayer.matchPeriodData.length === 0) continue;

      const sides = [
        ...new Set(rawPlayer.matchPeriodData.map(p => p.info.team))
      ] as string[];

      for (const side of sides) {
        const stats = statsToObject(sumStats(rawPlayer.matchPeriodData, side));
        const positions = buildPositions(rawPlayer.matchPeriodData, side);
        const secondsPlayedForSide = positions.reduce(
          (sum, p) => sum + p.secondsPlayed,
          0
        );

        if (secondsPlayedForSide === 0) continue;

        const player = playerBySteamId.get(rawPlayer.info.steamId)!;

        const matchPlayer = await tx.matchPlayer.create({
          data: {
            matchId: match.id,
            playerId: player.id,
            side: side as Side,
            goals: stats.goals,
            assists: stats.assists,
            shots: stats.shots,
            shotsontarget: stats.shotsontarget,
            passes: stats.passes,
            passescompleted: stats.passescompleted,
            interceptions: stats.interceptions,
            saves: stats.saves,
            fouls: stats.fouls,
            yellowcards: stats.yellowcards,
            redcards: stats.redcards,
            owngoals: stats.owngoals,
            offsides: stats.offsides,
            distancecovered: stats.distancecovered,
            possession: stats.possession,
            corners: stats.corners,
            throwins: stats.throwins,
            penalties: stats.penalties,
            freekicks: stats.freekicks,
            tackles: stats.tackles,
            tacklescompleted: stats.tacklescompleted,
            foulssuffered: stats.foulssuffered,
            savescaught: stats.savescaught,
            goalkicks: stats.goalkicks,
            goalsconceded: stats.goalsconceded,
            secondsplayed: secondsPlayedForSide,
            keypasses: stats.keypasses,
            chancescreated: stats.chancescreated,
            secondassists: stats.secondassists
          }
        });

        await tx.matchPlayerPosition.createMany({
          data: positions.map(pos => ({
            matchPlayerId: matchPlayer.id,
            position: pos.position,
            secondsPlayed: pos.secondsPlayed
          }))
        });
      }
    }

    // create MatchEvent rows for relevant event types only
    for (const event of matchEvents) {
      const eventType = EVENT_TYPE_MAP[event.event];
      if (!eventType) continue;

      const player1 = event.player1SteamId
        ? playerBySteamId.get(event.player1SteamId)
        : undefined;
      const player2 = event.player2SteamId
        ? playerBySteamId.get(event.player2SteamId)
        : undefined;
      const player3 = event.player3SteamId
        ? playerBySteamId.get(event.player3SteamId)
        : undefined;

      await tx.matchEvent.create({
        data: {
          matchId: match.id,
          eventType,
          player1Id: player1?.id ?? null,
          player2Id: player2?.id ?? null,
          player3Id: player3?.id ?? null,
          minute: Math.floor(event.second / 60)
        }
      });
    }

    return match;
  });
}
