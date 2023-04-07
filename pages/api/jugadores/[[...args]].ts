import { NextApiRequest, NextApiResponse } from "next";
import { getPlayers } from "../../../lib/getFromDB";

export default async function jugadores(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).end("400: Bad request");
  }

  try {
    let players = await getPlayers(req.query.args?.[0] || "all");
    if (players) {
      return res.json(players);
    } else {
      return res.status(404).end("404: Players info not found");
    }
  } catch (err) {
    console.error(err);
    return res.status(502).end(err.message);
  }
}
