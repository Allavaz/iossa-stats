import { getPlayers } from "../../../../lib/getFromDB";

export async function GET(request: Request, props) {
  const params = await props.params;
  const args = params.args;
  try {
    const players = await getPlayers(args?.[0] || "all");
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
