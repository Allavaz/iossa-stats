import { updateChampion, deleteChampion } from "../../../lib/champions";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.password || body.password !== process.env.KEY)
    return new Response("wrong pw");
  if (!body.torneo || !body.teamname) return new Response("Missing data");
  await updateChampion(body.torneo, body.teamname);
  return new Response("Success");
}

export async function DELETE(request: Request) {
  const body = await request.json();
  if (!body.password || body.password !== process.env.KEY)
    return new Response("wrong pw");
  if (!body.torneo) return new Response("Missing data");
  await deleteChampion(body.torneo);
  return new Response("Success");
}
