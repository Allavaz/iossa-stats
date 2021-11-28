import { MongoClient } from "mongodb";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}:27017/?authMechanism=${authMechanism}`;
const client = new MongoClient(url, { useNewUrlParser: true });

export default async function uploadMatch(data) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    data.fecha = new Date(data.fecha);
    let doc = await db.collection(process.env.DB_COLLECTION).insertOne(data);
    return doc.insertedId.toString();
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}
