import fs from "fs";
import createMatchCard from "../../../lib/createMatchCard";
import { getMatch } from "../../../lib/getFromDB";

export default async function handler(req, res) {
  if (req.method === "GET") {
    let dir = `./.cache/matchcards/${process.env.DB_COLLECTION}/${req.query.id}.png`;
    let image;
    if (fs.existsSync(dir)) {
      image = fs.readFileSync(dir);
      res.setHeader("Content-Type", "image/png");
      res.send(image);
    } else {
      try {
        let data = await getMatch(req.query.id);
        image = await createMatchCard(data);
        res.setHeader("Content-Type", "image/png");
        res.send(image);
      } catch (e) {
        res.writeHead(404);
        res.end("Error 404: Match not found");
      }
    }
  }
}
