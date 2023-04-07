import { NextApiRequest, NextApiResponse } from "next";
import { getPlayer } from "../../../lib/getFromDB";

export default async function jugador(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).end("400: Bad request");
  }

  if (req.query.args.length > 0) {
    try {
      let player = await getPlayer(
        req.query.args[0],
        req.query.args[1] || "all"
      );
      if (player) {
        return res.json(player);
      } else {
        return res.status(404).end("404: Player info not found");
      }
    } catch (err) {
      console.error(err);
      return res.status(502).end(err.message);
    }
  }
}
