import createMatchCard from "../../lib/createMatchCard";
import uploadMatch from "../../lib/uploadMatch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password === process.env.KEY) {
      try {
        let id = await uploadMatch(req.body.data);
        await createMatchCard(id);
        res.json({status: "Success!", id: id})
      } catch (e) {
        console.error(e);
        res.json({status: "Error"})
      }
    } else {
      res.end("wrong pw");
    }
  }
}
