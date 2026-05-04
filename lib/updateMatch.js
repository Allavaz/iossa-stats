import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export default async function updateMatch(data) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const o_id = new ObjectId(data._id);
    delete data._id;
    data.fecha = new Date(data.fecha);
    let res = await db
      .collection(process.env.DB_COLLECTION)
      .findOneAndReplace({ _id: o_id }, data);
    return res.value;
  } catch (err) {
    throw new Error(err);
  }
}
