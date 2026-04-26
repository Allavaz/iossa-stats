import { updateChampion, deleteChampion } from "../../../lib/champions";
import { isAdmin } from "../../../auth";

export async function POST(request: Request) {
  if (!await isAdmin()) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  if (!body.torneo || !body.teamname) return new Response("Missing data");
  await updateChampion(body.torneo, body.teamname);
  return new Response("Success");
}

export async function DELETE(request: Request) {
  if (!await isAdmin()) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  if (!body.torneo) return new Response("Missing data");
  await deleteChampion(body.torneo);
  return new Response("Success");
}
