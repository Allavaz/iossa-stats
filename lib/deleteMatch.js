import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export default async function deleteMatch(data) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const o_id = new ObjectId(data._id);
    await db.collection(process.env.DB_COLLECTION).deleteOne({ _id: o_id });
  } catch (err) {
    res.end("Error");
    console.error(err);
  }
}
