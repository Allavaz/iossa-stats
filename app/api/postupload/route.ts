import createMatchCard from "../../../lib/createMatchCard";
import discordPostMatch from "../../../lib/discordPostMatch";
import ingestMatch from "../../../lib/ingestMatch";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.password === process.env.KEY) {
    try {
      const match = await ingestMatch(body.data, body.torneo, body.vod ?? null, body.filename);
      createMatchCard(match).then(() => discordPostMatch(match));
      return Response.json({ status: "Success!", id: match.id });
    } catch (e) {
      console.error(e);
      return Response.json({ status: "Error" });
    }
  } else {
    return new Response("wrong pw");
  }
}
