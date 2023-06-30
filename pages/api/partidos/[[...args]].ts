import { NextApiRequest, NextApiResponse } from "next";
import { getMatches } from "../../../lib/getFromDB";

export default async function partidos(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(400).end("400: Bad request");
  }

  try {
    let matches = await getMatches(req.query.args?.[0] || "all");
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

export const config = {
  api: {
    responseLimit: false
  }
};
