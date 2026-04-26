import { config } from "dotenv";
config({ path: new URL("../.env.local", import.meta.url).pathname });

import { MongoClient, ObjectId } from "mongodb";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Side, EventType } from "../generated/prisma/enums";
import { getRegex } from "../lib/aggregations/queries";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! })
});

const EVENT_TYPE_MAP: Record<string, EventType | null> = {
  GOAL: EventType.GOAL,
  "YELLOW CARD": EventType.YELLOW_CARD,
  "SECOND YELLOW": EventType.SECOND_YELLOW,
  "RED CARD": EventType.RED_CARD,
  "OWN GOAL": EventType.OWN_GOAL
};

function buildTorneoMatcher(tournaments: { id: number; queryCode: string | null; name: string }[]) {
  const sorted = tournaments
    .filter(t => t.queryCode)
    .sort((a, b) => b.queryCode!.length - a.queryCode!.length);

  const byName = new Map(tournaments.map(t => [t.name.toLowerCase(), t.id]));

  return function matchTorneo(torneo: string): number | null {
    // first try regex match via queryCode
    for (const t of sorted) {
      const regexResult = getRegex(t.queryCode!);
      if (!regexResult) continue;
      const pattern =
        typeof regexResult === "string" ? regexResult : (regexResult as { $regex: string }).$regex;
      if (new RegExp(pattern, "i").test(torneo)) return t.id;
    }
    // fall back to exact name match (for entries with no queryCode)
    return byName.get(torneo.toLowerCase()) ?? null;
  };
}

