import { Prisma } from "./generated/prisma";
import { temporadaActual } from "../utils/Utils";
import prisma from "./prisma";

// ── Shared return types ──────────────────────────────────────────────────────

export type PlayerRow = {
  _id: string; steamID: string; name: string; team: string;
  matches: number; wins: number; losses: number; draws: number;
  goals: number; assists: number; shots: number; shotsontarget: number;
  passes: number; passescompleted: number; interceptions: number;
  saves: number; fouls: number; yellowcards: number; redcards: number;
  owngoals: number; offsides: number; distancecovered: number;
  possession: number; corners: number; throwins: number;
  penalties: number; freekicks: number; tackles: number;
  tacklescompleted: number; foulssuffered: number; savescaught: number;
  goalkicks: number; goalsconceded: number; secondsplayed: number;
  keypasses: number; chancescreated: number; secondassists: number;
};

export type Top10GoalsRow    = Pick<PlayerRow, "_id"|"steamID"|"name"|"team"|"matches"|"goals">;
export type Top10AssistsRow  = Pick<PlayerRow, "_id"|"steamID"|"name"|"team"|"matches"|"assists">;
export type Top10RusticosRow = Pick<PlayerRow, "_id"|"steamID"|"name"|"team"|"matches"|"redcards"|"yellowcards"|"fouls">;
export type Top10SavesRow    = Pick<PlayerRow, "_id"|"steamID"|"name"|"team"|"matches"|"savescaught"|"saves"|"goalsconceded">;
export type Top10InterceptionsRow = Pick<PlayerRow, "_id"|"steamID"|"name"|"team"|"matches"|"interceptions"|"secondsplayed">;

export type MiniPlayerRow = { steamID: string; name: string; team: string };

export type MatchRow = {
  _id: string; fecha: string; torneo: string; isdefault: boolean;
  teams: { teamname: string; side: string; score: number; scorereceived?: number; result?: number }[];
};

