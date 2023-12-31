import { getPlayers } from "../../../../lib/getFromDB";

export async function GET(request: Request, { params }) {
  const args = params.args;
  try {
    let players = await getPlayers(args?.[0] || "all");
    if (players) {
      return Response.json(players);
    } else {
      return new Response("404: Players info not found", { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 502 });
  }
}
