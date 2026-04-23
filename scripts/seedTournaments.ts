import { prisma } from "@/lib/prisma";
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

function extractQueryCode(query: string | undefined): string | null {
  if (!query) return null;
  const baseMatch = query.match(/^([a-z0-9]+)/i);
  if (!baseMatch) return null;
  const prefix = baseMatch[1].toLowerCase();
  const multiCharPrefixes = [
    "d1", "d2", "d3", "d4", "sd", "cd", "lz", "cg", "lm", "ddh", "cv",
    "izoro", "izplata", "supercopacasanat"
  ];
  if (multiCharPrefixes.some(p => query.toLowerCase().startsWith(p))) {
    return query.toLowerCase();
  }
  return prefix;
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

  for (const season of data) {
    if (["all", "primerorden", "segundoorden", "tercerorden", "selecciones"].includes(season.temporada)) continue;

    const seasonNum = extractSeason(season.temporada);
    if (!seasonNum) continue;

    for (const tt of season.torneos) {
      if (!tt.query) continue;

      const baseTypeName = getBaseTypeName(tt.torneo);
      const typeId = tournamentTypeMap.get(baseTypeName);
      if (!typeId) continue;

      const queryCode = extractQueryCode(tt.query);
      if (!queryCode) continue;

      const existing = await prisma.tournament.findFirst({
        where: { queryCode: queryCode, season: seasonNum }
      });
      if (existing) {
        parentMap.set(`${baseTypeName}|${seasonNum}`, existing.id);
        continue;
      }

      const created = await prisma.tournament.create({
        data: {
          name: tt.torneo,
          queryCode: queryCode,
          season: seasonNum,
          tournamentTypeId: typeId
        }
      });
      parentMap.set(`${baseTypeName}|${seasonNum}`, created.id);
    }
  }

  for (const season of data) {
    if (["all", "primerorden", "segundoorden", "tercerorden", "selecciones"].includes(season.temporada)) continue;

    const seasonNum = extractSeason(season.temporada);
    if (!seasonNum) continue;

    for (const tt of season.torneos) {
      if (!tt.tabla || tt.query) continue;

      const parentName = getBaseTypeName(tt.torneo);
      const parentKey = `${parentName}|${seasonNum}`;
      const parentId = parentMap.get(parentKey);
      if (!parentId) continue;

      const queryCode = extractQueryCode(tt.tabla);
      const existing = await prisma.tournament.findFirst({ where: { queryCode: queryCode } });
      if (existing) continue;

      const typeId = tournamentTypeMap.get(parentName);
      await prisma.tournament.create({
        data: {
          name: tt.torneo,
          queryCode: queryCode,
          season: seasonNum,
          tournamentTypeId: typeId ?? 1,
          parentId: parentId
        }
      });
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