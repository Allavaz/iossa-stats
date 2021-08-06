import { IncomingForm } from "formidable";
import pushToDB from "../../lib/pushToDB";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let form = IncomingForm({ keepExtensions: true, multiples: true });
    let {fields, files} = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({fields, files});
      })
    });
    if (fields.pw === process.env.KEY) {
      try {
        await pushToDB(files.upload, fields.torneo, fields.vod, res);
      } catch (e) {
        console.error(e);
        res.end(e.toString());
      }
    } else {
      res.end("Wrong Key");
    }
  } else {
    res.end('Wrong method');
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
