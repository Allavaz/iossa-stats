import axios from "axios";

export default async function discordPostMatch(id) {
  await axios.post(process.env.DISCORD_WEBHOOK_URL, {
    content: `https://iosoccer-sa.bid/partido/${id}`
  });
}
