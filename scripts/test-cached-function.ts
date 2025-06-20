import { getSteamInfo } from "../lib/getFromSteam";
import SteamCache from "../lib/steamCache";

async function testWithCachedData() {
  console.log("Testing getSteamInfo with Cached Data");
  console.log("====================================");

  const cache = SteamCache.getInstance();

  try {
    // Get some existing Steam IDs from the cache
    const db = (cache as any).db;
    const stmt = db.prepare("SELECT steamid FROM steam_users LIMIT 2");
    const existingIds = stmt.all().map((row: any) => row.steamid);

    console.log("\nTesting with cached Steam IDs:", existingIds);

    if (existingIds.length > 0) {
      // Test with cached data - should be fast
      console.log("\nCalling getSteamInfo with cached data:");
      const start = Date.now();
      const result = await getSteamInfo(existingIds);
      const time = Date.now() - start;

      console.log(
        `- Result: ${result ? `${result.length} users found` : "null"}`
      );
      console.log(`- Time taken: ${time}ms (should be very fast)`);

      if (result && result.length > 0) {
        console.log("\nFirst user from result:");
        console.log(JSON.stringify(result[0], null, 2));
      }
    }
  } catch (error) {
    console.error("Error testing:", error);
  } finally {
    cache.close();
  }
}

testWithCachedData().catch(console.error);
