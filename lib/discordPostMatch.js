import { Client, Intents } from "discord.js";

export default function discordPostMatch(id) {
  const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
  
  client.once('ready', () => {
    try {
      client.channels.fetch(process.env.DISCORD_CHANNEL_ID).then((channel) => {
        channel.send(`https://stats.iosoccer-sa.bid/partido/${id}`)
          .then(() => client.destroy())
      })
    } catch(err) {
      console.error(err);
    }
  });
  
  client.login(process.env.DISCORD_BOT_TOKEN);
}
