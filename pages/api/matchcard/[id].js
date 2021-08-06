import fs from 'fs';
import createMatchCard from "../../../lib/createMatchCard";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let dir = `./.cache/matchcards/${process.env.DB_COLLECTION}/${req.query.id}.png`;
    let image;
    if (fs.existsSync(dir)) {
      image = fs.readFileSync(dir);
    } else {
      image = await createMatchCard(req.query.id);
    }
    res.setHeader('Content-Type', 'image/png');
    res.send(image);
  }
}