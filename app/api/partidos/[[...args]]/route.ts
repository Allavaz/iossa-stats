import { getMatches } from "../../../../lib/getFromDB";

export async function GET(request: Request, { params }) {
  const args = params.args;
  try {
    const matches = await getMatches(args?.[0] || "all");
    if (matches) {
      return Response.json(matches);
    } else {
      return new Response("No matches found", { status: 404 });
    }
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 502 });
  }
}
