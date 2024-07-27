import SteamID from "steamid";
import axios from "axios";

export async function getSteamInfo(ids: string[]) {
  try {
    const sid64s = ids.map(id => {
      const sid = new SteamID(id);
      return sid.getSteamID64();
    });
    const info = await axios.get(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${
        process.env.STEAM_API
      }&steamids=${sid64s.join(",")}`
    );
    return info.data.response.players.map(player => ({
      profilePicture: player.avatarfull,
      personaname: player.personaname,
      steamid: new SteamID(player.steamid).getSteam2RenderedID()
    }));
  } catch (e) {
    return null;
  }
}
