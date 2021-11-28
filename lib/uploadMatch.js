import { MongoClient } from "mongodb";
import createMatchCard from "./createMatchCard";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}:27017/?authMechanism=${authMechanism}`;
const client = new MongoClient(url, { useNewUrlParser: true });

export default async function uploadMatch(data, res) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    let doc = await db.collection(process.env.DB_COLLECTION).insertOne(data);
    res.json({ status: "Success!", id: doc.insertedId.toString() });
    await createMatchCard(id);
  } catch (err) {
    res.json({ status: "Error" });
    console.error(err);
  } finally {
    await client.close();
  }
}