// Translates the tournament filter arg (e.g. "d1t5", "all", "primerorden")
// into a Postgres SIMILAR TO / LIKE / = pattern for the torneo column.
// Returns { mode, value } where mode is "exact" | "regex" | "all".
function getTorneoFilter(arg: string): { mode: "exact" | "regex" | "similar" | "all"; value?: string } {
  if (!arg || arg === "all") return { mode: "all" };

  const tempregex = /^t([0-9]+)/i;
  const d1regex = /^d1t([0-9]+)/i;
  const d2regex = /^d2t([0-9]+)/i;
  const d3regex = /^d3t([0-9]+)/i;
  const d4regex = /^d4t([0-9]+)/i;
  const cd1regex = /^cd1t([0-9]+)/i;
  const cd2regex = /^cd2t([0-9]+)/i;
  const cd3regex = /^cd3t([0-9]+)/i;
  const sd1regex = /^sd1t([0-9]+)/i;
  const lzregex = /^lzt([0-9]+)/i;
  const cgregex = /^cgt([0-9]+)/i;
  const masterregex = /^mastert([0-9]+)/i;
  const recopamasterregex = /^recopamastert([0-9]+)/i;
  const supercopamasterregex = /^supercopamastert([0-9]+)/i;
  const supercopacasanaregex = /^supercopacasanat([0-9]+)/i;
  const cvregex = /^cvt([0-9]+)/i;
  const maradeiregex = /^maradeit([0-9]+)/i;
  const recopamaradeiregex = /^recopamaradeit([0-9]+)/i;
  const lmregex = /^lmt([0-9]+)/i;
  const ddhregex = /^ddht([0-9]+)/i;
  const americaregex = /^americat([0-9]+)/i;
  const copadelsurregex = /^copadelsurt([0-9]+)/i;
  const izororegex = /^izorot([0-9]+)/i;
  const izplataregex = /^izplatat([0-9]+)/i;

  const primerOrden = [
    "Liga D1", "Copa Master", "Copa valencARc", "Copa Maradei",
    "Recopa Master", "Recopa Maradei", "Supercopa Master", "Supercopa Casana",
    "Copa America", "Copa del Sur", "Copa Gubero", "Liga Master",
    "Division de Honor", "Superliga D1", "Copa D1", "Copa Intrazonal de Oro",
  ];
  const segundoOrden = ["Liga D2", "Copa D2", "Copa Intrazonal de Plata"];
  const tercerOrden = ["Liga D3", "Copa D3", "Liga Zero", "Liga D4"];

  if (arg === "primerorden") return { mode: "similar", value: `%(${primerOrden.join("|")})%` };
  if (arg === "segundoorden") return { mode: "similar", value: `%(${segundoOrden.join("|")})%` };
  if (arg === "tercerorden") return { mode: "similar", value: `%(${tercerOrden.join("|")})%` };
  if (arg === "selecciones") return { mode: "similar", value: "%Copa (del Sur|America)%" };
  if (arg === "sd1") return { mode: "similar", value: "%Superliga D1%" };
  if (arg === "lz") return { mode: "similar", value: "%Liga Zero%" };
  if (arg === "d1") return { mode: "similar", value: "%(Liga D1|Promoción D1/D2)%" };
  if (arg === "d2") return { mode: "similar", value: "%(Liga D2|Promoción D1/D2|Promoción D2/D3)%" };
  if (arg === "d3") return { mode: "similar", value: "%(Liga D3|Promoción D2/D3|Promoción D3/D4)%" };
  if (arg === "d4") return { mode: "similar", value: "%(Liga D4|Promoción D3/D4)%" };
  if (arg === "master") return { mode: "similar", value: "%Copa Master%" };
  if (arg === "cv") return { mode: "similar", value: "%Copa valencARc%" };
  if (arg === "lm") return { mode: "similar", value: "%Liga Master%" };
  if (arg === "ddh") return { mode: "similar", value: "%Division de Honor%" };
  if (arg === "supercopamaster") return { mode: "similar", value: "%Supercopa Master%" };
  if (arg === "supercopacasana") return { mode: "similar", value: "%Supercopa Casana%" };
  if (arg === "recopamaster") return { mode: "similar", value: "%Recopa Master%" };
  if (arg === "recopamaradei") return { mode: "similar", value: "%Recopa Maradei%" };
  if (arg === "america") return { mode: "similar", value: "%Copa America%" };
  if (arg === "copadelsur") return { mode: "similar", value: "%Copa del Sur%" };
  if (arg === "cd1") return { mode: "similar", value: "%Copa D1%" };
  if (arg === "cd2") return { mode: "similar", value: "%Copa D2%" };
  if (arg === "cd3") return { mode: "similar", value: "%Copa D3%" };
  if (arg === "maradei") return { mode: "similar", value: "%Copa Maradei%" };
  if (arg === "cg") return { mode: "similar", value: "%Copa Gubero%" };
  if (arg === "izoro") return { mode: "similar", value: "%Copa Intrazonal de Oro%" };
  if (arg === "izplata") return { mode: "similar", value: "%Copa Intrazonal de Plata%" };
  if (arg === "america21") return { mode: "similar", value: "%Copa America '21%" };
  if (arg === "america21r") return { mode: "exact", value: "Copa America '21 - Regular" };
  if (arg === "america21p") return { mode: "exact", value: "Copa America '21 - Playoff" };

  let m: RegExpMatchArray | null;
  if ((m = arg.match(tempregex))) return { mode: "similar", value: `%T${m[1]} %|%T${m[1]}` };
  if ((m = arg.match(d1regex))) return { mode: "similar", value: `%(Liga D1|Promoción D1/D2) T${m[1]}` };
  if ((m = arg.match(d2regex))) return { mode: "similar", value: `%(Liga D2|Promoción D1/D2|Promoción D2/D3) T${m[1]}` };
  if ((m = arg.match(d3regex))) return { mode: "similar", value: `%(Liga D3|Promoción D2/D3|Promoción D3/D4) T${m[1]}` };
  if ((m = arg.match(d4regex))) return { mode: "similar", value: `%(Liga D4|Promoción D3/D4) T${m[1]}` };
  if ((m = arg.match(cd1regex))) return { mode: "similar", value: `%Copa D1 T${m[1]}` };
  if ((m = arg.match(cd2regex))) return { mode: "similar", value: `%Copa D2 T${m[1]}` };
  if ((m = arg.match(cd3regex))) return { mode: "similar", value: `%Copa D3 T${m[1]}` };
  if ((m = arg.match(sd1regex))) return { mode: "similar", value: `%Superliga D1 T${m[1]}` };
  if ((m = arg.match(lzregex))) return { mode: "similar", value: `%Liga Zero T${m[1]}` };
  if ((m = arg.match(cgregex))) return { mode: "similar", value: `%Copa Gubero T${m[1]}` };
  if ((m = arg.match(masterregex))) return { mode: "similar", value: `%Copa Master T${m[1]}` };
  if ((m = arg.match(cvregex))) return { mode: "similar", value: `%Copa valencARc T${m[1]}` };
  if ((m = arg.match(recopamasterregex))) return { mode: "similar", value: `%Recopa Master T${m[1]}` };
  if ((m = arg.match(supercopamasterregex))) return { mode: "similar", value: `%Supercopa Master T${m[1]}` };
  if ((m = arg.match(supercopacasanaregex))) return { mode: "similar", value: `%Supercopa Casana T${m[1]}` };
  if ((m = arg.match(maradeiregex))) return { mode: "similar", value: `%Copa Maradei T${m[1]} - %` };
  if ((m = arg.match(recopamaradeiregex))) return { mode: "similar", value: `%Recopa Maradei T${m[1]}` };
  if ((m = arg.match(lmregex))) return { mode: "similar", value: `%Liga Master T${m[1]}` };
  if ((m = arg.match(ddhregex))) return { mode: "similar", value: `%Division de Honor T${m[1]}` };
  if ((m = arg.match(americaregex))) return { mode: "similar", value: `%Copa America T${m[1]}` };
  if ((m = arg.match(copadelsurregex))) return { mode: "similar", value: `%Copa del Sur T${m[1]} - %` };
  if ((m = arg.match(izororegex))) return { mode: "similar", value: `%Copa Intrazonal de Oro T${m[1]}` };
  if ((m = arg.match(izplataregex))) return { mode: "similar", value: `%Copa Intrazonal de Plata T${m[1]}` };

  return { mode: "all" };
}

