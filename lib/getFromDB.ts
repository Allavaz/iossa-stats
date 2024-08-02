import { ObjectId } from "mongodb";
import { Match, Player } from "../types";
import { temporadaActual } from "../utils/Utils";
import player from "./aggregations/player";
import playerPositions from "./aggregations/playerPositions";
import playerScoredTeams from "./aggregations/playerScoredTeams";
import playerTournaments from "./aggregations/playerTournaments";
import players from "./aggregations/players";
import positions from "./aggregations/positions";
import queries from "./aggregations/queries";
import team from "./aggregations/team";
import teamPlayers from "./aggregations/teamPlayers";
import teamRivals from "./aggregations/teamRivals";
import teamTournaments from "./aggregations/teamTournaments";
import top10assists from "./aggregations/top10Assists";
import top10goals from "./aggregations/top10Goals";
import top10rusticos from "./aggregations/top10Rusticos";
import top10Saves from "./aggregations/top10Saves";
import clientPromise from "./mongodb";

const OBJECT_ID_LENGTH = 24;

function serializableMatch(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    fecha: doc.fecha.toISOString()
  };
}

export async function getMatches(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs;
    if (id === "20") {
      docs = await db
        .collection(process.env.DB_COLLECTION)
        .find({})
        .sort({ fecha: -1 })
        .project({
          fecha: 1,
          torneo: 1,
          isdefault: 1,
          "teams.teamname": 1,
          "teams.side": 1,
          "teams.score": 1
        })
        .limit(20)
        .toArray();
    } else {
      docs = await db
        .collection(process.env.DB_COLLECTION)
        .find(queries(id))
        .sort({ fecha: -1 })
        .project({ fecha: 1, torneo: 1, teams: 1, isdefault: 1 })
        .toArray();
    }
    return docs.map(doc => serializableMatch(doc));
  } catch (error) {
    console.error(error);
  }
}

export async function getPositions(arg: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(positions(queries(arg, true)))
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getManyPositions(ids: string[]) {
  let tables = [];
  if (ids.length) {
    try {
      const client = await clientPromise;
      const db = client.db();
      for (let i in ids) {
        let doc = await db
          .collection(process.env.DB_COLLECTION)
          .aggregate(positions(queries(ids[i], true)))
          .toArray();
        tables.push(doc);
      }
      return tables;
    } catch (error) {
      console.error(error);
    }
  }
}

export async function getMatch(id: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const o_id = new ObjectId(id);
    let doc = await db
      .collection(process.env.DB_COLLECTION)
      .findOne({ _id: o_id });
    return serializableMatch(doc) as Match;
  } catch (e) {
    return null;
  }
}

export async function getPlayers(arg: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs;
    if (arg === "mini") {
      // returns only steamid, name and team
      docs = await db
        .collection(process.env.DB_COLLECTION)
        .aggregate(players("all"))
        .project({ name: true, team: true })
        .toArray();
    } else if (arg.length === OBJECT_ID_LENGTH) {
      const o_id = new ObjectId(arg);
      docs = await db
        .collection(process.env.DB_COLLECTION)
        .aggregate([{ $match: { _id: o_id } }, ...players("all")])
        .toArray();
    } else {
      docs = await db
        .collection(process.env.DB_COLLECTION)
        .aggregate(players(arg))
        .toArray();
    }
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTop10Goals(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(top10goals(id))
      .sort({ goals: -1, matches: 1 })
      .limit(10)
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTop10Assists(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(top10assists(id))
      .sort({ assists: -1, matches: 1 })
      .limit(10)
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTop10Rusticos(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(top10rusticos(id))
      .sort({ redcards: -1, yellowcards: -1, fouls: 1, matches: 1 })
      .limit(10)
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTop10Saves(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(top10Saves(id))
      .sort({ savescaught: -1, saves: -1, goalsconceded: 1, matches: 1 })
      .limit(10)
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayerMatches(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .find({ "players.info.steam_id": id })
      .sort({ fecha: -1 })
      .toArray();
    return docs.map(doc => serializableMatch(doc));
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayer(steam_id: string, arg: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    if (arg.length === OBJECT_ID_LENGTH) {
      const o_id = new ObjectId(arg);
      let docs = await db
        .collection(process.env.DB_COLLECTION)
        .aggregate([{ $match: { _id: o_id } }, ...player(steam_id)])
        .toArray();
      return docs[0];
    } else {
      let docs = await db
        .collection(process.env.DB_COLLECTION)
        .aggregate([{ $match: queries(arg) }, ...player(steam_id)])
        .toArray();
      return docs[0];
    }
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}

export async function getTeamPlayers(
  teamname: string,
  arg: string
): Promise<Player[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(teamPlayers(teamname, arg))
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamMatches(
  teamname: string,
  arg: string
): Promise<Match[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .find({ ...queries(arg), "teams.teamname": teamname })
      .sort({ fecha: -1 })
      .toArray();
    return docs.map(doc => serializableMatch(doc));
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamTournaments(teamname: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(teamTournaments(teamname))
      .toArray();
    return docs.map(doc => ({
      ...doc,
      firstmatch: doc.firstmatch.toISOString(),
      lastmatch: doc.lastmatch.toISOString()
    }));
  } catch (error) {
    console.error(error);
  }
}

export async function getTournamentPosition(
  teamname: string,
  tournament: string
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(positions({ torneo: tournament }))
      .toArray();
    return docs.findIndex(doc => doc._id === teamname) + 1;
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayerTournaments(steamid: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(playerTournaments(steamid))
      .toArray();
    return docs.map(doc => ({
      ...doc,
      firstmatch: doc.firstmatch.toISOString(),
      lastmatch: doc.lastmatch.toISOString()
    }));
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamRivals(teamname: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(teamRivals(teamname))
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamStats(teamname: string, arg: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(team(teamname, arg))
      .toArray();
    return docs[0];
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayerPositions(steamid: string, arg: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate([{ $match: queries(arg) }, ...playerPositions(steamid)])
      .toArray();
    return docs.map(doc => ({
      position: doc._id,
      seconds: doc.seconds
    }));
  } catch (error) {
    console.error(error);
  }
}

export async function getPlayerScoredTeams(steamid: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(playerScoredTeams(steamid))
      .toArray();
    return docs.map(doc => ({
      teamname: doc._id,
      goalsscored: doc.goalsscored
    }));
  } catch (error) {
    console.error(error);
  }
}

export async function getTeamRoster(teamname: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate([
        ...players(temporadaActual()),
        { $match: { team: teamname } }
      ])
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getTournamentWinners(torneo: string) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const doc = await db
      .collection(process.env.DB_COLLECTION_TOURNAMENTS)
      .findOne({ torneo: torneo });
    delete doc._id;
    return doc;
  } catch (error) {
    return null;
  }
}
