import deleteMatch from "../../../lib/deleteMatch";
import deleteMatchCard from "../../../lib/deleteMatchCard";
import { isAdmin } from "../../../auth";

export async function POST(request: Request) {
  if (!await isAdmin()) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  try {
    await deleteMatch(body.data);
    deleteMatchCard(body.data._id);
    return new Response("Success!");
  } catch (e) {
    console.error(e);
    return new Response(e.toString());
  }
}
