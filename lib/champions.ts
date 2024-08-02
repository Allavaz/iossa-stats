import clientPromise from "./mongodb";

export async function updateChampion(tournament: string, teamname: string) {
  const client = await clientPromise;
  const collection = client
    .db()
    .collection(process.env.DB_COLLECTION_TOURNAMENTS);
  return collection.updateOne(
    { torneo: tournament },
    { $set: { firstPlace: teamname } },
    { upsert: true }
  );
}

export async function deleteChampion(tournament: string) {
  const client = await clientPromise;
  const collection = client
    .db()
    .collection(process.env.DB_COLLECTION_TOURNAMENTS);
  return collection.deleteOne({ torneo: tournament });
}