async function migrate() {
  const encUser = encodeURIComponent(process.env.DB_USER!);
  const encPass = encodeURIComponent(process.env.DB_PASS!);
  const mongoUri = `mongodb://${encUser}:${encPass}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin&retryWrites=true&w=majority`;
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const db = mongoClient.db(process.env.DB_NAME);
  const collection = db.collection(process.env.DB_COLLECTION!);

  const tournaments = await prisma.tournament.findMany({
    select: { id: true, queryCode: true, name: true }
  });
  const matchTorneo = buildTorneoMatcher(tournaments);

  const mongoDocs = await collection.find({}).sort({ fecha: 1 }).toArray();
  console.log(`Found ${mongoDocs.length} matches in MongoDB`);

  let migrated = 0;
  let skippedNoTournament = 0;
  let skippedAlreadyExists = 0;
  const unmappedTorneos = new Set<string>();

  for (const doc of mongoDocs) {
    const mongoID = (doc._id as ObjectId).toString();

    const existing = await prisma.match.findUnique({ where: { mongoID } });
    if (existing) {
      skippedAlreadyExists++;
      continue;
    }

    const tournamentId = matchTorneo(doc.torneo);
    if (!tournamentId) {
      unmappedTorneos.add(doc.torneo);
      skippedNoTournament++;
      continue;
    }

    // compute match duration from max secondsplayed across all players
    const allSecondsPlayed: number[] = (doc.players ?? []).map(
      (p: any) => p.statistics?.secondsplayed ?? 0
    );
    const matchDuration = Math.max(...allSecondsPlayed, 0) || 5700;

    const homeTeamDoc = (doc.teams ?? []).find((t: any) => t.side === "home");
    const awayTeamDoc = (doc.teams ?? []).find((t: any) => t.side === "away");

    if (!homeTeamDoc || !awayTeamDoc) {
      console.warn(`  Skipping ${mongoID}: missing home or away team`);
      skippedNoTournament++;
      continue;
    }

    try {
      await prisma.$transaction(async tx => {
        const homeTeam = await tx.team.upsert({
          where: { name: homeTeamDoc.teamname },
          create: { name: homeTeamDoc.teamname, shortname: "", logo: "" },
          update: {}
        });

        const awayTeam = await tx.team.upsert({
          where: { name: awayTeamDoc.teamname },
          create: { name: awayTeamDoc.teamname, shortname: "", logo: "" },
          update: {}
        });

        const match = await tx.match.create({
          data: {
            mongoID,
            sourceJSON: doc as object,
            tournamentId,
            homeScore: Number(homeTeamDoc.score),
            awayScore: Number(awayTeamDoc.score),
            homeTeamId: homeTeam.id,
            awayTeamId: awayTeam.id,
            date: new Date(doc.fecha),
            filename: doc.filename ?? null,
            secondsPlayed: matchDuration,
            format: 0,
            isDefault: doc.isdefault ?? false
          }
        });

        // build steamId → player record map
        const playerDocs: any[] = doc.players ?? [];
        const steamIds = playerDocs
          .map((p: any) => p.info?.steam_id)
          .filter((id: string) => id && id !== "BOT");

        const playerRecords = await Promise.all(
          steamIds.map((steamId: string) => {
            const info = playerDocs.find((p: any) => p.info?.steam_id === steamId)?.info;
            return tx.player.upsert({
              where: { steamid: steamId },
              create: { name: info?.name ?? steamId, steamid: steamId },
              update: {}
            });
          })
        );

        const playerBySteamId = new Map(
          steamIds.map((id: string, i: number) => [id, playerRecords[i]])
        );

        // create MatchPlayer rows from each team's playerStatistics
        for (const teamDoc of [homeTeamDoc, awayTeamDoc]) {
          const side = teamDoc.side as Side;
          for (const mp of teamDoc.playerStatistics ?? []) {
            const steamId = mp.info?.steam_id;
            if (!steamId || steamId === "BOT") continue;

            const player = playerBySteamId.get(steamId);
            if (!player) continue;

            const s = mp.statistics ?? {};
            const n = (v: unknown) => Number(v) || 0;
            const possessionSeconds = (n(s.possession) / 100) * matchDuration;

            const statsData = {
                goals: n(s.goals),
                assists: n(s.assists),
                shots: n(s.shots),
                shotsontarget: n(s.shotsontarget),
                passes: n(s.passes),
                passescompleted: n(s.passescompleted),
                interceptions: n(s.interceptions),
                saves: n(s.saves),
                fouls: n(s.fouls),
                yellowcards: n(s.yellowcards),
                redcards: n(s.redcards),
                owngoals: n(s.owngoals),
                offsides: n(s.offsides),
                distancecovered: n(s.distancecovered),
                possession: possessionSeconds,
                corners: n(s.corners),
                throwins: n(s.throwins),
                penalties: n(s.penalties),
                freekicks: n(s.freekicks),
                tackles: n(s.tackles),
                tacklescompleted: n(s.tacklescompleted),
                foulssuffered: n(s.foulssuffered),
                savescaught: n(s.savescaught),
                goalkicks: n(s.goalkicks),
                goalsconceded: n(s.goalsconceded),
                secondsplayed: n(s.secondsplayed),
                keypasses: n(s.keypasses),
                chancescreated: n(s.chancescreated),
                secondassists: n(s.secondassists)
            };
            const matchPlayer = await tx.matchPlayer.upsert({
              where: { matchId_playerId_side: { matchId: match.id, playerId: player.id, side } },
              create: {
                matchId: match.id,
                playerId: player.id,
                side,
                ...statsData
              },
              update: statsData
            });

            const positions: { position: string; seconds: number }[] =
              s.positions ?? [];
            if (positions.length > 0) {
              await tx.matchPlayerPosition.createMany({
                data: positions.map(pos => ({
                  matchPlayerId: matchPlayer.id,
                  position: pos.position,
                  secondsPlayed: pos.seconds
                }))
              });
            }
          }
        }

        // create MatchEvent rows
        for (const event of doc.matchevents ?? []) {
          const eventType = EVENT_TYPE_MAP[event.event];
          if (!eventType) continue;

          // events reference players by name — look up via steamId fields when present
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
              minute: isFinite(event.second) ? Math.floor(event.second / 60) : 0
            }
          });
        }
      });

      migrated++;
      if (migrated % 50 === 0) console.log(`  Migrated ${migrated}...`);
    } catch (err) {
      console.error(`  Error migrating ${mongoID} (${doc.torneo}):`, err);
    }
  }

  await mongoClient.close();

  console.log("\n--- Migration complete ---");
  console.log(`Migrated:              ${migrated}`);
  console.log(`Skipped (exists):      ${skippedAlreadyExists}`);
  console.log(`Skipped (no tourney):  ${skippedNoTournament}`);
  if (unmappedTorneos.size > 0) {
    console.log("\nUnmapped torneo values:");
    for (const t of unmappedTorneos) console.log(`  ${t}`);
  }
}

migrate()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
