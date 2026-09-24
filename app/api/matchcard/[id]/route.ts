import fs from "fs";
import createMatchCard from "../../../../lib/createMatchCard";
import { getMatch } from "../../../../lib/getFromDB";

const CACHE_DISABLED = process.env.MATCHCARD_DISABLE_CACHE === "true";

export async function GET(request: Request, props) {
  const params = await props.params;
  const id = params.id;
  const dir = `./.cache/matchcards/${process.env.DB_COLLECTION}/${id}.png`;

  if (!CACHE_DISABLED && fs.existsSync(dir)) {
    const image = fs.readFileSync(dir);
    return new Response(image, { headers: { "Content-Type": "image/png" } });
  }

  try {
    const data = await getMatch(id);
    const image = await createMatchCard(data, CACHE_DISABLED);
    return new Response(image, {
      headers: {
        "Content-Type": "image/png",
        ...(CACHE_DISABLED ? { "Cache-Control": "no-store" } : {})
      }
    });
  } catch (e) {
    return new Response("Error 404: Match not found", { status: 404 });
  }
}
