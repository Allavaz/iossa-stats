import { MongoClient, ObjectId } from "mongodb";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb+srv://${encuser}:${encpw}@${process.env.DB_HOST}/?authMechanism=${authMechanism}`;
import fs from "fs";
const client = new MongoClient(url, { useNewUrlParser: true });

export default async function deleteMatch(data, res) {
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    const o_id = new ObjectId(data._id);
    await db.collection(process.env.DB_COLLECTION).deleteOne({ _id: o_id });
    let dir = `./.cache/matchcards/${process.env.DB_COLLECTION}/${data._id}.png`;
    if (fs.existsSync(dir)) {
      fs.unlinkSync(dir);
    }
    res.end("Success!");
  } catch (err) {
    res.end("Error");
    console.error(err);
  } finally {
    await client.close();
  }
}
