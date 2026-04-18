import { config } from "dotenv";
config({ path: ".env.local" });

import { randomBytes } from "crypto";
import prisma from "../lib/prisma";

const createId = () => randomBytes(12).toString("base64url");
import TorneosJson from "../utils/Torneos.json";

// Category mapping — mirrors the arrays in getTorneoFilter()
const primerOrden = new Set([
  "Liga D1", "Copa Master", "Copa valencARc", "Copa Maradei",
  "Recopa Master", "Recopa Maradei", "Supercopa Master", "Supercopa Casana",
  "Copa America", "Copa del Sur", "Copa Gubero", "Liga Master",
  "Division de Honor", "Superliga D1", "Copa D1", "Copa Intrazonal de Oro",
]);
const segundoOrden = new Set(["Liga D2", "Copa D2", "Copa Intrazonal de Plata"]);
const tercerOrden = new Set(["Liga D3", "Copa D3", "Liga Zero", "Liga D4"]);
const selecciones = new Set(["Copa America", "Copa del Sur"]);

function getCategory(name: string): string {
  if (selecciones.has(name)) return "selecciones";
  if (primerOrden.has(name)) return "primerorden";
  if (segundoOrden.has(name)) return "segundoorden";
  if (tercerOrden.has(name)) return "tercerorden";
  return "primerorden"; // fallback for Promoción types
}

