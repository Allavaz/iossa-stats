import { config } from "dotenv";
config({ path: new URL("../.env.local", import.meta.url).pathname });
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
import fs from "fs";
import path from "path";

interface TorneoEntry {
  torneo: string;
  query?: string;
  tabla?: string;
  challonge?: string;
}

interface SeasonData {
  temporada: string;
  titulo: string;
  torneos: TorneoEntry[];
}

function extractSeason(torneoName: string): number | null {
  const match = torneoName.match(/t(\d+)/i);
  return match ? parseInt(match[1]) : null;
}

function extractSeasonFromTemporada(temporada: string): number | null {
  const match = temporada.match(/^t(\d+)$/i);
  if (!match) return null;
  return parseInt(match[1]); // returns 0 for t0, which is valid
}

function extractQueryCode(query: string | undefined): string | null {
  if (!query) return null;
  // strip trailing season number to get the base type query code
  return query.toLowerCase().replace(/t\d+[a-z]?$/, "") || query.toLowerCase();
}

function getBaseTypeName(torneoName: string): string {
  return torneoName.replace(/\s*t\d+(\s*-\s*.*)?$/i, '').trim();
}

async function seedTournaments() {
  const filePath = path.join(process.cwd(), "utils", "Torneos.json");
  const rawData = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(rawData) as SeasonData[];

  const tournamentTypeMap = new Map<string, number>();
  const parentMap = new Map<string, number>();

  for (const season of data) {
    if (season.temporada !== "all") continue;
    for (const tt of season.torneos) {
      const queryCode = extractQueryCode(tt.query);
      const whereClause = queryCode ? { queryCode } : { name: tt.torneo };
      const exists = await prisma.tournamentType.findUnique({ where: whereClause });
      if (exists) {
        tournamentTypeMap.set(tt.torneo, exists.id);
        continue;
      }

      let tier: string | null = null;
      if (tt.query) {
        const t = tt.query.toLowerCase();
        if (["d1", "master", "cv", "maradei", "recopamaster", "recopamaradei", "supercopamaster", "supercopacasana", "america", "copadelsur", "cg", "lm", "ddh", "sd1", "lz", "cd1", "izoro"].includes(t)) {
          tier = "primerorden";
        } else if (["d2", "cd2", "izplata"].includes(t)) {
          tier = "segundoorden";
        } else if (["d3", "d4", "cd3"].includes(t)) {
          tier = "tercerorden";
        }
      }

      const created = await prisma.tournamentType.create({
        data: {
          name: tt.torneo,
          queryCode: queryCode,
          tier: tier,
          isSelecciones: ["Copa America", "Copa del Sur"].includes(tt.torneo)
        }
      });
      tournamentTypeMap.set(tt.torneo, created.id);
    }
  }

  console.log(`Created ${tournamentTypeMap.size} tournament types`);

  // create promotion TournamentTypes and wire up the FKs
  const promotions: { name: string; between: [string, string] }[] = [
    { name: "Promoción D1/D2", between: ["Liga D1", "Liga D2"] },
    { name: "Promoción D2/D3", between: ["Liga D2", "Liga D3"] },
    { name: "Promoción D3/D4", between: ["Liga D3", "Liga D4"] },
  ];

  for (const promo of promotions) {
    const t1Id = tournamentTypeMap.get(promo.between[0]);
    const t2Id = tournamentTypeMap.get(promo.between[1]);
    if (!t1Id || !t2Id) continue;

    await prisma.tournamentType.upsert({
      where: { name: promo.name },
      create: {
        name: promo.name,
        queryCode: null,
        promotionBetween1Id: t1Id,
        promotionBetween2Id: t2Id,
      },
      update: {
        promotionBetween1Id: t1Id,
        promotionBetween2Id: t2Id,
      },
    });
  }

  const seasonBlocks = data.filter(s =>
    !["all", "primerorden", "segundoorden", "tercerorden"].includes(s.temporada)
  );

  // Pass 1: create parent tournaments (entries with a query field)
  for (const season of seasonBlocks) {
    const seasonNum = season.temporada === "selecciones"
      ? null
      : extractSeasonFromTemporada(season.temporada);
    // reject non-season temporadas that aren't selecciones
    if (seasonNum === null && season.temporada !== "selecciones") continue;

    for (const tt of season.torneos) {
      if (!tt.query) continue;

      const baseTypeName = getBaseTypeName(tt.torneo);
      const typeId = tournamentTypeMap.get(baseTypeName);
      if (!typeId) continue;

      const queryCode = tt.query.toLowerCase();

      const existing = await prisma.tournament.findUnique({ where: { queryCode } });
      if (existing) {
        if (seasonNum !== null) parentMap.set(`${baseTypeName}|${seasonNum}`, existing.id);
        continue;
      }

      const created = await prisma.tournament.create({
        data: {
          name: tt.torneo,
          queryCode,
          season: seasonNum,
          tournamentTypeId: typeId
        }
      });
      if (seasonNum !== null) parentMap.set(`${baseTypeName}|${seasonNum}`, created.id);
    }
  }

  // Pass 2: create sub-tournaments (entries with tabla but no query) and no-key entries
  for (const season of seasonBlocks) {
    const seasonNum = season.temporada === "selecciones"
      ? null
      : extractSeasonFromTemporada(season.temporada);
    if (seasonNum === null && season.temporada !== "selecciones") continue;

    for (const tt of season.torneos) {
      if (tt.query) continue; // already handled in pass 1

      const parentName = getBaseTypeName(tt.torneo);
      const parentKey = seasonNum !== null ? `${parentName}|${seasonNum}` : null;
      const parentId = parentKey ? parentMap.get(parentKey) : undefined;
      const typeId = tournamentTypeMap.get(parentName);

      if (tt.tabla) {
        // sub-tournament: use tabla as queryCode
        const queryCode = tt.tabla.toLowerCase();
        const existing = await prisma.tournament.findFirst({ where: { queryCode } });
        if (existing) continue;

        await prisma.tournament.create({
          data: {
            name: tt.torneo,
            queryCode,
            season: seasonNum,
            tournamentTypeId: typeId ?? 1,
            parentId: parentId ?? null
          }
        });
      } else {
        // no query, no tabla — create with null queryCode, matched by exact torneo name
        const existing = await prisma.tournament.findFirst({ where: { name: tt.torneo } });
        if (existing) continue;

        await prisma.tournament.create({
          data: {
            name: tt.torneo,
            queryCode: null,
            season: seasonNum,
            tournamentTypeId: typeId ?? 1,
            parentId: parentId ?? null
          }
        });
      }
    }
  }

  const totalTournaments = await prisma.tournament.count();
  console.log(`Total tournaments: ${totalTournaments}`);
}

seedTournaments()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });