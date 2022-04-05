import { MongoClient } from "mongodb";
import url from "./mongoConnection";

export default async function uploadMatch(data, collection) {
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME);
    data.fecha = new Date(data.fecha);
    let doc = await db
      .collection(collection || process.env.DB_COLLECTION)
      .insertOne(data);
    return { _id: doc.insertedId, ...data };
  } catch (err) {
    throw new Error(err);
  }
}
