import createJSON from "../../../lib/createJSON";
import uploadMatch from "../../../lib/uploadMatch";
import createMatchCard from "../../../lib/createMatchCard";
import discordPostMatch from "../../../lib/discordPostMatch";

export async function POST(request: Request) {
  const body = await request.json();
  const strArr = body.access_token?.split("&", 2);
  if (strArr?.length === 2) {
    if (strArr[0] == process.env.KEY) {
      const doc = createJSON(body, strArr[1], null);
      const data = await uploadMatch(doc);
      createMatchCard({
        ...data,
        fecha: data.fecha.toISOString()
      }).then(() => discordPostMatch(data));
      console.log("(postuploadios) Match uploaded successfully: " + data.id);
      return new Response("Success!");
    } else {
      console.error("(postuploadios) Wrong password attempted: " + strArr[0]);
      return new Response("Wrong password");
    }
  } else {
    console.error("(postuploadios) Invalid request body");
    return new Response("Wrong body");
  }
}
