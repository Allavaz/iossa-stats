import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import positions from "./aggregations/positions";
import players from "./aggregations/players";
import queries from "./aggregations/queries";
import top10goals from "./aggregations/top10Goals";
import top10assists from "./aggregations/top10Assists";
import top10rusticos from "./aggregations/top10Rusticos";

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
          "teams.teamname": 1,
          "teams.side": 1,
          "teams.score": 1
        })
        .limit(20)
        .toArray();
    } else {
      docs = await db
        .collection(process.env.DB_COLLECTION)
        .find(queries[id])
        .sort({ fecha: -1 })
        .project({ fecha: 1, torneo: 1, teams: 1 })
        .toArray();
    }
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getPositions(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .aggregate(positions(id))
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}

export async function getManyPositions(ids) {
  let tables = [];
  if (ids.length) {
    try {
      const client = await clientPromise;
      const db = client.db();
      for (let i in ids) {
        let doc = await db
          .collection(process.env.DB_COLLECTION)
          .aggregate(positions(ids[i]))
          .toArray();
        tables.push(doc);
      }
      return tables;
    } catch (error) {
      console.error(error);
    }
  }
}

export async function getMatch(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const o_id = new ObjectId(id);
    let doc = await db
      .collection(process.env.DB_COLLECTION)
      .findOne({ _id: o_id });
    return doc;
  } catch (e) {
    return null;
  }
}

export async function getPlayers(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs;
    if (id === "mini") {
      // returns only steamid, name and team
      docs = await db
        .collection(process.env.DB_COLLECTION)
        .aggregate(players("all"))
        .project({ name: true, team: true })
        .toArray();
    } else {
      docs = await db
        .collection(process.env.DB_COLLECTION)
        .aggregate(players(id))
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

export async function getPlayerMatches(id) {
  try {
    const client = await clientPromise;
    const db = client.db();
    let docs = await db
      .collection(process.env.DB_COLLECTION)
      .find({ "players.info.steam_id": id })
      .sort({ fecha: -1 })
      .toArray();
    return docs;
  } catch (error) {
    console.error(error);
  }
}
