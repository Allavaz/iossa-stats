import deleteMatch from "../../../lib/deleteMatch";
import deleteMatchCard from "../../../lib/deleteMatchCard";

export async function POST(request: Request) {
  const body = await request.json();
  if (body.password === process.env.KEY) {
    try {
      await deleteMatch(body.data);
      deleteMatchCard(body.data._id);
      return new Response("Success!");
    } catch (e) {
      console.error(e);
      return new Response(e.toString());
    }
  } else {
    return new Response("wrong pw");
  }
}
