import { getPlayer } from "../../../../lib/getFromDB";

export async function GET(request: Request, { params }) {
  const args = params.args;
  if (args.length > 0) {
    try {
      let player = await getPlayer(args[0], args[1] || "all");
      if (player) {
        return Response.json(player);
      } else {
        return new Response("404: Player info not found", { status: 404 });
      }
    } catch (err) {
      console.error(err);
      return new Response(err.message, { status: 502 });
    }
  } else {
    return new Response("Missing id", { status: 400 });
  }
}
