import createJSON from "../../../lib/createJSON";
import uploadMatch from "../../../lib/uploadMatch";
import createMatchCard from "../../../lib/createMatchCard";
import discordPostMatch from "../../../lib/discordPostMatch";

export async function POST(request: Request) {
  const body = await request.json();
  let strArr = body.access_token?.split("&", 2);
  if (strArr?.length === 2) {
    if (strArr[0] == process.env.KEY) {
      try {
        let doc = createJSON(body, strArr[1], null);
        let data = await uploadMatch(doc);
        createMatchCard({
          ...data,
          fecha: data.fecha.toISOString()
        }).then(() => discordPostMatch(data));
        return new Response("Success!");
      } catch (e) {
        console.error(e);
        return new Response("Error");
      }
    } else {
      return new Response("Wrong password");
    }
  } else {
    return new Response("Wrong body");
  }
}