async function main() {
  // ── Step 1: TournamentType rows from the "all" temporada ──────────────────
  const allTemporada = TorneosJson.find(t => t.temporada === "all")!;

  // Also collect any "Promoción" types found in season entries
  const extraTypeNames = new Set<string>();
  for (const temporada of TorneosJson) {
    if (!temporada.temporada.match(/^t\d+$/i)) continue;
    for (const entry of temporada.torneos) {
      const isPromocion = entry.torneo.startsWith("Promoción");
      if (isPromocion) {
        const typeName = entry.torneo.replace(/ T\d+.*$/, "").trim();
        extraTypeNames.add(typeName);
      }
    }
  }

  const typeRows = [
    ...allTemporada.torneos.map((entry, i) => ({
      id: createId(),
      name: entry.torneo,
      slug: (entry as any).query as string,
      order: i,
      category: getCategory(entry.torneo),
    })),
    ...[...extraTypeNames].map((name, i) => ({
      id: createId(),
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      order: allTemporada.torneos.length + i,
      category: getCategory(name),
    })),
  ];

  console.log(`Creating ${typeRows.length} TournamentType rows...`);
  for (const row of typeRows) {
    await prisma.tournamentType.upsert({
      where: { slug: row.slug },
      create: row,
      update: { name: row.name, order: row.order, category: row.category },
    });
  }

  // Build lookup map: name → id
  const allTypes = await prisma.tournamentType.findMany();
  const typeByName = new Map(allTypes.map(t => [t.name, t]));

  // ── Step 2: Tournament rows from each season temporada ───────────────────
  const seasonTemporadas = TorneosJson.filter(t => t.temporada.match(/^t\d+$/i));

  // Also handle "selecciones" temporada
  const seleccionesTemporada = TorneosJson.find(t => t.temporada === "selecciones");
  const allSeasonEntries: { temporada: string; torneos: typeof TorneosJson[0]["torneos"] }[] = [
    ...seasonTemporadas,
    ...(seleccionesTemporada ? [seleccionesTemporada] : []),
  ];

  let created = 0;
  let skipped = 0;

  for (const temporada of allSeasonEntries) {
    const seasonMatch = temporada.temporada.match(/^t(\d+)$/i);
    const season = seasonMatch ? parseInt(seasonMatch[1]) : null;

    // First pass: create parent entries (those with a query)
    const parentEntries = temporada.torneos.filter(e => (e as any).query);
    const parentIds = new Map<string, string>(); // torneo string → db id

    for (const entry of parentEntries) {
      const e = entry as any;
      // Find matching TournamentType by prefix
      const typeName = findTypeName(e.torneo, typeByName);
      if (!typeName) {
        console.warn(`  No TournamentType found for: "${e.torneo}" — skipping`);
        skipped++;
        continue;
      }
      const type = typeByName.get(typeName)!;
      const id = createId();
      await prisma.tournament.upsert({
        where: { torneo: e.torneo },
        create: {
          id,
          tournamentTypeId: type.id,
          season,
          torneo: e.torneo,
          slug: e.query ?? null,
          tabla: e.tabla ?? null,
          tablaLabel: e.tablaLabel ?? null,
          challonge: e.challonge ?? null,
          isSubEntry: false,
        },
        update: {
          slug: e.query ?? null,
          tabla: e.tabla ?? null,
          tablaLabel: e.tablaLabel ?? null,
          challonge: e.challonge ?? null,
        },
      });
      const row = await prisma.tournament.findUnique({ where: { torneo: e.torneo } });
      parentIds.set(e.torneo, row!.id);
      created++;
    }

    // Second pass: sub-entries (no query)
    const subEntries = temporada.torneos.filter(e => !(e as any).query);
    for (const entry of subEntries) {
      const e = entry as any;
      const typeName = findTypeName(e.torneo, typeByName);
      if (!typeName) {
        console.warn(`  No TournamentType found for sub-entry: "${e.torneo}" — skipping`);
        skipped++;
        continue;
      }
      const type = typeByName.get(typeName)!;

      // Find parent: longest parent torneo that is a prefix of this entry's torneo
      let parentId: string | null = null;
      for (const [parentTorneo, pid] of parentIds) {
        if (e.torneo.startsWith(parentTorneo) && e.torneo !== parentTorneo) {
          parentId = pid;
          break;
        }
      }

      await prisma.tournament.upsert({
        where: { torneo: e.torneo },
        create: {
          id: createId(),
          tournamentTypeId: type.id,
          season,
          torneo: e.torneo,
          slug: null,
          tabla: e.tabla ?? null,
          tablaLabel: e.tablaLabel ?? null,
          challonge: e.challonge ?? null,
          isSubEntry: true,
          parentId,
        },
        update: {
          tabla: e.tabla ?? null,
          tablaLabel: e.tablaLabel ?? null,
          challonge: e.challonge ?? null,
          parentId,
        },
      });
      created++;
    }
  }

  console.log(`Created/updated ${created} Tournament rows, skipped ${skipped}`);

  // ── Step 3: Copy winners from backup ─────────────────────────────────────
  const updated = await prisma.$executeRaw`
    UPDATE "Tournament" t
    SET winners = b.winners
    FROM "_tournament_winners_backup" b
    WHERE t.torneo = b.torneo AND b.winners IS NOT NULL
  `;
  console.log(`Copied winners for ${updated} tournaments`);

  // ── Step 4: Backfill Match.tournamentId ───────────────────────────────────
  const backfilled = await prisma.$executeRaw`
    UPDATE "Match" m
    SET "tournamentId" = t.id
    FROM "Tournament" t
    WHERE m.torneo = t.torneo AND m."tournamentId" IS NULL
  `;
  console.log(`Backfilled tournamentId for ${backfilled} matches`);

  // ── Step 5: Auto-create Tournament rows for unmatched historic torneo strings ──
  const unmatched = await prisma.$queryRaw<{ torneo: string }[]>`
    SELECT DISTINCT torneo FROM "Match" WHERE "tournamentId" IS NULL ORDER BY torneo
  `;

  if (unmatched.length > 0) {
    console.log(`Creating ${unmatched.length} historic Tournament rows for unmatched torneo strings...`);
    for (const { torneo } of unmatched) {
      let typeName = findTypeName(torneo, typeByName);
      if (!typeName) {
        // Create a TournamentType on-the-fly for completely unrecognized names
        const newType = {
          id: createId(),
          name: torneo,
          slug: torneo.toLowerCase().replace(/[^a-z0-9]/g, ""),
          order: 999,
          category: "primerorden",
        };
        await prisma.tournamentType.upsert({
          where: { slug: newType.slug },
          create: newType,
          update: { name: newType.name },
        });
        const refreshed = await prisma.tournamentType.findMany();
        refreshed.forEach(t => typeByName.set(t.name, t));
        typeName = torneo;
      }
      const type = typeByName.get(typeName)!;
      const seasonMatch = torneo.match(/T(\d+)/i);
      const season = seasonMatch ? parseInt(seasonMatch[1]) : null;
      await prisma.tournament.upsert({
        where: { torneo },
        create: {
          id: createId(),
          tournamentTypeId: type.id,
          season,
          torneo,
          isSubEntry: true, // these are unusual/one-off stages
        },
        update: {},
      });
    }

    // Re-run backfill for newly created rows
    const backfilled2 = await prisma.$executeRaw`
      UPDATE "Match" m
      SET "tournamentId" = t.id
      FROM "Tournament" t
      WHERE m.torneo = t.torneo AND m."tournamentId" IS NULL
    `;
    console.log(`Backfilled ${backfilled2} additional matches`);
  }

  const nullCount = await prisma.match.count({ where: { tournamentId: null } });
  if (nullCount > 0) {
    console.warn(`⚠️  ${nullCount} matches still have NULL tournamentId`);
  } else {
    console.log("✓ All matches have a tournamentId");
  }

  await prisma.$disconnect();
}

function findTypeName(torneo: string, typeByName: Map<string, any>): string | null {
  // Try longest match first
  let best: string | null = null;
  for (const name of typeByName.keys()) {
    if (torneo.startsWith(name)) {
      if (!best || name.length > best.length) best = name;
    }
  }
  return best;
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
