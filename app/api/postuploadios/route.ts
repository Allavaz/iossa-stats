import createJSON from "../../../lib/createJSON";
import uploadMatch from "../../../lib/uploadMatch";
import createMatchCard from "../../../lib/createMatchCard";
import discordPostMatch from "../../../lib/discordPostMatch";

export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return new Response("Error parsing JSON body");
  }
  const strArr = body.access_token?.split("&", 2);
  if (strArr?.length === 2) {
    if (strArr[0] == process.env.KEY) {
      const doc = createJSON(body, strArr[1], null);
      const data = await uploadMatch(doc);
      createMatchCard({
        ...data,
        fecha: data.fecha.toISOString()
      }).then(() => discordPostMatch(data));
      return new Response("Success!");
    } else {
      return new Response("Wrong password");
    }
  } else {
    return new Response("Wrong body");
  }
}
