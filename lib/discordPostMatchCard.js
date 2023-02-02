import axios from "axios";
import createMatchCard from "./createMatchCard";
import FormData from "form-data";

export default async function discordPostMatchCard(data) {
  let image = await createMatchCard(data, true);

  let fd = new FormData();

  fd.append("files[0]", image, "matchcard.png");

  axios.post(process.env.DISCORD_WEBHOOK_URL, fd, {
    headers: fd.getHeaders()
  });
}
