import uploadMatch from "../../lib/uploadMatch";

export default async function handler(req, res) {
  if (req.method === "POST") {
    if (req.body.password === process.env.KEY) {
      try {
        await uploadMatch(req.body.data, res);
      } catch (e) {
        console.error(e);
        res.end(e.toString());
      }
    } else {
      res.end("wrong pw");
    }
  }
}
