import { Prisma } from "../generated/prisma/client";
import { prisma } from "./prisma";

export interface StandingEntry {
  _id: string;
  teamName: string;
  PJ: number;
  Pts: number;
  GF: number;
  GC: number;
  PG: number;
  PE: number;
  PP: number;
  DF: number;
  last5: number[];
}

export async function getStandings(
  tournamentFilter: Prisma.MatchWhereInput
): Promise<StandingEntry[]> {
  const matches = await prisma.match.findMany({
    where: tournamentFilter,
    include: {
      homeTeam: true,
      awayTeam: true
    },
    orderBy: { date: "desc" }
  });

  const teamStats = new Map<
    string,
    {
      PJ: number;
      PG: number;
      PE: number;
      PP: number;
      GF: number;
      GC: number;
      results: number[];
    }
  >();

  for (const match of matches) {
    const homeName = match.homeTeam.name;
    const awayName = match.awayTeam.name;
    const homeScore = match.homeScore;
    const awayScore = match.awayScore;

    if (!teamStats.has(homeName)) {
      teamStats.set(homeName, {
        PJ: 0,
        PG: 0,
        PE: 0,
        PP: 0,
        GF: 0,
        GC: 0,
        results: []
      });
    }
    if (!teamStats.has(awayName)) {
      teamStats.set(awayName, {
        PJ: 0,
        PG: 0,
        PE: 0,
        PP: 0,
        GF: 0,
        GC: 0,
        results: []
      });
    }

    const home = teamStats.get(homeName)!;
    const away = teamStats.get(awayName)!;

    home.PJ++;
    away.PJ++;
    home.GF += homeScore;
    home.GC += awayScore;
    away.GF += awayScore;
    away.GC += homeScore;

    if (homeScore > awayScore) {
      home.PG++;
      home.results.push(1);
      away.PP++;
      away.results.push(-1);
    } else if (homeScore < awayScore) {
      away.PG++;
      away.results.push(1);
      home.PP++;
      home.results.push(-1);
    } else {
      home.PE++;
      home.results.push(0);
      away.PE++;
      away.results.push(0);
    }
  }

  const standings: StandingEntry[] = Array.from(teamStats.entries()).map(
    ([name, stats]) => ({
      _id: name,
      teamName: name,
      PJ: stats.PJ,
      Pts: stats.PG * 3 + stats.PE,
      GF: stats.GF,
      GC: stats.GC,
      PG: stats.PG,
      PE: stats.PE,
      PP: stats.PP,
      DF: stats.GF - stats.GC,
      last5: stats.results.slice(0, 5)
    })
  );

  standings.sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (a.PJ !== b.PJ) return a.PJ - b.PJ;
    if (b.DF !== a.DF) return b.DF - a.DF;
    return a.teamName.localeCompare(b.teamName);
  });

  return standings;
}

export async function getManyStandings(
  tournamentFilters: Prisma.MatchWhereInput[]
): Promise<StandingEntry[][]> {
  return Promise.all(tournamentFilters.map(filter => getStandings(filter)));
}
