import createMatchCard from "../../../lib/createMatchCard";
import discordPostMatch from "../../../lib/discordPostMatch";
import uploadMatch from "../../../lib/uploadMatch";
import { isAdmin } from "../../../auth";

export async function POST(request: Request) {
  if (!await isAdmin()) return new Response("Unauthorized", { status: 401 });
  const body = await request.json();
  try {
    const data = await uploadMatch(body.data);
    createMatchCard({
      ...data,
      fecha: data.fecha.toISOString()
    }).then(() => discordPostMatch(data));
    return Response.json({ status: "Success!", id: data._id.toString() });
  } catch (e) {
    console.error(e);
    return Response.json({ status: "Error" });
  }
}
