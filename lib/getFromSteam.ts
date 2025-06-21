const SteamID = require("steamid");
import axios from "axios";
import SteamCache from "./steamCache";

export async function getSteamInfo(ids: string[]) {
  try {
    const cache = SteamCache.getInstance();

    // Convert input IDs to Steam2 format for consistent caching
    const steam2Ids = ids.map(id => {
      const sid = new SteamID(id);
      return sid.getSteam2RenderedID();
    });

    // Check cache first
    const { cachedUsers, missingIds } = cache.getCachedUsers(steam2Ids);

    let apiUsers: any[] = [];

    // Only make API call if we have missing IDs
    if (missingIds.length > 0) {
      console.log(
        `Cache miss for ${missingIds.length} users, fetching from Steam API...`
      );

      // Convert missing Steam2 IDs to Steam64 for API call
      const missingSid64s = missingIds.map(id => {
        const sid = new SteamID(id);
        return sid.getSteamID64();
      });

      let info;
      let retries = 0;
      const maxRetries = 5;

      while (retries <= maxRetries) {
        try {
          info = await axios.get(
            `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${
              process.env.STEAM_API
            }&steamids=${missingSid64s.join(",")}`
          );
          break; // Success, exit retry loop
        } catch (error) {
          if (error.response?.status === 429) {
            retries++;
            if (retries > maxRetries) {
              throw error; // Re-throw error after max retries exceeded
            }
            console.log(
              `Steam API rate limited (429), retry ${retries}/${maxRetries}...`
            );
            // Optional: Add exponential backoff delay
            await new Promise(resolve => setTimeout(resolve, 1000 * retries));
          } else {
            throw error; // Re-throw non-429 errors immediately
          }
        }
      }

      // Transform API response to our format
      apiUsers = info.data.response.players.map(player => ({
        profilePicture: player.avatarfull,
        personaname: player.personaname,
        steamid: new SteamID(player.steamid).getSteam2RenderedID()
      }));

      // Cache the new users
      if (apiUsers.length > 0) {
        cache.cacheUsers(apiUsers);
        console.log(`Cached ${apiUsers.length} new users`);
      }
    } else {
      console.log(`Cache hit for all ${steam2Ids.length} users`);
    }

    // Combine cached and API results
    const allUsers = [...cachedUsers, ...apiUsers];

    // Clean up expired entries periodically (10% chance on each call)
    if (Math.random() < 0.1) {
      const cleaned = cache.cleanupExpiredEntries();
      if (cleaned > 0) {
        console.log(`Cleaned up ${cleaned} expired cache entries`);
      }
    }

    return allUsers;
  } catch (e) {
    console.error("Error fetching Steam info:", e);
    return null;
  }
}
