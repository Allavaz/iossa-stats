import createJSON from "../../lib/createJSON";
import uploadMatch from "../../lib/uploadMatch";
import createMatchCard from "../../lib/createMatchCard";
import discordPostMatch from "../../lib/discordPostMatch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let strArr = req.body.access_token.split("&", 2);
    if (strArr.length === 2) {
      if (strArr[0] == process.env.KEY) {
        try {
          let doc = createJSON(req.body, strArr[1], null);
          let data = await uploadMatch(doc);
          res.json({ status: "Success!", id: data._id.toString() });
          try {
            let image = await createMatchCard({
              ...data,
              fecha: data.fecha.toISOString()
            });
            discordPostMatch(data, image);
          } catch (error) {
            console.error(error);
          }
        } catch (e) {
          console.error(e);
          res.json({ status: "Error" });
        }
      } else {
        res.end(" -> Wrong IP");
      }
    }
  } else {
    res.end("Wrong method");
  }
}