#!/usr/bin/env node

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { MongoClient } from "mongodb";
import TeamsJSON from "../utils/Teams.json";

async function main() {
  const encuser = encodeURIComponent(process.env.DB_USER);
  const encpw = encodeURIComponent(process.env.DB_PASS);
  const uri = `mongodb://${encuser}:${encpw}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin&retryWrites=true&w=majority`;

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  const collection = db.collection("teams");

  const docs = Object.entries(TeamsJSON).map(([name, shortname]) => ({
    name,
    shortname,
    logofilename: `${shortname.toLowerCase()}.png`
  }));

  await collection.deleteMany({});
  await collection.insertMany(docs);

  console.log(`Inserted ${docs.length} teams into the 'teams' collection.`);

  await client.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
