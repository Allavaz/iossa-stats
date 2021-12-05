import createJSON from "../../lib/createJSON";
import uploadMatch from "../../lib/uploadMatch";
import createMatchCard from "../../lib/createMatchCard";
import discordPostMatch from "../../lib/discordPostMatch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let strArr = req.body.access_token.split("&", 2);
    let vod = "";
    if (strArr.length === 2) {
      if (strArr[0] == process.env.KEY) {
        try {
          let doc = createJSON(req.body, strArr[1], vod);
          let id = await uploadMatch(doc);
          await createMatchCard(id);
          discordPostMatch(id);
          res.json({ status: "Success!", id: id });
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
