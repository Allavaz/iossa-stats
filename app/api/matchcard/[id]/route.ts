import fs from "fs";
import createMatchCard from "../../../../lib/createMatchCard";
import { getMatch } from "../../../../lib/getFromDB";

export async function GET(request: Request, { params }) {
  const id = params.id;
  let dir = `./.cache/matchcards/${process.env.DB_COLLECTION}/${id}.png`;
  let image;
  if (fs.existsSync(dir)) {
    image = fs.readFileSync(dir);
    return new Response(image, { headers: { "Content-Type": "image/png" } });
  } else {
    try {
      const data = await getMatch(id);
      image = await createMatchCard(data);
      return new Response(image, { headers: { "Content-Type": "image/png" } });
    } catch (e) {
      return new Response("Error 404: Match not found", { status: 404 });
    }
  }
}
