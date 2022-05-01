import updateMatch from "../../lib/updateMatch";
import createMatchCard from "../../lib/createMatchCard";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password === process.env.KEY) {
      try {
        let data = await updateMatch(req.body.data, res);
        res.json({ status: "Success!" });
        await createMatchCard(data);
      } catch (e) {
        console.error(e);
        res.json({ status: "Error" });
      }
    } else {
      res.end("wrong pw");
    }
  }
}
