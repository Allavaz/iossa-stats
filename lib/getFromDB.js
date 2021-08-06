import { MongoClient, ObjectId } from "mongodb";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}:27017/?authMechanism=${authMechanism}`;
const client = new MongoClient(url, { useNewUrlParser: true });
import positions from "./aggregations/positions";
import players from "./aggregations/players";
import queries from "./aggregations/queries";
import top10goals from "./aggregations/top10Goals";
import top10assists from "./aggregations/top10Assists";
import top10rusticos from "./aggregations/top10Rusticos";

export async function getMatches(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    let docs;
    if (id === '20') {
      docs = await db.collection(process.env.DB_COLLECTION)
        .find({})
        .sort({ fecha: -1})
        .project({ fecha: 1, torneo: 1, teams: 1 })
        .limit(20)
        .toArray()
    } else {
      docs = await db.collection(process.env.DB_COLLECTION)
        .find(queries[id])
        .sort({ fecha: -1 })
        .project({ fecha: 1, torneo: 1, teams: 1 })
        .toArray()
    }
    return docs;
  } finally {
    await client.close();
  }
}

export async function getPositions(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    let docs = await db.collection(process.env.DB_COLLECTION)
      .aggregate(positions(id))
      .toArray()
    return docs;
  } finally {
    await client.close();
  }
}

export async function getManyPositions(ids) {
  let tables = [];
  if (ids.length) {
    try {
      await client.connect();
      const db = client.db(process.env.DB_NAME);
      for (let i in ids) {
        let doc = await db.collection(process.env.DB_COLLECTION)
          .aggregate(positions(ids[i]))
          .toArray()
        tables.push(doc);
      }
      return tables;
    } finally {
      await client.close();
    }
  }
}

export async function getMatch(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const o_id = new ObjectId(id);
    let doc = await db.collection(process.env.DB_COLLECTION)
      .findOne({_id: o_id})
    return doc;
  } catch(e) {
    return null;
  } finally {
    await client.close();
  }
}

export async function getPlayers(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    let docs = await db.collection(process.env.DB_COLLECTION)
      .aggregate(players(id))
      .toArray()
    return docs;
  } finally {
    await client.close();
  }
}

export async function getTop10Goals(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    let docs = await db.collection(process.env.DB_COLLECTION)
      .aggregate(top10goals(id))
      .sort({ goals: -1, matches: 1 })
      .limit(10)
      .toArray()
    return docs;
  } finally {
    await client.close();
  }
}

export async function getTop10Assists(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    let docs = await db.collection(process.env.DB_COLLECTION)
      .aggregate(top10assists(id))
      .sort({ assists: -1, matches: 1 })
      .limit(10)
      .toArray()
    return docs;
  } finally {
    await client.close();
  }
}

export async function getTop10Rusticos(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    let docs = await db.collection(process.env.DB_COLLECTION)
      .aggregate(top10rusticos(id))
      .sort({ redcards: -1, yellowcards: -1, fouls: 1, matches: 1 })
      .limit(10)
      .toArray()
    return docs;
  } finally {
    await client.close();
  }
}

export async function getPlayerMatches(id) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    let docs = await db.collection(process.env.DB_COLLECTION)
      .find({ "players.info.steam_id": id })
      .sort({ fecha: -1 })
      .toArray();
    return docs;
  } finally {
    await client.close();
  }
}
