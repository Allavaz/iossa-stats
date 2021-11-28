import { MongoClient, ObjectId } from "mongodb";
import createMatchCard from "./createMatchCard";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}:27017/?authMechanism=${authMechanism}`;
const client = new MongoClient(url, { useNewUrlParser: true });

export default async function updateMatch(data, res) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const o_id = new ObjectId(data._id);
    delete data._id;
    data.fecha = new Date(data.fecha);
    await db
      .collection(process.env.DB_COLLECTION)
      .replaceOne({ _id: o_id }, data);
    return o_id.toString();
  } catch (err) {
    throw new Error(err);
  } finally {
    await client.close();
  }
}
