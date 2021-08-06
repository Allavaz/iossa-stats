import pushToDBios from "../../lib/pushToDBios";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let strArr = req.body.access_token.split('&', 2);
    let vod = "";
    if (strArr.length === 2) {
      if (strArr[0] == process.env.KEY) {
        try {
          await pushToDBios(req.body, strArr[1], vod, res);
        } catch (e) {
          console.error(e);
          res.end(e.toString());
        }
      } else {
        res.end(" -> Wrong IP");
      }
    }
  } else {
    res.end('Wrong method');
  }
}
