import { getPositions } from "../../../lib/getFromDB";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    res.json(await getPositions(req.query.id));
  } else {
    res.end('Wrong method');
  }
}