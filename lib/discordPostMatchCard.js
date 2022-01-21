import { Client, Intents } from "discord.js";
import createMatchCard from "./createMatchCard";

export default function discordPostMatchCard(data) {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
  });

  client.once("ready", async () => {
    try {
      let image = await createMatchCard(data, true);
      let channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);
      await channel.send({ files: [{ attachment: image }] });
    } catch (err) {
      console.error(err);
    }
  });

  client.login(process.env.DISCORD_BOT_TOKEN);
}
