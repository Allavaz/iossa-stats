import SteamID from "steamid";
import axios from "axios";

export async function getSteamInfo(id) {
  try {
    let sid = new SteamID(id);
    let sid64 = sid.getSteamID64();
    let info = await axios.get(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API}&steamids=${sid64}`
    );
    return info.data.response.players[0];
  } catch (e) {
    return null;
  }
}
