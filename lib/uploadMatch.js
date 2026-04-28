import clientPromise from "./mongodb";
import { getTeams, resolveTeamName } from "./getFromDB";

export default async function uploadMatch(data, collection) {
  try {
    const teams = await getTeams();
    for (const team of data.teams ?? []) {
      delete team.teamLogo;
      delete team.shortname;
      team.teamname = resolveTeamName(team.teamname, teams);
      for (const ps of team.playerStatistics ?? []) {
        ps.info.team = resolveTeamName(ps.info.team, teams);
      }
    }
    for (const player of data.players ?? []) {
      player.info.team = resolveTeamName(player.info.team, teams);
    }
    const client = await clientPromise;
    const db = client.db();
    data.fecha = new Date(data.fecha);
    let doc = await db
      .collection(collection || process.env.DB_COLLECTION)
      .insertOne(data);
    return { _id: doc.insertedId, ...data };
  } catch (err) {
    throw new Error(err);
  }
}
