import createJSON from "../../../lib/createJSON";
import createDiscordCard from "../../../lib/createDiscordCard";
import axios from "axios";

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
      const data = createJSON(body, strArr[1], null);
      const payload = createDiscordCard(data);
      await axios.post(process.env.DISCORD_WEBHOOK_URL, payload);
      return new Response("Success!");
    } else {
      return new Response("Wrong password");
    }
  } else {
    return new Response("Wrong body");
  }
}
