import { getMatch } from "../../../../lib/getFromDB";

export async function GET(request: Request, props) {
  const params = await props.params;
  const id = params.id;
  const includeRaw = new URL(request.url).searchParams.get("raw") === "1";
  try {
    const matches = await getMatch(id, includeRaw);
    if (matches) {
      return Response.json(matches);
    } else {
      return new Response("404: Match not found", { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 502 });
  }
}
