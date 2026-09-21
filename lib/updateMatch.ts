import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export default async function updateMatch(data) {
  const client = await clientPromise;
  const db = client.db();
  const o_id = new ObjectId(data._id);
  delete data._id;
  data.fecha = new Date(data.fecha);
  if (data.raw === undefined) {
    const existing = await db
      .collection(process.env.DB_COLLECTION)
      .findOne({ _id: o_id }, { projection: { raw: 1 } });
    if (existing?.raw !== undefined) {
      data.raw = existing.raw;
    }
  }
  let res = await db
    .collection(process.env.DB_COLLECTION)
    .findOneAndReplace({ _id: o_id }, data);
  return res.value;
}