// For standings (positions), some args resolve to an exact torneo string
function getPositionTorneo(arg: string): string | null {
  const d1regex = /^d1t([0-9]+)/i;
  const d2regex = /^d2t([0-9]+)/i;
  const d3regex = /^d3t([0-9]+)/i;
  const d4regex = /^d4t([0-9]+)/i;
  const maradeiregex = /^maradeit([0-9]+)([a-z])/i;
  const americaregex = /^americat([0-9]+)/i;
  const sd1regex = /^sd1t([0-9]+)/i;
  const lmregex = /^lmt([0-9]+)/i;
  const ddhregex = /^ddht([0-9]+)/i;
  const delsurregex = /^copadelsurt([0-9]+)([a-z])/i;
  const lzregex = /^lzt([0-9]+)/i;

  let m: RegExpMatchArray | null;
  if ((m = arg.match(d1regex))) return `Liga D1 T${m[1]}`;
  if ((m = arg.match(d2regex))) return `Liga D2 T${m[1]}`;
  if ((m = arg.match(d3regex))) return `Liga D3 T${m[1]}`;
  if ((m = arg.match(d4regex))) return `Liga D4 T${m[1]}`;
  if ((m = arg.match(maradeiregex))) return `Copa Maradei T${m[1]} - Grupo ${m[2].toUpperCase()}`;
  if ((m = arg.match(sd1regex))) return `Superliga D1 T${m[1]}`;
  if ((m = arg.match(americaregex))) return `Copa America T${m[1]}`;
  if ((m = arg.match(lmregex))) return `Liga Master T${m[1]}`;
  if ((m = arg.match(ddhregex))) return `Division de Honor T${m[1]}`;
  if ((m = arg.match(lzregex))) return `Liga Zero T${m[1]}`;
  if (arg === "lzt8a") return "Liga Zero T8 - Grupo A";
  if (arg === "lzt8b") return "Liga Zero T8 - Grupo B";
  if (arg === "america21r") return "Copa America '21 - Regular";
  if ((m = arg.match(delsurregex))) return `Copa del Sur T${m[1]} - Grupo ${m[2].toUpperCase()}`;
  return null;
}

function torneoWhere(arg: string) {
  const f = getTorneoFilter(arg);
  if (f.mode === "all") return {};
  if (f.mode === "exact") return { torneo: f.value };
  // "similar" uses Prisma's contains with mode insensitive as a fallback,
  // but we need SQL SIMILAR TO for the alternation patterns — use $queryRaw for complex queries
  // and a simple contains for basic ones. We store the pattern and handle at call site.
  return { torneo: { contains: f.value } };
}

// Shared player aggregate select fields
const playerAggSelect = `
  mp."playerId",
  p."steamId" as "_id",
  p."steamId" as "steamID",
  p."name",
  mt."teamId",
  t."name" as "team",
  COUNT(*)::int as matches,
  SUM(CASE WHEN mt.result = 1 THEN 1 ELSE 0 END)::int as wins,
  SUM(CASE WHEN mt.result = -1 THEN 1 ELSE 0 END)::int as losses,
  SUM(CASE WHEN mt.result = 0 THEN 1 ELSE 0 END)::int as draws,
  SUM(mp.goals)::int as goals,
  SUM(mp.assists)::int as assists,
  SUM(mp.shots)::int as shots,
  SUM(mp."shotsOnTarget")::int as "shotsontarget",
  SUM(mp.passes)::int as passes,
  SUM(mp."passesCompleted")::int as "passescompleted",
  SUM(mp.interceptions)::int as interceptions,
  SUM(mp.saves)::int as saves,
  SUM(mp.fouls)::int as fouls,
  SUM(mp."yellowCards")::int as "yellowcards",
  SUM(mp."redCards")::int as "redcards",
  SUM(mp."ownGoals")::int as "owngoals",
  SUM(mp.offsides)::int as offsides,
  AVG(mp."distanceCovered")::float as "distancecovered",
  AVG(mp.possession)::float as possession,
  SUM(mp.corners)::int as corners,
  SUM(mp."throwIns")::int as "throwins",
  SUM(mp.penalties)::int as penalties,
  SUM(mp."freeKicks")::int as "freekicks",
  SUM(mp.tackles)::int as tackles,
  SUM(mp."tacklesCompleted")::int as "tacklescompleted",
  SUM(mp."foulsSuffered")::int as "foulssuffered",
  SUM(mp."savesCaught")::int as "savescaught",
  SUM(mp."goalKicks")::int as "goalkicks",
  SUM(mp."goalsConceded")::int as "goalsconceded",
  SUM(mp."secondsPlayed")::int as "secondsplayed",
  SUM(mp."keyPasses")::int as "keypasses",
  SUM(mp."chancesCreated")::int as "chancescreated",
  SUM(mp."secondAssists")::int as "secondassists"
`;

