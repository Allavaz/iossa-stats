import clientPromise from "./mongodb";

export default async function uploadMatch(data, collection) {
  try {
    const client = await clientPromise;
    const db = client.db();
    data.fecha = new Date(data.fecha);
    let doc = await db
      .collection(collection || process.env.DB_COLLECTION)
      .insertOne(data);
    return { _id: doc.insertedId, ...data };
  } catch (err) {
    throw new Error(err);
  }
}
