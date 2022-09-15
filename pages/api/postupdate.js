import updateMatch from "../../lib/updateMatch";
import createMatchCard from "../../lib/createMatchCard";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password === process.env.KEY) {
      try {
        let data = await updateMatch(req.body.data, res);
        res.json({ status: "Success!" });
        try {
          await createMatchCard({...data, fecha: data.fecha.toISOString()});
        } catch (error) {
          console.error(error);
        }
      } catch (e) {
        console.error(e);
        res.json({ status: "Error" });
      }
    } else {
      res.end("wrong pw");
    }
  }
}
