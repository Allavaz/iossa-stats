import clientPromise from "./mongodb";

export default async function updateRules(data) {
  const client = await clientPromise;
  const db = client.db();
  await db.collection("rules").insertOne(data);
}
