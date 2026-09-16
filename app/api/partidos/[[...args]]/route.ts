import { getMatchesAPI } from "../../../../lib/getFromDB";

export async function GET(request: Request, props) {
  const params = await props.params;
  const args = params.args;
  const includeRaw = new URL(request.url).searchParams.get("raw") === "1";
  try {
    const matches = await getMatchesAPI(args?.[0] || "all", includeRaw);
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
