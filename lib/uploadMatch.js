import { MongoClient } from "mongodb";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb+srv://${encuser}:${encpw}@${process.env.DB_HOST}/?authMechanism=${authMechanism}`;
const client = new MongoClient(url, { useNewUrlParser: true });

export default async function uploadMatch(data, collection) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    data.fecha = new Date(data.fecha);
    let doc = await db
      .collection(collection || process.env.DB_COLLECTION)
      .insertOne(data);
    return { _id: doc.insertedId, ...data };
  } catch (err) {
    throw new Error(err);
  }
}
