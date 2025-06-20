import { getSteamInfo } from "../lib/getFromSteam";

async function testSteamCache() {
  console.log("Testing Steam Cache Implementation");
  console.log("==================================");

  // Test with some sample Steam IDs
  const testIds = ["STEAM_1:0:12345", "STEAM_1:1:67890"];

  console.log("\nTesting with sample Steam IDs:", testIds);

  try {
    // First call - might hit cache or API
    console.log("\nFirst call:");
    const start1 = Date.now();
    const result1 = await getSteamInfo(testIds);
    const time1 = Date.now() - start1;

    console.log(
      `- Result: ${result1 ? `${result1.length} users found` : "null"}`
    );
    console.log(`- Time taken: ${time1}ms`);

    // Second call - should hit cache
    console.log("\nSecond call (should be cached):");
    const start2 = Date.now();
    const result2 = await getSteamInfo(testIds);
    const time2 = Date.now() - start2;

    console.log(
      `- Result: ${result2 ? `${result2.length} users found` : "null"}`
    );
    console.log(`- Time taken: ${time2}ms`);

    // Show performance improvement
    if (time1 > 0 && time2 > 0) {
      const improvement = (((time1 - time2) / time1) * 100).toFixed(1);
      console.log(`- Performance improvement: ${improvement}%`);
    }

    // Show results if available
    if (result2 && result2.length > 0) {
      console.log("\nSample user data:");
      console.log(JSON.stringify(result2[0], null, 2));
    }
  } catch (error) {
    console.error("Error testing cache:", error);
  }
}

testSteamCache().catch(console.error);
