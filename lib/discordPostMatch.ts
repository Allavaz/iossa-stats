import axios from "axios";

export default async function discordPostMatch(data) {
  await axios.post(process.env.DISCORD_WEBHOOK_URL, {
    content: `https://iosoccer-sa.com/partido/${data._id.toString()}`
  });
}
