import updateMatch from "../../../lib/updateMatch";
import createMatchCard from "../../../lib/createMatchCard";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.password === process.env.KEY) {
    try {
      let data = await updateMatch(body.data);
      createMatchCard({ ...data, fecha: data.fecha.toISOString() });
      return Response.json({ status: "Success!" });
    } catch (e) {
      console.error(e);
      return Response.json({ status: "Error" });
    }
  } else {
    return new Response("wrong pw");
  }
}
