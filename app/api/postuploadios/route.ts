import ingestMatch from "../../../lib/ingestMatch";
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
      const match = await ingestMatch(body, strArr[1], null);
      createMatchCard(match).then(() => discordPostMatch(match));
      return new Response("Success!");
    } else {
      return new Response("Wrong password");
    }
  } else {
    return new Response("Wrong body");
  }
}
