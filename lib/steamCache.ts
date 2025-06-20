const Database = require("better-sqlite3");
import * as path from "path";

interface SteamUserData {
  steamid: string;
  personaname: string;
  profilePicture: string;
  lastUpdated: number;
}

class SteamCache {
  private db: any;
  private static instance: SteamCache;

  // Cache entries expire after 24 hours (in milliseconds)
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000;

  private constructor() {
    // Create database in the project root
    const dbPath = path.join(process.cwd(), "steam_cache.db");
    this.db = new Database(dbPath);
    this.init();
  }

  public static getInstance(): SteamCache {
    if (!SteamCache.instance) {
      SteamCache.instance = new SteamCache();
    }
    return SteamCache.instance;
  }

  private init() {
    // Create the steam_users table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS steam_users (
        steamid TEXT PRIMARY KEY,
        personaname TEXT NOT NULL,
        profilePicture TEXT NOT NULL,
        lastUpdated INTEGER NOT NULL
      )
    `);

    // Create an index on lastUpdated for efficient cleanup
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_lastUpdated ON steam_users(lastUpdated)
    `);
  }

  /**
   * Get cached user data for multiple Steam IDs
   * Returns an array of found entries and an array of missing Steam IDs
   */
  public getCachedUsers(steamIds: string[]): {
    cachedUsers: Omit<SteamUserData, "lastUpdated">[];
    missingIds: string[];
  } {
    const now = Date.now();
    const cutoffTime = now - this.CACHE_DURATION;

    // Prepare statement to get users that are still valid (not expired)
    const stmt = this.db.prepare(`
      SELECT steamid, personaname, profilePicture
      FROM steam_users
      WHERE steamid = ? AND lastUpdated > ?
    `);

    const cachedUsers: Omit<SteamUserData, "lastUpdated">[] = [];
    const missingIds: string[] = [];

    for (const steamId of steamIds) {
      const user = stmt.get(steamId, cutoffTime) as
        | Omit<SteamUserData, "lastUpdated">
        | undefined;

      if (user) {
        cachedUsers.push(user);
      } else {
        missingIds.push(steamId);
      }
    }

    return { cachedUsers, missingIds };
  }

  /**
   * Cache user data for multiple users
   */
  public cacheUsers(users: Omit<SteamUserData, "lastUpdated">[]): void {
    const now = Date.now();

    // Use a transaction for better performance when inserting multiple records
    const insertStmt = this.db.prepare(`
      INSERT OR REPLACE INTO steam_users (steamid, personaname, profilePicture, lastUpdated)
      VALUES (?, ?, ?, ?)
    `);

    const transaction = this.db.transaction(
      (users: Omit<SteamUserData, "lastUpdated">[]) => {
        for (const user of users) {
          insertStmt.run(
            user.steamid,
            user.personaname,
            user.profilePicture,
            now
          );
        }
      }
    );

    transaction(users);
  }

  /**
   * Clean up expired cache entries
   */
  public cleanupExpiredEntries(): number {
    const cutoffTime = Date.now() - this.CACHE_DURATION;
    const stmt = this.db.prepare(
      "DELETE FROM steam_users WHERE lastUpdated <= ?"
    );
    const result = stmt.run(cutoffTime);
    return result.changes;
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): { totalEntries: number; validEntries: number } {
    const totalStmt = this.db.prepare(
      "SELECT COUNT(*) as count FROM steam_users"
    );
    const total = (totalStmt.get() as { count: number }).count;

    const cutoffTime = Date.now() - this.CACHE_DURATION;
    const validStmt = this.db.prepare(
      "SELECT COUNT(*) as count FROM steam_users WHERE lastUpdated > ?"
    );
    const valid = (validStmt.get(cutoffTime) as { count: number }).count;

    return {
      totalEntries: total,
      validEntries: valid
    };
  }

  /**
   * Close the database connection
   */
  public close(): void {
    this.db.close();
  }
}

export default SteamCache;
