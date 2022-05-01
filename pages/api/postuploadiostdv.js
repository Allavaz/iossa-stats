import createJSON from "../../lib/createJSON";
import discordPostMatchCard from "../../lib/discordPostMatchCard";
import uploadMatch from "../../lib/uploadMatch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let strArr = req.body.access_token.split("&", 2);
    let vod = "";
    if (strArr.length === 2) {
      if (strArr[0] == process.env.KEY) {
        try {
          let doc = createJSON(req.body, strArr[1], vod);
          let data = await uploadMatch(doc, "matchestdv");
          res.json({ status: "Success!", id: data._id.toString() });
          discordPostMatchCard(doc);
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
