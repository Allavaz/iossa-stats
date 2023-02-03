import axios from "axios";
import FormData from "form-data";

export default async function discordPostMatch(data, image) {
  let fd = new FormData();

  fd.append("files[0]", image, "matchcard.png");

  fd.append(
    "payload_json",
    JSON.stringify({
      embeds: [
        {
          title: `${data.teams[0].teamname} ${data.teams[0].score} - ${data.teams[1].score} ${data.teams[1].teamname}`,
          url: `https://iosoccer-sa.bid/partido/${data._id.toString()}`,
          image: { url: "attachment://matchcard.png" },
          author: {
            name: "IOSoccer Sudamérica",
            url: "https://iosoccer-sa.bid",
            icon_url: "https://iosoccer-sa.bid/logo-solo.png"
          },
          color: 14845952
        }
      ]
    })
  );

  await axios.post(process.env.DISCORD_WEBHOOK_URL, fd, {
    headers: fd.getHeaders()
  });
}
