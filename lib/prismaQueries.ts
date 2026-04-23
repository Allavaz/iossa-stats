import { Prisma } from "../generated/prisma/client";

export type TournamentQuery = {
  tournamentTypeId?: number;
  parentId?: number;
  season?: number;
  queryCode?: string;
  isPromotion?: boolean;
};

function getTournamentQuery(arg: string): TournamentQuery | null {
  const tempregex = /^t([0-9]+)$/i;
  const d1regex = /^d1t([0-9]+)$/i;
  const d2regex = /^d2t([0-9]+)$/i;
  const d3regex = /^d3t([0-9]+)$/i;
  const d4regex = /^d4t([0-9]+)$/i;
  const sd1regex = /^sd1t([0-9]+)$/i;
  const lzregex = /^lzt([0-9]+)$/i;
  const masterregex = /^mastert([0-9]+)$/i;
  const cvregex = /^cvt([0-9]+)$/i;
  const recopamasterregex = /^recopamastert([0-9]+)$/i;
  const supercopamasterregex = /^supercopamastert([0-9]+)$/i;
  const supercopacasanaregex = /^supercopacasanat([0-9]+)$/i;
  const maradeiregex = /^maradeit([0-9]+)$/i;
  const recopamaradeiregex = /^recopamaradeit([0-9]+)$/i;
  const lmregex = /^lmt([0-9]+)$/i;
  const ddhregex = /^ddht([0-9]+)$/i;
  const americaregex = /^americat([0-9]+)$/i;
  const copadelsurregex = /^copadelsurt([0-9]+)$/i;
  const cd1regex = /^cd1t([0-9]+)$/i;
  const cd2regex = /^cd2t([0-9]+)$/i;
  const cd3regex = /^cd3t([0-9]+)$/i;
  const cgregex = /^cgt([0-9]+)$/i;

  const seasonMatch = (regex: RegExp, prefix: string) => {
    const match = arg.match(regex);
    if (match) {
      return { season: parseInt(match[1]), prefix };
    }
    return null;
  };

  if (arg === "all") {
    return {};
  }

  if (arg === "d1") {
    return { isPromotion: true, queryCode: "d1" };
  }
  if (arg === "d2") {
    return { isPromotion: true, queryCode: "d2" };
  }
  if (arg === "d3") {
    return { isPromotion: true, queryCode: "d3" };
  }
  if (arg === "d4") {
    return { isPromotion: true, queryCode: "d4" };
  }
  if (arg === "master") {
    return { queryCode: "master" };
  }
  if (arg === "cv") {
    return { queryCode: "cv" };
  }
  if (arg === "lm") {
    return { queryCode: "lm" };
  }
  if (arg === "ddh") {
    return { queryCode: "ddh" };
  }
  if (arg === "sd1") {
    return { queryCode: "sd1" };
  }
  if (arg === "lz") {
    return { queryCode: "lz" };
  }
  if (arg === "supercopamaster") {
    return { queryCode: "supercopamaster" };
  }
  if (arg === "supercopacasana") {
    return { queryCode: "supercopacasana" };
  }
  if (arg === "recopamaster") {
    return { queryCode: "recopamaster" };
  }
  if (arg === "recopamaradei") {
    return { queryCode: "recopamaradei" };
  }
  if (arg === "america") {
    return { queryCode: "america" };
  }
  if (arg === "copadelsur") {
    return { queryCode: "copadelsur" };
  }
  if (arg === "cd1") {
    return { queryCode: "cd1" };
  }
  if (arg === "cd2") {
    return { queryCode: "cd2" };
  }
  if (arg === "cd3") {
    return { queryCode: "cd3" };
  }
  if (arg === "cg") {
    return { queryCode: "cg" };
  }
  if (arg === "izoro") {
    return { queryCode: "izoro" };
  }
  if (arg === "izplata") {
    return { queryCode: "izplata" };
  }

  if (tempregex.test(arg)) {
    const match = arg.match(tempregex);
    return { season: parseInt(match[1]) };
  }

  const simpleTournaments: Record<string, string> = {
    d1: "d1",
    d2: "d2",
    d3: "d3",
    d4: "d4"
  };

  const prefixMatch = simpleTournaments[arg];
  if (prefixMatch) {
    return { queryCode: prefixMatch };
  }

  const seasonResults = [
    seasonMatch(d1regex, "d1"),
    seasonMatch(d2regex, "d2"),
    seasonMatch(d3regex, "d3"),
    seasonMatch(d4regex, "d4"),
    seasonMatch(sd1regex, "sd1"),
    seasonMatch(lzregex, "lz"),
    seasonMatch(masterregex, "master"),
    seasonMatch(cvregex, "cv"),
    seasonMatch(recopamasterregex, "recopamaster"),
    seasonMatch(supercopamasterregex, "supercopamaster"),
    seasonMatch(supercopacasanaregex, "supercopacasana"),
    seasonMatch(maradeiregex, "maradei"),
    seasonMatch(recopamaradeiregex, "recopamaradei"),
    seasonMatch(lmregex, "lm"),
    seasonMatch(ddhregex, "ddh"),
    seasonMatch(americaregex, "america"),
    seasonMatch(copadelsurregex, "copadelsur"),
    seasonMatch(cd1regex, "cd1"),
    seasonMatch(cd2regex, "cd2"),
    seasonMatch(cd3regex, "cd3"),
    seasonMatch(cgregex, "cg")
  ].filter(Boolean);

  for (const result of seasonResults) {
    if (result) {
      return { season: result.season, queryCode: result.prefix };
    }
  }

  return null;
}

export function buildTournamentFilter(arg: string): Prisma.MatchWhereInput {
  const query = getTournamentQuery(arg);

  if (!query || Object.keys(query).length === 0) {
    return {};
  }

  if (query.season && !query.queryCode) {
    return {
      tournament: {
        season: query.season
      }
    };
  }

  if (query.isPromotion) {
    const code = query.queryCode;
    return {
      OR: [
        {
          tournament: {
            tournamentType: {
              queryCode: code
            }
          }
        },
        {
          tournament: {
            tournamentType: {
              promotionBetween1: {
                queryCode: code
              }
            }
          }
        },
        {
          tournament: {
            tournamentType: {
              promotionBetween2: {
                queryCode: code
              }
            }
          }
        }
      ]
    };
  }

  if (query.queryCode && query.season) {
    return {
      OR: [
        {
          tournament: {
            tournamentType: {
              queryCode: query.queryCode
            },
            season: query.season
          }
        },
        {
          tournament: {
            parent: {
              tournamentType: {
                queryCode: query.queryCode
              },
              season: query.season
            }
          }
        }
      ]
    };
  }

  if (query.queryCode) {
    return {
      OR: [
        {
          tournament: {
            tournamentType: {
              queryCode: query.queryCode
            }
          }
        },
        {
          tournament: {
            parent: {
              tournamentType: {
                queryCode: query.queryCode
              }
            }
          }
        }
      ]
    };
  }

  if (query.season) {
    return {
      tournament: {
        season: query.season
      }
    };
  }

  return {};
}

export default function queries(
  arg: string,
  _positions = false
): Prisma.MatchWhereInput {
  return buildTournamentFilter(arg);
}