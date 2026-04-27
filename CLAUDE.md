# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IOSoccer Sudamérica Stats is a full-stack web application for tracking competitive matches, standings, and individual player statistics for the South American IOSoccer community. Built with Next.js App Router and MongoDB.

## Commands

```bash
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm run start      # Run production server
npm run lint       # ESLint (broken in this env — use npx tsc --noEmit for type checking instead)
npx tsc --noEmit   # TypeScript type check
npm run format     # Prettier formatting
npm run cache-manager  # Manage Steam profile cache (stats/cleanup/clear)
```

## Architecture

### Stack
- **Frontend**: React 19 + Next.js 16 App Router, Tailwind CSS, TanStack React Table
- **Backend**: Next.js API routes + Server Actions, MongoDB (via aggregation pipelines)
- **Auth**: NextAuth 5 with Discord OAuth
- **External APIs**: Steam Web API (with local SQLite cache, 24hr TTL)
- **Automation**: Puppeteer for match card image generation

### Data Flow
```
Client (React pages)
  → API Routes (/app/api/*) or Server Actions
  → lib/getFromDB.ts (main data access layer)
  → lib/aggregations/*.ts (MongoDB pipelines)
  → MongoDB (matches2 collection)
```

### Key Directories

- **`/app/api`** — 13+ API endpoints. Match CRUD lives under `postupload`, `postdelete`, `postupdate`. Player/team queries are `jugador`, `jugadores`, `equipo`. `matchcard/[id]` generates shareable match images via Puppeteer.
- **`/lib/aggregations`** — 21 MongoDB aggregation pipeline files. This is where all stats computation happens (standings, leaderboards, player totals). `queries.ts` builds the base `$match` filter for tournament/season/team filtering.
- **`/lib/getFromDB.ts`** — Single entry point for all DB queries; imports aggregations and returns typed results.
- **`/lib/steamCache.ts`** — SQLite-backed cache for Steam profile lookups to avoid hitting rate limits.
- **`/utils/Utils.ts`** — Team logos, date helpers, and tournament metadata. `utils/Torneos.json` holds tournament config.
- **`/types.ts`** — Core TypeScript interfaces: `Player`, `Match`, `MatchEvent`, `Positions`.

### Environment Variables

Required in `.env.local`:
```
DB_HOST, DB_USER, DB_PASS, DB_NAME
DB_COLLECTION=matches2
DB_COLLECTION_TOURNAMENTS
DB_COLLECTION_FORUM
STEAM_API
DISCORD_WEBHOOK_URL
DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET
NEXTAUTH_URL
AUTH_SECRET
```

### Deployment

GitHub Actions (`.github/workflows/deploy.yaml`) builds on CI and SCPs the compiled `.next/`, `public/`, and `package.json` to a VPS, then restarts the `iossa-stats` systemd service. The VPS does not build — only the CI runner does.

### Patterns & Conventions

- **TypeScript** with `strict: false`; path alias `@/*` maps to repo root.
- **Server Components** by default; use `"use client"` only for interactive elements (forms, votes).
- **Server Actions** are used for forum vote mutations (configured in `next.config.js` for `iosoccer-sa.com` and `localhost`).
- MongoDB results contain `ObjectId` and `Date` objects — serialize them to strings before passing to client components.
- Statistics tracked per player span ~35+ fields (goals, assists, saves, cards, distance, possession %, etc.) — see `types.ts` for the full `Player` interface.