const playerAggJoins = `
  FROM "MatchPlayer" mp
  JOIN "Player" p ON p.id = mp."playerId"
  JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
  JOIN "Team" t ON t.id = mt."teamId"
  JOIN "Match" m ON m.id = mp."matchId"
`;

function torneoSimilar(arg: string): string | null {
  const f = getTorneoFilter(arg);
  if (f.mode === "similar") return f.value ?? null;
  return null;
}

function torneoExact(arg: string): string | null {
  const f = getTorneoFilter(arg);
  if (f.mode === "exact") return f.value ?? null;
  return null;
}

function buildTorneoClause(arg: string, alias = "m"): string {
  if (!arg || arg === "all") return "1=1";
  const f = getTorneoFilter(arg);
  if (f.mode === "exact") return `${alias}.torneo = '${f.value!.replace(/'/g, "''")}'`;
  if (f.mode === "similar") return `${alias}.torneo SIMILAR TO '${f.value!.replace(/'/g, "''")}'`;
  return "1=1";
}

// Returns a Prisma.Sql fragment for the torneo filter — safe for use in $queryRaw tagged templates.
// Usage: Prisma.sql`... WHERE ${torneoSqlFragment(arg)} AND ...`
function torneoSqlFragment(arg: string, alias = "m"): Prisma.Sql {
  const f = getTorneoFilter(arg);
  if (f.mode === "exact") return Prisma.sql`${Prisma.raw(`"${alias}".torneo`)} = ${f.value!}`;
  if (f.mode === "similar") return Prisma.sql`${Prisma.raw(`"${alias}".torneo`)} SIMILAR TO ${f.value!}`;
  return Prisma.sql`1=1`;
}

export async function getMatches(id: string) {
  try {
    if (id === "20") {
      const docs = await prisma.match.findMany({
        orderBy: { fecha: "desc" },
        take: 20,
        select: {
          id: true,
          fecha: true,
          torneo: true,
          isDefault: true,
          MatchTeam: {
            select: {
              side: true,
              score: true,
              Team: { select: { name: true } },
            },
          },
        },
      });
      return docs.map(d => ({
        _id: d.id,
        fecha: d.fecha.toISOString(),
        torneo: d.torneo,
        isdefault: d.isDefault,
        teams: d.MatchTeam.map(mt => ({ teamname: mt.Team.name, side: mt.side, score: mt.score })),
      }));
    }

    const torneo = torneoSqlFragment(id);
    const docs = await prisma.$queryRaw<MatchRow[]>`
      SELECT m.id as "_id", m.fecha, m.torneo, m."isDefault" as isdefault,
             json_agg(json_build_object(
               'teamname', t.name,
               'side', mt.side,
               'score', mt.score,
               'scorereceived', mt."scoreReceived",
               'result', mt.result
             ) ORDER BY mt.side) as teams
      FROM "Match" m
      JOIN "MatchTeam" mt ON mt."matchId" = m.id
      JOIN "Team" t ON t.id = mt."teamId"
      WHERE ${torneo}
      GROUP BY m.id
      ORDER BY m.fecha DESC
    `;
    return docs.map(d => ({ ...d, fecha: new Date(d.fecha).toISOString() }));
  } catch (error) {
    console.error(error);
  }
}

export async function getMatchesAPI(id: string) {
  try {
    const torneo = torneoSqlFragment(id);
    const docs = await prisma.$queryRaw<MatchRow[]>`
      SELECT m.id as "_id", m.fecha, m.torneo, m."isDefault" as isdefault,
             m.vod, m."serverName", m."mapName", m.format, m."startTime", m."endTime", m.periods,
             json_agg(DISTINCT jsonb_build_object(
               'teamname', t.name,
               'side', mt.side,
               'score', mt.score,
               'scorereceived', mt."scoreReceived",
               'result', mt.result
             )) as teams
      FROM "Match" m
      JOIN "MatchTeam" mt ON mt."matchId" = m.id
      JOIN "Team" t ON t.id = mt."teamId"
      WHERE ${torneo}
      GROUP BY m.id
      ORDER BY m.fecha DESC
    `;
    return docs.map(d => ({ ...d, fecha: new Date(d.fecha).toISOString() }));
  } catch (error) {
    console.error(error);
  }
}

