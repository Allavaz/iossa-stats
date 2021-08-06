import { MongoClient } from 'mongodb';
const encuser = encodeURIComponent(process.env.DB_USER);
const encpw = encodeURIComponent(process.env.DB_PASS);
const authMechanism = 'DEFAULT';
const url = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}:27017/?authMechanism=${authMechanism}`;
import createJSON from './createJSON';
import createMatchCard from './createMatchCard';
import discordPostMatch from './discordPostMatch';

export default async function pushToDBios(files, torneo, vod, res) {
  if (vod == "") {
    vod = null;
  }

  let documents = []

  if (Array.isArray(files)) {
    files.forEach((item) => {
      documents.push(createJSON(item, torneo, vod, res));
    });
  } else {
    documents.push(createJSON(files, torneo, vod, res));
  }

  let client = await MongoClient.connect(url, { useNewUrlParser: true });
  const db = client.db(process.env.DB_NAME);
  try {
    let r = await db.collection(process.env.DB_COLLECTION).insertMany(documents);
    res.json({
      status: 'success'
    });
    if (documents.length === 1) {
      await createMatchCard(r.insertedIds['0'].toString());
      discordPostMatch(r.insertedIds['0'].toString());
    }
  } catch(err) {
    res.json({
      status: 'error',
      error: err
    });
    console.error(err);
  } finally {
    await client.close();
  }
}
