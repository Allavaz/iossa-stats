import { MongoClient, ObjectId } from "mongodb";
import url from "./mongoConnection";
import fs from "fs";

export default async function deleteMatch(data, res) {
  const client = new MongoClient(url, { useNewUrlParser: true });
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
  }
}