export async function getMatch(id: string) {
  try {
    const isMongoId = /^[a-f0-9]{24}$/i.test(id);
    const where = isMongoId ? { mongoId: id } : { id };
    const doc = await prisma.match.findUnique({
      where,
      include: {
        MatchTeam: {
          orderBy: { side: "desc" }, // "home" > "away" alphabetically → home first
          include: {
            Team: true,
            MatchPlayer: {
              include: { Player: true },
            },
          },
        },
        MatchEvent: { orderBy: { second: "asc" } },
      },
    });
    if (!doc) return null;
    return {
      _id: doc.id,
      fecha: doc.fecha.toISOString(),
      torneo: doc.torneo,
      isdefault: doc.isDefault,
      vod: doc.vod,
      teams: doc.MatchTeam.map(mt => ({
        teamname: mt.Team.name,
        side: mt.side,
        score: mt.score,
        scorereceived: mt.scoreReceived,
        result: mt.result,
        statistics: {
          shots: mt.shots, shotsontarget: mt.shotsOnTarget, possession: mt.possession,
          passes: mt.passes, passescompleted: mt.passesCompleted, fouls: mt.fouls,
          yellowcards: mt.yellowCards, redcards: mt.redCards, offsides: mt.offsides,
          corners: mt.corners, throwins: mt.throwIns, penalties: mt.penalties,
          freekicks: mt.freeKicks, foulssuffered: mt.foulsSuffered,
          goalsconceded: mt.goalsConceded, interceptions: mt.interceptions,
          owngoals: mt.ownGoals, tackles: mt.tackles, tacklescompleted: mt.tacklesCompleted,
          saves: mt.saves, savescaught: mt.savesCaught, distancecovered: mt.distanceCovered,
          assists: mt.assists, goalkicks: mt.goalKicks, keypasses: mt.keyPasses,
          chancescreated: mt.chancesCreated, secondassists: mt.secondAssists,
        },
        playerStatistics: mt.MatchPlayer.map(mp => ({
          info: { name: mp.Player.name, steam_id: mp.Player.steamId, team: mt.Team.name },
          statistics: {
            goals: mp.goals, assists: mp.assists, shots: mp.shots, shotsontarget: mp.shotsOnTarget,
            passes: mp.passes, passescompleted: mp.passesCompleted, interceptions: mp.interceptions,
            saves: mp.saves, fouls: mp.fouls, yellowcards: mp.yellowCards, redcards: mp.redCards,
            owngoals: mp.ownGoals, offsides: mp.offsides, distancecovered: mp.distanceCovered,
            possession: mp.possession, corners: mp.corners, throwins: mp.throwIns,
            penalties: mp.penalties, freekicks: mp.freeKicks, tackles: mp.tackles,
            tacklescompleted: mp.tacklesCompleted, foulssuffered: mp.foulsSuffered,
            savescaught: mp.savesCaught, goalkicks: mp.goalKicks, goalsconceded: mp.goalsConceded,
            secondsplayed: mp.secondsPlayed, keypasses: mp.keyPasses,
            chancescreated: mp.chancesCreated, secondassists: mp.secondAssists,
            positions: (mp.positions as any[]) ?? [],
          },
        })),
      })),
      matchevents: (() => {
        const nameMap = new Map<string, string>();
        for (const mt of doc.MatchTeam) {
          for (const mp of mt.MatchPlayer) {
            nameMap.set(mp.Player.steamId, mp.Player.name);
          }
        }
        return doc.MatchEvent.map(e => ({
          second: e.second,
          event: e.event,
          period: e.period,
          team: e.team,
          player1SteamId: e.player1SteamId,
          player2SteamId: e.player2SteamId,
          player3SteamId: e.player3SteamId,
          bodyPart: e.bodyPart,
          startPosition: e.posX != null ? { x: e.posX, y: e.posY } : null,
          name: nameMap.get(e.player1SteamId) ?? e.player1SteamId,
          name2: e.player2SteamId ? (nameMap.get(e.player2SteamId) ?? e.player2SteamId) : undefined,
          name3: e.player3SteamId ? (nameMap.get(e.player3SteamId) ?? e.player3SteamId) : undefined,
        }));
      })(),
    };
  } catch {
    return null;
  }
}

