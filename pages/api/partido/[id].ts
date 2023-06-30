import { NextApiRequest, NextApiResponse } from "next";
import { getMatch } from "../../../lib/getFromDB";

export default async function partidos(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).end("400: Bad request");
  }

  try {
    let matches = await getMatch(req.query.id as string);
    if (matches) {
      return res.json(matches);
    } else {
      return res.status(404).end("404: Matches not found");
    }
  } catch (err) {
    console.error(err);
    return res.status(502).end(err.message);
  }
}
