import { MongoClient, ObjectId } from "mongodb";
import url from "./mongoConnection";

export default async function updateMatch(data) {
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
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
