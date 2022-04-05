import { MongoClient, ObjectId } from "mongodb";
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = "DEFAULT";
const url = `mongodb+srv://${encuser}:${encpw}@${process.env.DB_HOST}/?authMechanism=${authMechanism}`;
const client = new MongoClient(url, { useNewUrlParser: true });

export default async function updateMatch(data) {
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
