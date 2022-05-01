import deleteMatch from "../../lib/deleteMatch";
import deleteMatchCard from "../../lib/deleteMatchCard";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password === process.env.KEY) {
      try {
        await deleteMatch(req.body.data);
        res.end("Success!");
        deleteMatchCard(req.body.data._id);
      } catch (e) {
        console.error(e);
        res.end(e.toString());
      }
    } else {
      res.end("wrong pw");
    }
  }
}
