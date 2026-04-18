import SteamID from "steamid";
import { calcPercentages, calcIndivPossession } from "./Utils";
import removeTag from "./removeTag";
import prisma from "./prisma";

function convertSteamID(steamid: string): string {
  try {
    const sid = new SteamID(steamid);
    return sid.getSteam2RenderedID();
  } catch {
    return steamid;
  }
}

const STAT = {
  redCards: 0,
  yellowCards: 1,
  fouls: 2,
  foulsSuffered: 3,
  tackles: 4,
  tacklesCompleted: 5,
  goalsConceded: 6,
  shots: 7,
  shotsOnTarget: 8,
  passesCompleted: 9,
  interceptions: 10,
  offsides: 11,
  goals: 12,
  ownGoals: 13,
  assists: 14,
  passes: 15,
  freeKicks: 16,
  penalties: 17,
  corners: 18,
  throwIns: 19,
  saves: 20,
  goalKicks: 21,
  possession: 22,
  distanceCovered: 23,
  savesCaught: 24,
  keyPasses: 25,
  chancesCreated: 26,
  secondAssists: 27,
} as const;

function sumStat(periods: any[], idx: number): number {
  return periods.reduce((acc, p) => acc + (p.statistics[idx] ?? 0), 0);
}

export default async function ingestMatch(
  sourceJson: any,
  torneo: string,
  vod: string | null,
  filename?: string
) {
  const md = sourceJson.matchData;
  if (!md) throw new Error("Invalid file: missing matchData");

  const info = md.matchInfo;
  const homeTeamRaw = md.teams[0].matchTotal;
  const awayTeamRaw = md.teams[1].matchTotal;

  const endTime = new Date(info.endTime * 1000);
  const startTime = new Date(info.startTime * 1000);

  // Derive fecha from endTime (same logic as createJSON.js)
  const fecha = endTime;

  // Build filename
  const homeGoals = homeTeamRaw.statistics[STAT.goals];
  const awayGoals = awayTeamRaw.statistics[STAT.goals];
  const pad = (n: number) => String(n).padStart(2, "0");
  const autoFilename = `${endTime.getFullYear()}.${pad(endTime.getMonth() + 1)}.${pad(endTime.getDate())}_${pad(endTime.getHours())}h.${pad(endTime.getMinutes())}m.${pad(endTime.getSeconds())}s_${homeTeamRaw.name}-vs-${awayTeamRaw.name}_${homeGoals}-${awayGoals}.json`.toLowerCase();
  const resolvedFilename = filename ?? autoFilename;

  const homeResult = homeGoals > awayGoals ? 1 : homeGoals < awayGoals ? -1 : 0;
  const awayResult = -homeResult as -1 | 0 | 1;

  const homePossessionRaw = homeTeamRaw.statistics[STAT.possession];
  const awayPossessionRaw = awayTeamRaw.statistics[STAT.possession];
  const [homePoss, awayPoss] = calcPercentages(homePossessionRaw, awayPossessionRaw);

  // Build per-team period stats
  function buildPeriodStats(teamRaw: any) {
    return (teamRaw.matchPeriods ?? []).map((p: any) => ({
      period: p.period,
      periodName: p.periodName,
      announcedInjuryTimeSeconds: p.announcedInjuryTimeSeconds,
      actualInjuryTimeSeconds: p.actualInjuryTimeSeconds,
      redCards: p.statistics[STAT.redCards],
      yellowCards: p.statistics[STAT.yellowCards],
      fouls: p.statistics[STAT.fouls],
      foulsSuffered: p.statistics[STAT.foulsSuffered],
      tackles: p.statistics[STAT.tackles],
      tacklesCompleted: p.statistics[STAT.tacklesCompleted],
      goalsConceded: p.statistics[STAT.goalsConceded],
      shots: p.statistics[STAT.shots],
      shotsOnTarget: p.statistics[STAT.shotsOnTarget],
      passesCompleted: p.statistics[STAT.passesCompleted],
      interceptions: p.statistics[STAT.interceptions],
      offsides: p.statistics[STAT.offsides],
      goals: p.statistics[STAT.goals],
      ownGoals: p.statistics[STAT.ownGoals],
      assists: p.statistics[STAT.assists],
      passes: p.statistics[STAT.passes],
      freeKicks: p.statistics[STAT.freeKicks],
      penalties: p.statistics[STAT.penalties],
      corners: p.statistics[STAT.corners],
      throwIns: p.statistics[STAT.throwIns],
      saves: p.statistics[STAT.saves],
      goalKicks: p.statistics[STAT.goalKicks],
      possession: p.statistics[STAT.possession],
      distanceCovered: p.statistics[STAT.distanceCovered],
      savesCaught: p.statistics[STAT.savesCaught],
      keyPasses: p.statistics[STAT.keyPasses],
      chancesCreated: p.statistics[STAT.chancesCreated],
      secondAssists: p.statistics[STAT.secondAssists],
    }));
  }

  // Build player data
  type PlayerData = {
    steamId: string;
    name: string;
    teamName: string;
    stats: Record<string, number>;
    positions: { position: string; seconds: number }[];
    periodData: any[];
  };

  const players: PlayerData[] = [];

  for (const p of md.players) {
    if (p.matchPeriodData.length === 0) continue;
    const steamId = convertSteamID(p.info.steamId);
    const name = removeTag(p.info.name);

    const firstPeriod = p.matchPeriodData[0];
    let teamName = "None";
    if (firstPeriod.info.team === "home") teamName = homeTeamRaw.name;
    else if (firstPeriod.info.team === "away") teamName = awayTeamRaw.name;

    const periods = p.matchPeriodData;
    const posMap = new Map<string, number>();
    let secondsPlayed = 0;

    for (const period of periods) {
      const duration = period.info.endSecond - period.info.startSecond;
      secondsPlayed += duration;
      const pos = period.info.position;
      posMap.set(pos, (posMap.get(pos) ?? 0) + duration);
    }

    const positions = Array.from(posMap.entries())
      .map(([position, seconds]) => ({ position, seconds }))
      .sort((a, b) => b.seconds - a.seconds);

    const periodData = periods.map((period: any) => ({
      startSecond: period.info.startSecond,
      endSecond: period.info.endSecond,
      team: period.info.team,
      position: period.info.position,
      redCards: period.statistics[STAT.redCards],
      yellowCards: period.statistics[STAT.yellowCards],
      fouls: period.statistics[STAT.fouls],
      foulsSuffered: period.statistics[STAT.foulsSuffered],
      tackles: period.statistics[STAT.tackles],
      tacklesCompleted: period.statistics[STAT.tacklesCompleted],
      goalsConceded: period.statistics[STAT.goalsConceded],
      shots: period.statistics[STAT.shots],
      shotsOnTarget: period.statistics[STAT.shotsOnTarget],
      passesCompleted: period.statistics[STAT.passesCompleted],
      interceptions: period.statistics[STAT.interceptions],
      offsides: period.statistics[STAT.offsides],
      goals: period.statistics[STAT.goals],
      ownGoals: period.statistics[STAT.ownGoals],
      assists: period.statistics[STAT.assists],
      passes: period.statistics[STAT.passes],
      freeKicks: period.statistics[STAT.freeKicks],
      penalties: period.statistics[STAT.penalties],
      corners: period.statistics[STAT.corners],
      throwIns: period.statistics[STAT.throwIns],
      saves: period.statistics[STAT.saves],
      goalKicks: period.statistics[STAT.goalKicks],
      possession: period.statistics[STAT.possession],
      distanceCovered: period.statistics[STAT.distanceCovered],
      savesCaught: period.statistics[STAT.savesCaught],
      keyPasses: period.statistics[STAT.keyPasses],
      chancesCreated: period.statistics[STAT.chancesCreated],
      secondAssists: period.statistics[STAT.secondAssists],
    }));

    players.push({
      steamId,
      name,
      teamName,
      stats: {
        goals: sumStat(periods, STAT.goals),
        assists: sumStat(periods, STAT.assists),
        shots: sumStat(periods, STAT.shots),
        shotsOnTarget: sumStat(periods, STAT.shotsOnTarget),
        passes: sumStat(periods, STAT.passes),
        passesCompleted: sumStat(periods, STAT.passesCompleted),
        interceptions: sumStat(periods, STAT.interceptions),
        saves: sumStat(periods, STAT.saves),
        fouls: sumStat(periods, STAT.fouls),
        yellowCards: sumStat(periods, STAT.yellowCards),
        redCards: sumStat(periods, STAT.redCards),
        ownGoals: sumStat(periods, STAT.ownGoals),
        offsides: sumStat(periods, STAT.offsides),
        distanceCovered: sumStat(periods, STAT.distanceCovered),
        possession: calcIndivPossession(
          sumStat(periods, STAT.possession),
          homePossessionRaw,
          awayPossessionRaw
        ),
        corners: sumStat(periods, STAT.corners),
        throwIns: sumStat(periods, STAT.throwIns),
        penalties: sumStat(periods, STAT.penalties),
        freeKicks: sumStat(periods, STAT.freeKicks),
        tackles: sumStat(periods, STAT.tackles),
        tacklesCompleted: sumStat(periods, STAT.tacklesCompleted),
        foulsSuffered: sumStat(periods, STAT.foulsSuffered),
        savesCaught: sumStat(periods, STAT.savesCaught),
        goalKicks: sumStat(periods, STAT.goalKicks),
        goalsConceded: sumStat(periods, STAT.goalsConceded),
        secondsPlayed,
        keyPasses: sumStat(periods, STAT.keyPasses),
        chancesCreated: sumStat(periods, STAT.chancesCreated),
        secondAssists: sumStat(periods, STAT.secondAssists),
      },
      positions,
      periodData,
    });
  }

  // Build events — GOAL, OWN GOAL, YELLOW CARD, RED CARD, SECOND YELLOW, SAVE, MISS
  const KEPT_EVENTS = new Set([
    "GOAL", "OWN GOAL", "YELLOW CARD", "RED CARD", "SECOND YELLOW", "SAVE", "MISS",
  ]);

  const steamIdToName = new Map<string, string>();
  for (const p of md.players) {
    steamIdToName.set(convertSteamID(p.info.steamId), removeTag(p.info.name));
  }

  const events = (md.matchEvents as any[])
    .filter(e => KEPT_EVENTS.has(e.event))
    .map(e => ({
      second: e.second,
      event: e.event,
      period: e.period ?? null,
      team: e.team,
      player1SteamId: convertSteamID(e.player1SteamId),
      player2SteamId: e.player2SteamId ? convertSteamID(e.player2SteamId) : null,
      player3SteamId: e.player3SteamId ? convertSteamID(e.player3SteamId) : null,
      bodyPart: e.bodyPart ?? null,
      posX: e.startPosition?.x ?? null,
      posY: e.startPosition?.y ?? null,
    }));

  // Persist everything in a transaction
  return prisma.$transaction(async tx => {
    // Upsert teams
    const [homeTeamRecord, awayTeamRecord] = await Promise.all([
      tx.team.upsert({ where: { name: homeTeamRaw.name }, create: { name: homeTeamRaw.name }, update: {} }),
      tx.team.upsert({ where: { name: awayTeamRaw.name }, create: { name: awayTeamRaw.name }, update: {} }),
    ]);

    // Upsert players (update name to latest)
    await Promise.all(
      players.map(p =>
        tx.player.upsert({
          where: { steamId: p.steamId },
          create: { steamId: p.steamId, name: p.name },
          update: { name: p.name },
        })
      )
    );

    // Resolve Tournament — find existing or create a stub
    let tournamentRecord = await tx.tournament.findUnique({ where: { torneo } });
    if (!tournamentRecord) {
      // Find TournamentType by longest prefix match
      const allTypes = await tx.tournamentType.findMany();
      let bestType = allTypes.reduce<typeof allTypes[0] | null>((best, t) => {
        if (torneo.startsWith(t.name) && (!best || t.name.length > best.name.length)) return t;
        return best;
      }, null);
      if (!bestType) {
        // Last resort: create a generic TournamentType
        bestType = await tx.tournamentType.upsert({
          where: { slug: torneo.toLowerCase().replace(/[^a-z0-9]/g, "") },
          create: {
            name: torneo,
            slug: torneo.toLowerCase().replace(/[^a-z0-9]/g, ""),
            order: 999,
            category: "primerorden",
          },
          update: {},
        });
      }
      const seasonMatch = torneo.match(/T(\d+)/i);
      tournamentRecord = await tx.tournament.create({
        data: {
          tournamentTypeId: bestType.id,
          season: seasonMatch ? parseInt(seasonMatch[1]) : null,
          torneo,
          isSubEntry: false,
        },
      });
    }

    // Create match
    const match = await tx.match.create({
      data: {
        filename: resolvedFilename,
        fecha,
        torneo,
        tournamentId: tournamentRecord.id,
        isDefault: false,
        vod,
        serverName: info.serverName ?? null,
        mapName: info.mapName ?? null,
        format: info.format ?? null,
        startTime,
        endTime,
        periods: info.periods ?? null,
        sourceJson,
      },
    });

    // Create MatchTeams
    function teamStats(raw: any, possession: number, scoreReceived: number, result: number) {
      const s = raw.statistics;
      return {
        side: raw.side,
        score: s[STAT.goals],
        scoreReceived,
        result,
        shots: s[STAT.shots],
        shotsOnTarget: s[STAT.shotsOnTarget],
        possession,
        passes: s[STAT.passes],
        passesCompleted: s[STAT.passesCompleted],
        fouls: s[STAT.fouls],
        yellowCards: s[STAT.yellowCards],
        redCards: s[STAT.redCards],
        offsides: s[STAT.offsides],
        corners: s[STAT.corners],
        throwIns: s[STAT.throwIns],
        penalties: s[STAT.penalties],
        freeKicks: s[STAT.freeKicks],
        foulsSuffered: s[STAT.foulsSuffered],
        goalsConceded: s[STAT.goalsConceded],
        interceptions: s[STAT.interceptions],
        ownGoals: s[STAT.ownGoals],
        tackles: s[STAT.tackles],
        tacklesCompleted: s[STAT.tacklesCompleted],
        saves: s[STAT.saves],
        savesCaught: s[STAT.savesCaught],
        distanceCovered: s[STAT.distanceCovered],
        assists: s[STAT.assists],
        goalKicks: s[STAT.goalKicks],
        keyPasses: s[STAT.keyPasses],
        chancesCreated: s[STAT.chancesCreated],
        secondAssists: s[STAT.secondAssists],
      };
    }

    const [homeMatchTeam, awayMatchTeam] = await Promise.all([
      tx.matchTeam.create({
        data: {
          matchId: match.id,
          teamId: homeTeamRecord.id,
          ...teamStats(homeTeamRaw, homePoss, awayGoals, homeResult),
          periodStats: buildPeriodStats(md.teams[0].matchTotal),
        },
      }),
      tx.matchTeam.create({
        data: {
          matchId: match.id,
          teamId: awayTeamRecord.id,
          ...teamStats(awayTeamRaw, awayPoss, homeGoals, awayResult),
          periodStats: buildPeriodStats(md.teams[1].matchTotal),
        },
      }),
    ]);

    const teamNameToMatchTeam: Record<string, typeof homeMatchTeam> = {
      [homeTeamRaw.name]: homeMatchTeam,
      [awayTeamRaw.name]: awayMatchTeam,
    };

    // Fetch player records for ID lookup
    const playerRecords = await tx.player.findMany({
      where: { steamId: { in: players.map(p => p.steamId) } },
      select: { id: true, steamId: true },
    });
    const steamIdToId = new Map(playerRecords.map(p => [p.steamId, p.id]));

    // Create MatchPlayers
    await tx.matchPlayer.createMany({
      data: players.map(p => ({
        matchId: match.id,
        matchTeamId: teamNameToMatchTeam[p.teamName]?.id ?? homeMatchTeam.id,
        playerId: steamIdToId.get(p.steamId)!,
        goals: p.stats.goals,
        assists: p.stats.assists,
        shots: p.stats.shots,
        shotsOnTarget: p.stats.shotsOnTarget,
        passes: p.stats.passes,
        passesCompleted: p.stats.passesCompleted,
        interceptions: p.stats.interceptions,
        saves: p.stats.saves,
        fouls: p.stats.fouls,
        yellowCards: p.stats.yellowCards,
        redCards: p.stats.redCards,
        ownGoals: p.stats.ownGoals,
        offsides: p.stats.offsides,
        distanceCovered: p.stats.distanceCovered,
        possession: p.stats.possession,
        corners: p.stats.corners,
        throwIns: p.stats.throwIns,
        penalties: p.stats.penalties,
        freeKicks: p.stats.freeKicks,
        tackles: p.stats.tackles,
        tacklesCompleted: p.stats.tacklesCompleted,
        foulsSuffered: p.stats.foulsSuffered,
        savesCaught: p.stats.savesCaught,
        goalKicks: p.stats.goalKicks,
        goalsConceded: p.stats.goalsConceded,
        secondsPlayed: p.stats.secondsPlayed,
        keyPasses: p.stats.keyPasses,
        chancesCreated: p.stats.chancesCreated,
        secondAssists: p.stats.secondAssists,
        positions: p.positions,
        periodData: p.periodData,
      })),
    });

    // Create MatchEvents
    if (events.length > 0) {
      await tx.matchEvent.createMany({
        data: events.map(e => ({ matchId: match.id, ...e })),
      });
    }

    return match;
  });
}
