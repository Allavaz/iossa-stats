import createMatchCard from "../../lib/createMatchCard";
import discordPostMatch from "../../lib/discordPostMatch";
import uploadMatch from "../../lib/uploadMatch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password === process.env.KEY) {
      try {
        let data = await uploadMatch(req.body.data);
        res.json({ status: "Success!", id: data._id.toString() });
        try {
          await createMatchCard({...data, fecha: data.fecha.toISOString()});
          discordPostMatch(data._id.toString());
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
