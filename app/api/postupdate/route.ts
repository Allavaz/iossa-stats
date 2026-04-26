import updateMatch from "../../../lib/updateMatch";
import createMatchCard from "../../../lib/createMatchCard";
import { isAdmin } from "../../../auth";

export async function POST(request: Request) {
  if (!await isAdmin()) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  try {
    let data = await updateMatch(body.data);
    createMatchCard({ ...data, fecha: data.fecha.toISOString() });
    return Response.json({ status: "Success!" });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "Error" });
  }
}
