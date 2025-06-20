# Steam Cache Implementation

This project now includes a SQLite-based cache for Steam API calls to avoid 429 rate limit errors.

## How it works

The cache stores Steam user data (Steam ID, persona name, and profile picture) with a 24-hour expiration time. When `getSteamInfo()` is called:

1. **Cache Check**: First checks the local SQLite database for cached user data
2. **API Call**: Only makes Steam API calls for users not found in cache or with expired data
3. **Cache Update**: Stores new user data in the cache for future use
4. **Cleanup**: Periodically removes expired cache entries

## Features

- **Automatic Expiration**: Cache entries expire after 24 hours
- **Efficient Storage**: Uses SQLite with indexed queries for fast lookups
- **Batch Operations**: Handles multiple Steam IDs efficiently
- **Automatic Cleanup**: Periodically removes expired entries
- **Cache Management**: CLI tools for monitoring and managing the cache

## Cache Management

Use the built-in cache management script:

```bash
# Show cache statistics
npm run cache-manager stats

# Clean up expired entries
npm run cache-manager cleanup

# Clear all cache entries
npm run cache-manager clear

# Show help
npm run cache-manager help
```

## Files

- `lib/steamCache.ts` - Main cache implementation
- `lib/getFromSteam.ts` - Updated Steam API function with caching
- `scripts/cache-manager.ts` - Cache management utility
- `steam_cache.db` - SQLite database file (auto-created, gitignored)

## Performance Benefits

- **Reduced API Calls**: Significant reduction in Steam API requests
- **Faster Response Times**: Cached data returns instantly
- **Rate Limit Protection**: Avoids 429 errors from Steam API
- **Offline Capability**: Can serve cached data when Steam API is unavailable

## Database Schema

```sql
CREATE TABLE steam_users (
  steamid TEXT PRIMARY KEY,           -- Steam ID in Steam2 format
  personaname TEXT NOT NULL,          -- Steam display name
  profilePicture TEXT NOT NULL,       -- Avatar URL
  lastUpdated INTEGER NOT NULL        -- Timestamp when cached
);
```

The cache automatically handles Steam ID format conversion and ensures consistency across all operations.
