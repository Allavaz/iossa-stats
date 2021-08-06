import { MongoClient, ObjectId } from "mongodb";
import createMatchCard from "./createMatchCard";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}:27017/?authMechanism=${authMechanism}`;

export default async function updateMatch(data, res) {
  let id = data._id;
  let client = await MongoClient.connect(url, { useNewUrlParser: true });
  const db = client.db(process.env.DB_NAME);
  const o_id = new ObjectId(data._id);
  delete data._id;
  data.fecha = new Date(data.fecha);
  try {
    await db.collection(process.env.DB_COLLECTION).replaceOne({'_id': o_id}, data);
    res.end('Success!')
    await createMatchCard(id);
  } catch(err) {
    res.end("Error");
    console.error(err);
  } finally {
    await client.close();
  }
}
