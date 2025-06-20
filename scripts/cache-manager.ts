#!/usr/bin/env node

import SteamCache from '../lib/steamCache';

function printUsage() {
  console.log('Steam Cache Management Utility');
  console.log('Usage: npm run cache-manager <command>');
  console.log('');
  console.log('Commands:');
  console.log('  stats     - Show cache statistics');
  console.log('  cleanup   - Remove expired cache entries');
  console.log('  clear     - Clear all cache entries');
  console.log('  help      - Show this help message');
}

async function main() {
  const command = process.argv[2];

  if (!command || command === 'help') {
    printUsage();
    return;
  }

  const cache = SteamCache.getInstance();

  try {
    switch (command) {
      case 'stats': {
        const stats = cache.getCacheStats();
        console.log(`Total cache entries: ${stats.totalEntries}`);
        console.log(`Valid (non-expired) entries: ${stats.validEntries}`);
        console.log(`Expired entries: ${stats.totalEntries - stats.validEntries}`);
        break;
      }

      case 'cleanup': {
        const cleaned = cache.cleanupExpiredEntries();
        console.log(`Cleaned up ${cleaned} expired cache entries`);
        break;
      }

      case 'clear': {
        // We'll implement a clear all method
        const db = (cache as any).db;
        const result = db.prepare('DELETE FROM steam_users').run();
        console.log(`Cleared all ${result.changes} cache entries`);
        break;
      }

      default:
        console.error(`Unknown command: ${command}`);
        printUsage();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    cache.close();
  }
}

main().catch(console.error);
