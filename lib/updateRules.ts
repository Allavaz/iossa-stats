import clientPromise from "./mongodb";

export default async function updateRules(data) {
  const client = await clientPromise;
  const db = client.db();
  const fecha = new Date();
  await db
    .collection("rules")
    .updateMany({}, { $set: { rules: data, lastEdit: fecha } });
}
