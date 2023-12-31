import createMatchCard from "../../../lib/createMatchCard";
import discordPostMatch from "../../../lib/discordPostMatch";
import uploadMatch from "../../../lib/uploadMatch";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.password === process.env.KEY) {
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
  } else {
    return new Response("wrong pw");
  }
}
