import { config } from "dotenv";
config({ path: ".env.local" });

import { MongoClient } from "mongodb";
import { PrismaClient } from "../lib/generated/prisma";
import ingestMatch from "../lib/ingestMatch";

const prisma = new PrismaClient();

async function main() {
  const encuser = encodeURIComponent(process.env.DB_USER!);
  const encpw = encodeURIComponent(process.env.DB_PASS!);
  const uri = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin&retryWrites=true&w=majority`;

  const mongo = new MongoClient(uri);
  await mongo.connect();
  console.log("Connected to MongoDB");

  const db = mongo.db(process.env.DB_NAME);
  const collection = db.collection(process.env.DB_COLLECTION!);

  const total = await collection.countDocuments();
  console.log(`Found ${total} matches to migrate`);

  const cursor = collection.find({}).sort({ fecha: 1 });

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for await (const doc of cursor) {
    const filename = (doc.filename as string) || doc._id.toString();

    // Skip if already migrated
    const existing = await prisma.match.findUnique({ where: { filename } });
    if (existing) {
      skipped++;
      continue;
    }

    try {
      // MongoDB docs don't have the original sourceJson — reconstruct what we can.
      // We use the stored data directly rather than re-ingesting from source JSON,
      // since the source JSONs aren't available here.
      await migrateDoc(doc);
      migrated++;
      if (migrated % 50 === 0) {
        console.log(`  ${migrated}/${total} migrated...`);
      }
    } catch (err) {
      errors++;
      console.error(`  Error migrating ${filename}:`, err.message);
    }
  }

  await mongo.close();
  await prisma.$disconnect();

  console.log(`\nDone. Migrated: ${migrated}, Skipped: ${skipped}, Errors: ${errors}`);
}

async function migrateDoc(doc: any) {
  return prisma.$transaction(async tx => {
    const homeRaw = doc.teams[0];
    const awayRaw = doc.teams[1];

    const [homeTeam, awayTeam] = await Promise.all([
      tx.team.upsert({ where: { name: homeRaw.teamname }, create: { name: homeRaw.teamname }, update: {} }),
      tx.team.upsert({ where: { name: awayRaw.teamname }, create: { name: awayRaw.teamname }, update: {} }),
    ]);

    // Upsert all players
    const players: any[] = doc.players ?? [];
    for (const p of players) {
      if (!p.info?.steam_id) continue;
      await tx.player.upsert({
        where: { steamId: p.info.steam_id },
        create: { steamId: p.info.steam_id, name: p.info.name },
        update: { name: p.info.name },
      });
    }

    // Resolve Tournament
    const torneo: string = doc.torneo;
    let tournamentRecord = await tx.tournament.findUnique({ where: { torneo } });
    if (!tournamentRecord) {
      const allTypes = await tx.tournamentType.findMany();
      let bestType = allTypes.reduce<typeof allTypes[0] | null>((best, t) => {
        if (torneo.startsWith(t.name) && (!best || t.name.length > best.name.length)) return t;
        return best;
      }, null);
      if (!bestType) {
        bestType = await tx.tournamentType.upsert({
          where: { slug: torneo.toLowerCase().replace(/[^a-z0-9]/g, "") },
          create: { name: torneo, slug: torneo.toLowerCase().replace(/[^a-z0-9]/g, ""), order: 999, category: "primerorden" },
          update: {},
        });
      }
      const seasonMatch = torneo.match(/T(\d+)/i);
      tournamentRecord = await tx.tournament.create({
        data: { tournamentTypeId: bestType.id, season: seasonMatch ? parseInt(seasonMatch[1]) : null, torneo, isSubEntry: false },
      });
    }

    const match = await tx.match.create({
      data: {
        filename: doc.filename,
        fecha: new Date(doc.fecha),
        torneo: doc.torneo,
        tournamentId: tournamentRecord.id,
        isDefault: doc.isdefault ?? false,
        vod: doc.vod ?? null,
        mongoId: doc._id?.toString() ?? null,
        // These fields weren't stored in MongoDB — leave null
        serverName: null,
        mapName: null,
        format: null,
        startTime: null,
        endTime: new Date(doc.fecha),
        periods: null,
        sourceJson: doc, // store the full Mongo doc as the source
      },
    });

    function teamStatData(raw: any, scoreReceived: number) {
      const s = raw.statistics ?? {};
      return {
        side: raw.side,
        score: parseInt(raw.score) || 0,
        scoreReceived: parseInt(String(scoreReceived)) || 0,
        result: raw.result,
        shots: s.shots ?? 0,
        shotsOnTarget: s.shotsontarget ?? 0,
        possession: isNaN(s.possession) || s.possession == null ? 0 : s.possession,
        passes: s.passes ?? 0,
        passesCompleted: s.passescompleted ?? 0,
        fouls: s.fouls ?? 0,
        yellowCards: s.yellowcards ?? 0,
        redCards: s.redcards ?? 0,
        offsides: s.offsides ?? 0,
        corners: s.corners ?? 0,
        throwIns: s.throwins ?? 0,
        penalties: s.penalties ?? 0,
        freeKicks: s.freekicks ?? 0,
        foulsSuffered: s.foulssuffered ?? 0,
        goalsConceded: s.goalsconceded ?? 0,
        interceptions: s.interceptions ?? 0,
        ownGoals: s.owngoals ?? 0,
        tackles: s.tackles ?? 0,
        tacklesCompleted: s.tacklescompleted ?? 0,
        saves: s.saves ?? 0,
        savesCaught: s.savescaught ?? 0,
        distanceCovered: s.distancecovered ?? 0,
        assists: s.assists ?? 0,
        goalKicks: s.goalkicks ?? 0,
        keyPasses: s.keypasses ?? 0,
        chancesCreated: s.chancescreated ?? 0,
        secondAssists: s.secondassists ?? 0,
        periodStats: null,
      };
    }

    const [homeMatchTeam, awayMatchTeam] = await Promise.all([
      tx.matchTeam.create({
        data: {
          Match: { connect: { id: match.id } },
          Team: { connect: { id: homeTeam.id } },
          ...teamStatData(homeRaw, awayRaw.score),
        },
      }),
      tx.matchTeam.create({
        data: {
          Match: { connect: { id: match.id } },
          Team: { connect: { id: awayTeam.id } },
          ...teamStatData(awayRaw, homeRaw.score),
        },
      }),
    ]);

    const teamNameToMatchTeam: Record<string, typeof homeMatchTeam> = {
      [homeRaw.teamname]: homeMatchTeam,
      [awayRaw.teamname]: awayMatchTeam,
    };

    const playerRecords = await tx.player.findMany({
      where: { steamId: { in: players.map(p => p.info?.steam_id).filter(Boolean) } },
      select: { id: true, steamId: true },
    });
    const steamIdToId = new Map(playerRecords.map(p => [p.steamId, p.id]));

    for (const p of players) {
      if (!p.info?.steam_id) continue;
      const playerId = steamIdToId.get(p.info.steam_id);
      if (!playerId) continue;
      const mt = teamNameToMatchTeam[p.info.team];
      if (!mt) continue;
      const s = p.statistics ?? {};

      await tx.matchPlayer.upsert({
        where: { matchId_playerId: { matchId: match.id, playerId } },
        create: {
          matchId: match.id,
          matchTeamId: mt.id,
          playerId,
          goals: s.goals ?? 0,
          assists: s.assists ?? 0,
          shots: s.shots ?? 0,
          shotsOnTarget: s.shotsontarget ?? 0,
          passes: s.passes ?? 0,
          passesCompleted: s.passescompleted ?? 0,
          interceptions: s.interceptions ?? 0,
          saves: s.saves ?? 0,
          fouls: s.fouls ?? 0,
          yellowCards: s.yellowcards ?? 0,
          redCards: s.redcards ?? 0,
          ownGoals: s.owngoals ?? 0,
          offsides: s.offsides ?? 0,
          distanceCovered: s.distancecovered ?? 0,
          possession: isNaN(s.possession) || s.possession == null ? 0 : s.possession,
          corners: s.corners ?? 0,
          throwIns: s.throwins ?? 0,
          penalties: s.penalties ?? 0,
          freeKicks: s.freekicks ?? 0,
          tackles: s.tackles ?? 0,
          tacklesCompleted: s.tacklescompleted ?? 0,
          foulsSuffered: s.foulssuffered ?? 0,
          savesCaught: s.savescaught ?? 0,
          goalKicks: s.goalkicks ?? 0,
          goalsConceded: s.goalsconceded ?? 0,
          secondsPlayed: s.secondsplayed ?? 0,
          keyPasses: s.keypasses ?? 0,
          chancesCreated: s.chancescreated ?? 0,
          secondAssists: s.secondassists ?? 0,
          positions: s.positions ?? [],
          periodData: [], // not available in MongoDB docs
        },
        update: {},
      });
    }

    const KEPT_EVENTS = new Set(["GOAL", "OWN GOAL", "YELLOW CARD", "RED CARD", "SECOND YELLOW"]);
    const events = (doc.matchevents ?? []).filter(e => KEPT_EVENTS.has(e.event));
    if (events.length > 0) {
      await tx.matchEvent.createMany({
        data: events.map(e => ({
          matchId: match.id,
          second: parseInt(e.second) || 0,
          event: e.event,
          period: e.period ?? null,
          team: e.team,
          player1SteamId: e.player1SteamId ?? "",
          player2SteamId: e.player2SteamId || null,
          player3SteamId: e.player3SteamId || null,
          bodyPart: e.bodyPart ?? null,
          posX: e.startPosition?.x ?? null,
          posY: e.startPosition?.y ?? null,
        })),
      });
    }
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
