import SteamCache from "../lib/steamCache";

async function testExistingCache() {
  console.log("Testing Existing Cache Data");
  console.log("==========================");

  const cache = SteamCache.getInstance();

  try {
    // Get cache statistics
    const stats = cache.getCacheStats();
    console.log(
      `Cache contains ${stats.validEntries} valid entries out of ${stats.totalEntries} total`
    );

    if (stats.validEntries === 0) {
      console.log("No cached data available for testing");
      return;
    }

    // Try to get some data from the cache to test the function
    // We'll query the database directly to get some existing Steam IDs
    const db = (cache as any).db;
    const stmt = db.prepare("SELECT steamid FROM steam_users LIMIT 3");
    const existingIds = stmt.all().map((row: any) => row.steamid);

    console.log("\nTesting with existing Steam IDs from cache:", existingIds);

    if (existingIds.length > 0) {
      // Test cache lookup
      const { cachedUsers, missingIds } = cache.getCachedUsers(existingIds);

      console.log(`\nCache results:`);
      console.log(`- Found ${cachedUsers.length} users in cache`);
      console.log(`- Missing ${missingIds.length} users`);

      if (cachedUsers.length > 0) {
        console.log("\nSample cached user:");
        console.log(JSON.stringify(cachedUsers[0], null, 2));
      }
    }
  } catch (error) {
    console.error("Error testing cache:", error);
  } finally {
    cache.close();
  }
}

testExistingCache().catch(console.error);