export async function getPlayers(arg: "mini"): Promise<MiniPlayerRow[]>;
export async function getPlayers(arg: string): Promise<PlayerRow[]>;
export async function getPlayers(arg: string): Promise<PlayerRow[] | MiniPlayerRow[]> {
  try {
    if (arg === "mini") {
      return prisma.$queryRaw<MiniPlayerRow[]>`
        SELECT DISTINCT ON (p."steamId") p."steamId" as "steamID", p.name, t.name as team
        FROM "MatchPlayer" mp
        JOIN "Player" p ON p.id = mp."playerId"
        JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
        JOIN "Team" t ON t.id = mt."teamId"
        ORDER BY p."steamId", mp."matchId" DESC
      `;
    }

    const torneo = torneoSqlFragment(arg);
    return prisma.$queryRaw<PlayerRow[]>`
      SELECT ${Prisma.raw(playerAggSelect)}
      ${Prisma.raw(playerAggJoins)}
      WHERE ${torneo}
      GROUP BY mp."playerId", p."steamId", p.name, mt."teamId", t.name
      ORDER BY t.name ASC, p.name ASC
    `;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPlayer(steam_id: string, arg: string): Promise<PlayerRow | null> {
  try {
    const torneo = torneoSqlFragment(arg);
    const docs = await prisma.$queryRaw<PlayerRow[]>`
      SELECT ${Prisma.raw(playerAggSelect)}
      ${Prisma.raw(playerAggJoins)}
      WHERE p."steamId" = ${steam_id} AND ${torneo}
      GROUP BY mp."playerId", p."steamId", p.name, mt."teamId", t.name
    `;
    return docs[0] ?? null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getTeamPlayers(teamname: string, arg: string): Promise<PlayerRow[]> {
  try {
    const torneo = torneoSqlFragment(arg);
    return prisma.$queryRaw<PlayerRow[]>`
      SELECT ${Prisma.raw(playerAggSelect)}
      ${Prisma.raw(playerAggJoins)}
      WHERE t.name = ${teamname} AND ${torneo}
      GROUP BY mp."playerId", p."steamId", p.name, mt."teamId", t.name
      ORDER BY p.name ASC
    `;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTeamMatches(teamname: string, arg: string): Promise<MatchRow[]> {
  try {
    const torneo = torneoSqlFragment(arg);
    const docs = await prisma.$queryRaw<MatchRow[]>`
      SELECT m.id as "_id", m.fecha, m.torneo, m."isDefault" as isdefault,
             json_agg(json_build_object(
               'teamname', t2.name, 'side', mt2.side,
               'score', mt2.score, 'scorereceived', mt2."scoreReceived", 'result', mt2.result
             ) ORDER BY mt2.side) as teams
      FROM "Match" m
      JOIN "MatchTeam" mt ON mt."matchId" = m.id
      JOIN "Team" t ON t.id = mt."teamId" AND t.name = ${teamname}
      JOIN "MatchTeam" mt2 ON mt2."matchId" = m.id
      JOIN "Team" t2 ON t2.id = mt2."teamId"
      WHERE ${torneo}
      GROUP BY m.id
      ORDER BY m.fecha DESC
    `;
    return docs.map(d => ({ ...d, fecha: new Date(d.fecha).toISOString() }));
  } catch (error) {
    console.error(error);
  }
}

export async function getPositions(arg: string) {
  try {
    const torneo = getPositionTorneo(arg);
    if (!torneo) return [];
    const docs = await prisma.$queryRaw<any[]>`
      SELECT t.name as "_id",
             COUNT(*)::int as "PJ",
             SUM(CASE WHEN mt.result = 1 THEN 3 WHEN mt.result = 0 THEN 1 ELSE 0 END)::int as "Pts",
             SUM(mt.score)::int as "GF",
             SUM(mt."scoreReceived")::int as "GC",
             SUM(CASE WHEN mt.result = 1 THEN 1 ELSE 0 END)::int as "PG",
             SUM(CASE WHEN mt.result = 0 THEN 1 ELSE 0 END)::int as "PE",
             SUM(CASE WHEN mt.result = -1 THEN 1 ELSE 0 END)::int as "PP",
             (SUM(mt.score) - SUM(mt."scoreReceived"))::int as "DF",
             (SELECT array_agg(mt2.result ORDER BY m2.fecha DESC)
              FROM "MatchTeam" mt2
              JOIN "Match" m2 ON m2.id = mt2."matchId"
              WHERE mt2."teamId" = mt."teamId" AND m2.torneo = ${torneo}
              LIMIT 5) as last5
      FROM "MatchTeam" mt
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mt."matchId"
      WHERE m.torneo = ${torneo}
      GROUP BY t.name, mt."teamId"
      ORDER BY "Pts" DESC, "PJ" ASC, "DF" DESC
    `;
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getManyPositions(ids: string[]) {
  if (!ids.length) return [];
  try {
    return Promise.all(ids.map(id => getPositions(id)));
  } catch (error) {
    console.error(error);
  }
}

export async function getTournamentPosition(teamname: string, tournament: string) {
  try {
    const docs = await prisma.$queryRaw<any[]>`
      SELECT t.name as "_id",
             SUM(CASE WHEN mt.result = 1 THEN 3 WHEN mt.result = 0 THEN 1 ELSE 0 END)::int as "Pts",
             (SUM(mt.score) - SUM(mt."scoreReceived"))::int as "DF",
             COUNT(*)::int as "PJ"
      FROM "MatchTeam" mt
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mt."matchId"
      WHERE m.torneo = ${tournament}
      GROUP BY t.name
      ORDER BY "Pts" DESC, "PJ" ASC, "DF" DESC
    `;
    return docs.findIndex(d => d._id === teamname) + 1;
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayerMatches(steamId: string): Promise<MatchRow[]> {
  try {
    const docs = await prisma.$queryRaw<MatchRow[]>`
      SELECT m.id as "_id", m.fecha, m.torneo, m."isDefault" as isdefault,
             json_agg(json_build_object(
               'teamname', t.name, 'side', mt.side,
               'score', mt.score, 'scorereceived', mt."scoreReceived", 'result', mt.result
             ) ORDER BY mt.side) as teams
      FROM "Match" m
      JOIN "MatchTeam" mt ON mt."matchId" = m.id
      JOIN "Team" t ON t.id = mt."teamId"
      WHERE m.id IN (
        SELECT mp."matchId" FROM "MatchPlayer" mp
        JOIN "Player" p ON p.id = mp."playerId"
        WHERE p."steamId" = ${steamId}
      )
      GROUP BY m.id
      ORDER BY m.fecha DESC
    `;
    return docs.map(d => ({ ...d, fecha: new Date(d.fecha).toISOString() }));
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayerTournaments(steamId: string) {
  try {
    const docs = await prisma.$queryRaw<any[]>`
      SELECT m.torneo as "_id",
             COUNT(*)::int as matches,
             t.name as team,
             MIN(m.fecha) as firstmatch,
             MAX(m.fecha) as lastmatch
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "Match" m ON m.id = mp."matchId"
      JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
      JOIN "Team" t ON t.id = mt."teamId"
      WHERE p."steamId" = ${steamId}
      GROUP BY m.torneo, t.name
      ORDER BY MIN(m.fecha) DESC
    `;
    return docs.map(d => ({
      ...d,
      firstmatch: new Date(d.firstmatch).toISOString(),
      lastmatch: new Date(d.lastmatch).toISOString(),
    }));
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayerTeamHistory(steamId: string): Promise<{ team: string; firstMatch: string; lastMatch: string }[]> {
  try {
    const docs = await prisma.$queryRaw<{ team: string; firstmatch: Date; lastmatch: Date }[]>`
      SELECT t.name as team, MIN(m.fecha) as firstmatch, MAX(m.fecha) as lastmatch
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "Match" m ON m.id = mp."matchId"
      JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
      JOIN "Team" t ON t.id = mt."teamId"
      WHERE p."steamId" = ${steamId}
      GROUP BY t.name
      ORDER BY MIN(m.fecha) ASC
    `;
    return docs.map(d => ({
      team: d.team,
      firstMatch: new Date(d.firstmatch).toISOString(),
      lastMatch: new Date(d.lastmatch).toISOString(),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getPlayerPositions(steamId: string, arg: string): Promise<{ position: string; seconds: number }[]> {
  try {
    const torneo = torneoSqlFragment(arg);
    // positions is a JSON array [{position, seconds}] — unnest via jsonb
    return prisma.$queryRaw<{ position: string; seconds: number }[]>`
      SELECT pos->>'position' as position, SUM((pos->>'seconds')::int)::int as seconds
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "Match" m ON m.id = mp."matchId",
      jsonb_array_elements(mp.positions::jsonb) as pos
      WHERE p."steamId" = ${steamId} AND ${torneo}
      GROUP BY pos->>'position'
      ORDER BY seconds DESC
      LIMIT 3
    `;
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayerScoredTeams(steamId: string) {
  try {
    // Goals scored against opposing team (the team the player did NOT play for)
    const docs = await prisma.$queryRaw<any[]>`
      SELECT opp.name as teamname, SUM(mp.goals)::int as goalsscored
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
      JOIN "MatchTeam" omt ON omt."matchId" = mt."matchId" AND omt.id != mt.id
      JOIN "Team" opp ON opp.id = omt."teamId"
      WHERE p."steamId" = ${steamId}
      GROUP BY opp.name
      HAVING SUM(mp.goals) > 0
      ORDER BY goalsscored DESC
      LIMIT 10
    `;
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamStats(teamname: string, arg: string) {
  try {
    const torneo = torneoSqlFragment(arg);
    const docs = await prisma.$queryRaw<{ _id: string; name: string; matches: number; goals: number; assists: number; wins: number; draws: number; losses: number }[]>`
      SELECT t.name as "_id", t.name as name,
             COUNT(*)::int as matches,
             SUM(mt.score)::int as goals,
             SUM(mt.assists)::int as assists,
             SUM(CASE WHEN mt.result = 1 THEN 1 ELSE 0 END)::int as wins,
             SUM(CASE WHEN mt.result = 0 THEN 1 ELSE 0 END)::int as draws,
             SUM(CASE WHEN mt.result = -1 THEN 1 ELSE 0 END)::int as losses
      FROM "MatchTeam" mt
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mt."matchId"
      WHERE t.name = ${teamname} AND ${torneo}
      GROUP BY t.name
    `;
    return docs[0] ?? null;
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamTournaments(teamname: string) {
  try {
    const docs = await prisma.$queryRaw<any[]>`
      SELECT m.torneo as "_id",
             COUNT(*)::int as matches,
             MIN(m.fecha) as firstmatch,
             MAX(m.fecha) as lastmatch
      FROM "MatchTeam" mt
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mt."matchId"
      WHERE t.name = ${teamname}
      GROUP BY m.torneo
      ORDER BY MIN(m.fecha) DESC
    `;
    return docs.map(d => ({
      ...d,
      firstmatch: new Date(d.firstmatch).toISOString(),
      lastmatch: new Date(d.lastmatch).toISOString(),
    }));
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamRivals(teamname: string) {
  try {
    // For each match the team played, get the opponent's result (wins/losses are from opponent's perspective)
    const docs = await prisma.$queryRaw<any[]>`
      SELECT opp.name as "_id",
             COUNT(*)::int as matches,
             SUM(CASE WHEN omt.result = -1 THEN 1 ELSE 0 END)::int as wins,
             SUM(CASE WHEN omt.result = 1 THEN 1 ELSE 0 END)::int as losses,
             SUM(CASE WHEN omt.result = 0 THEN 1 ELSE 0 END)::int as draws
      FROM "MatchTeam" mt
      JOIN "Team" t ON t.id = mt."teamId" AND t.name = ${teamname}
      JOIN "MatchTeam" omt ON omt."matchId" = mt."matchId" AND omt.id != mt.id
      JOIN "Team" opp ON opp.id = omt."teamId"
      GROUP BY opp.name
      ORDER BY matches DESC
    `;
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamRoster(teamname: string) {
  return getTeamPlayers(teamname, temporadaActual());
}

export async function getTop10Goals(id: string): Promise<Top10GoalsRow[]> {
  try {
    const torneo = torneoSqlFragment(id);
    return prisma.$queryRaw<Top10GoalsRow[]>`
      SELECT p."steamId" as "_id", p."steamId" as "steamID", p.name, t.name as team,
             COUNT(*)::int as matches, SUM(mp.goals)::int as goals
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mp."matchId"
      WHERE ${torneo}
      GROUP BY p."steamId", p.name, t.name
      ORDER BY goals DESC, matches ASC LIMIT 10
    `;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTop10Assists(id: string): Promise<Top10AssistsRow[]> {
  try {
    const torneo = torneoSqlFragment(id);
    return prisma.$queryRaw<Top10AssistsRow[]>`
      SELECT p."steamId" as "_id", p."steamId" as "steamID", p.name, t.name as team,
             COUNT(*)::int as matches, SUM(mp.assists)::int as assists
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mp."matchId"
      WHERE ${torneo}
      GROUP BY p."steamId", p.name, t.name
      ORDER BY assists DESC, matches ASC LIMIT 10
    `;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTop10Rusticos(id: string): Promise<Top10RusticosRow[]> {
  try {
    const torneo = torneoSqlFragment(id);
    return prisma.$queryRaw<Top10RusticosRow[]>`
      SELECT p."steamId" as "_id", p."steamId" as "steamID", p.name, t.name as team,
             COUNT(*)::int as matches,
             SUM(mp."redCards")::int as redcards,
             SUM(mp."yellowCards")::int as yellowcards,
             SUM(mp.fouls)::int as fouls
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mp."matchId"
      WHERE ${torneo}
      GROUP BY p."steamId", p.name, t.name
      ORDER BY redcards DESC, yellowcards DESC, fouls ASC, matches ASC LIMIT 10
    `;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTop10Saves(id: string): Promise<Top10SavesRow[]> {
  try {
    const torneo = torneoSqlFragment(id);
    return prisma.$queryRaw<Top10SavesRow[]>`
      SELECT p."steamId" as "_id", p."steamId" as "steamID", p.name, t.name as team,
             COUNT(*)::int as matches,
             SUM(mp."savesCaught")::int as savescaught,
             SUM(mp.saves)::int as saves,
             SUM(mp."goalsConceded")::int as goalsconceded
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mp."matchId"
      WHERE ${torneo}
      GROUP BY p."steamId", p.name, t.name
      ORDER BY savescaught DESC, saves DESC, goalsconceded ASC, matches ASC LIMIT 10
    `;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTop10Interceptions(id: string): Promise<Top10InterceptionsRow[]> {
  try {
    const torneo = torneoSqlFragment(id);
    return prisma.$queryRaw<Top10InterceptionsRow[]>`
      SELECT p."steamId" as "_id", p."steamId" as "steamID", p.name, t.name as team,
             COUNT(*)::int as matches,
             SUM(mp.interceptions)::int as interceptions,
             SUM(mp."secondsPlayed")::int as secondsplayed
      FROM "MatchPlayer" mp
      JOIN "Player" p ON p.id = mp."playerId"
      JOIN "MatchTeam" mt ON mt.id = mp."matchTeamId"
      JOIN "Team" t ON t.id = mt."teamId"
      JOIN "Match" m ON m.id = mp."matchId"
      WHERE ${torneo}
      GROUP BY p."steamId", p.name, t.name
      ORDER BY interceptions DESC, matches ASC LIMIT 10
    `;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getTournamentWinners(torneo: string) {
  try {
    const doc = await prisma.tournament.findUnique({ where: { torneo } });
    if (!doc) return null;
    return { torneo: doc.torneo, winners: doc.winners };
  } catch {
    return null;
  }
}

export async function getPalmares(teamname?: string) {
  try {
    if (teamname) {
      const doc = await prisma.tournament.findMany({
        where: { winners: { path: ["firstPlace"], equals: teamname } },
        select: { torneo: true },
      });
      return doc.map(d => d.torneo);
    }
    // Group by firstPlace across all tournaments
    const docs = await prisma.$queryRaw<any[]>`
      SELECT winners->>'firstPlace' as "_id",
             json_agg(torneo) as torneos,
             COUNT(*)::int as wins
      FROM "Tournament"
      WHERE winners IS NOT NULL
      GROUP BY winners->>'firstPlace'
      ORDER BY wins DESC
    `;
    return docs;
  } catch (error) {
    console.error(error);
  }
}
