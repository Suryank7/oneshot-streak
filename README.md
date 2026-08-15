# 🎯 DateGain — Daily Streak & Number Quiz Engine

[![Next.js 16](https://img.shields.io/badge/Next.js-16%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0%20Strict-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/Vitest-21%20Tests%20Passing-green?style=for-the-badge&logo=vitest)](https://vitest.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-emerald?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

A daily number-guessing riddle platform with streak tracking, gamified player progression, leaderboards, and activity calendar visualizations. Built with **Next.js 16 App Router**, **TypeScript**, **Supabase PostgreSQL** (with zero-config local JSON fallback), and a **Vitest-tested** streak engine.

---

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Database Schema & Migrations](#-database-schema--migrations)
- [API Specifications](#-api-specifications)
- [Architecture Decisions & Trade-offs](#-architecture-decisions--trade-offs)
- [Getting Started (Local Setup)](#-getting-started-local-setup)
- [Testing Suite](#-testing-suite)
- [Deployment Guide (Vercel & Supabase)](#-deployment-guide-vercel--supabase)

---

## 🌟 Project Overview

**DateGain** challenges players with a new number riddle (range 1–50) every single day. Players receive 3 progressive clues to deduce the target number. Correct guesses build daily play streaks, level up player ranks (Apprentice → Champion → Legendary Master), unlock milestone badges, and qualify players for top spots on the global Leaderboard.

### Key Value Propositions:
- **Zero Friction Onboarding**: Instant anonymous player creation saved in `localStorage` — no password required.
- **Fail-Safe Reliability**: Hardware-level PostgreSQL `UNIQUE(player_id, game_date)` constraint prevents double-submitting while automatic file-backed JSON storage enables instant `npm run dev` offline out of the box.
- **Visual Design**: Custom mobile container interface with floating bottom navigation, HSL color tokens, glassmorphic cards, and micro-animations.

---

## 🎨 Key Features

### 1. 🏠 Home Dashboard & Game Selection
- **Pick a Card View**: Interactive game selector with life HP counters and riddle theme previews.
- **Upgrade Banner**: Special pro perk promotion for extra lives and hints.
- **Popular Game Carousel**: Horizontal snap carousel displaying featured daily categories.

### 2. 🧩 Daily Clue Quiz & Live Engine
- **3 Clue System**: Progressive hints (e.g. clue 1: general property, clue 2: divisibility, clue 3: bounded range).
- **Centered Input Card**: Clean number validation (1–50) with error hints.
- **Live Ticking Timer**: Real-time header countdown timer (`03:03` → `03:02`...) for active quiz sessions.

### 3. 🔥 "My Streak" Stats & Gamification
- **Hero Level Banner**: Dynamic player rank badges (*Rookie Guesser* → *Streak Apprentice* → *Streak Champion* → *Legendary Master*).
- **Side-by-Side Stats**: Real-time comparison between Current Streak and Personal Best Streak.
- **Streak Milestones**: Unlocked badges at 3, 7, 14, and 30-day play milestones.
- **30-Day Activity Calendar**: Visual grid highlighting correct guesses, missed days, and current status.
- **Minimal Next Puzzle Countdown**: Sleek inline timer indicating when tomorrow's riddle unlocks.

### 4. 🏆 Top 3 Gaming Podium Leaderboard
- **3D Gaming Podium Stage**: Elevated Gold (#1), Silver (#2), and Bronze (#3) pedestals.
- **Golden Crown & Glow**: Animated floating crown (`👑`) and ring highlight above rank #1 player.
- **Ranked Player List**: Ranked list (#4 through #8+) with diamond/points score badges.

### 5. 🎉 Results & Sharing
- **Congratulatory Screen**: Vector graphics celebrating correct guesses or encouraging retries.
- **Answer Reveal Pill**: Prominent answer display.
- **Action Cards Grid**: 3-column grid featuring **Home**, **Rating**, and **Share** (Web Share API integration with clipboard fallback).

---

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────────────────────────────────────────┐
│              Next.js 16 App Router (React 19)           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │ HomeDashboard│  │  PuzzleCard  │  │LeaderboardVw │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │           │
│         └─────────────────┼─────────────────┘           │
│                           ▼                             │
│                  Game Orchestrator                      │
└───────────────────────────┬─────────────────────────────┘
                            │ API Fetch (/api/*)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    Next.js API Routes                   │
│   /api/health │ /api/player │ /api/puzzle │ /api/guess   │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Server Game Service                     │
│    • Deterministic Streak Engine (streak.ts)             │
│    • Input Validation & Sanitization                     │
└───────────────────────────┬─────────────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
  ┌───────────────────────┐   ┌───────────────────────┐
  │ Supabase PostgreSQL   │   │ Local JSON DB Store   │
  │ (Primary Database)    │   │ (.data/db.json)       │
  └───────────────────────┘   └───────────────────────┘
```

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router + Turbopack) | Server-side API routing, optimized builds, fast hot module replacement |
| **Language** | TypeScript (Strict Mode) | Type safety across state machines, API contracts, and streak calculations |
| **Styling** | Vanilla CSS (`globals.css`) | Maximum design flexibility, zero runtime CSS overhead, glassmorphism tokens |
| **Testing** | Vitest | Lightning-fast unit tests for core game logic and validation rules |
| **Storage** | Supabase PostgreSQL + File DB Fallback | High-availability PostgreSQL database with zero-setup local JSON fallback |

---

## 🗄️ Database Schema & Migrations

The database is built on PostgreSQL with strict constraints to prevent duplicate daily attempts.

### DDL Migration Script (`schema.sql`)

```sql
-- Create Players Table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Puzzles Table
CREATE TABLE IF NOT EXISTS puzzles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_date DATE UNIQUE NOT NULL,
  target_number INT NOT NULL CHECK (target_number BETWEEN 1 AND 50),
  clue_1 TEXT NOT NULL,
  clue_2 TEXT NOT NULL,
  clue_3 TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Guesses Table (Hardware Enforcement for 1 Guess Per Day)
CREATE TABLE IF NOT EXISTS guesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  game_date DATE NOT NULL,
  guess_number INT NOT NULL CHECK (guess_number BETWEEN 1 AND 50),
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_player_date UNIQUE (player_id, game_date)
);

-- Create Streaks Table
CREATE TABLE IF NOT EXISTS streaks (
  player_id UUID PRIMARY KEY REFERENCES players(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INT NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  last_played_date DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for Query Optimization
CREATE INDEX IF NOT EXISTS idx_guesses_player_date ON guesses(player_id, game_date);
CREATE INDEX IF NOT EXISTS idx_puzzles_game_date ON puzzles(game_date);
```

---

## 📡 API Specifications

### 1. `GET /api/health`
Checks server status and database connectivity.

**Response `200 OK`**:
```json
{
  "status": "ok",
  "storage": "supabase" // or "file_fallback"
}
```

---

### 2. `POST /api/player`
Creates a new anonymous player session.

**Response `200 OK`**:
```json
{
  "id": "e4b2a8d1-7c93-4f12-8e05-2b1d3a5f6e7d"
}
```

---

### 3. `GET /api/puzzle?playerId=<UUID>`
Fetches today's puzzle state and the player's streak info.

**Response `200 OK` (State: Ready to play)**:
```json
{
  "state": "ready",
  "puzzle": {
    "clue_1": "I am an odd number greater than 10.",
    "clue_2": "I am a multiple of 7.",
    "clue_3": "I am less than 30."
  },
  "streak": {
    "current": 3,
    "longest": 5
  },
  "next_puzzle_at": "2026-08-16T00:00:00.000Z"
}
```

**Response `200 OK` (State: Already completed today)**:
```json
{
  "state": "completed",
  "result": {
    "guess": 21,
    "is_correct": true,
    "answer": 21
  },
  "streak": {
    "current": 4,
    "longest": 5
  },
  "next_puzzle_at": "2026-08-16T00:00:00.000Z"
}
```

---

### 4. `POST /api/guess`
Submits a guess for today's riddle.

**Request Body**:
```json
{
  "player_id": "e4b2a8d1-7c93-4f12-8e05-2b1d3a5f6e7d",
  "guess": 21
}
```

**Response `200 OK`**:
```json
{
  "result": "correct",
  "answer": 21,
  "streak": {
    "current": 4,
    "longest": 5,
    "is_new_best": false
  },
  "next_puzzle_at": "2026-08-16T00:00:00.000Z"
}
```

**Error `400 Bad Request`** (Already played today):
```json
{
  "error": "already_played",
  "message": "You have already submitted a guess for today's puzzle."
}
```

---

## ⚖️ Architecture Decisions & Trade-offs

### Decision 1: Dual-Tier Data Storage (Supabase + Local File Fallback)
- **Context**: Setting up cloud database environment variables can block initial dev setup.
- **Decision**: Built a storage abstraction ([db-store.ts](file:///c:/Users/lalit/Desktop/DateGain/streak-app/src/lib/db-store.ts)) that connects to Supabase PostgreSQL when credentials exist in `.env.local`, but automatically falls back to `.data/db.json` when credentials are not configured.
- **Trade-off**: Requires maintaining a JSON file serializer alongside SQL queries, but enables 0-config `npm run dev`.

### Decision 2: Server-Side Pure Streak Calculation Engine
- **Context**: Client clock manipulation can corrupt streak logic or allow cheating.
- **Decision**: Built a pure, deterministic calculation engine ([streak.ts](file:///c:/Users/lalit/Desktop/DateGain/streak-app/src/lib/streak.ts)) that evaluates sequence continuity (consecutive calendar dates `YYYY-MM-DD`).
- **Trade-off**: Streak increments only occur on verified server API submission.

### Decision 3: Hardware-Level PostgreSQL Unique Constraint
- **Context**: Race conditions from double-clicking the submit button could register multiple guesses.
- **Decision**: Added `CONSTRAINT unique_player_date UNIQUE (player_id, game_date)` directly at database schema level.
- **Trade-off**: Server logic must handle SQL code `23505` constraint violations gracefully and return friendly `already_played` errors.

### Decision 4: Single Vercel Deployment Target
- **Context**: Separating frontend and backend into distinct microservices adds infrastructure overhead.
- **Decision**: Deployed both Next.js App Router UI and API route handlers on Vercel free tier.

---

## 💻 Getting Started (Local Setup)

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/dategain-streak-app.git
   cd dategain-streak-app/streak-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

   *(Optional)* Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   *Note: If left blank, the app runs using the local JSON file database fallback.*

4. **Run Unit Tests**:
   ```bash
   npm test
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🧪 Testing Suite

The project includes unit tests powered by **Vitest** testing the core game math and validation rules:

```bash
npm test
```

### Test Coverage Highlights:
- **Streak Logic (`__tests__/streak.test.ts`)**:
  - Increments streak on consecutive day play.
  - Maintains streak on correct guess.
  - Resets current streak to 0 on incorrect guess while preserving personal best.
  - Resets current streak to 1 if a player missed one or more days before playing again.
  - Correctly updates `is_new_best` flag when defeating previous record.
- **Validation Suite (`__tests__/validation.test.ts`)**:
  - Validates integer ranges `1` to `50`.
  - Rejects NaN, non-integers, and out-of-bound inputs.
  - Enforces `YYYY-MM-DD` date string formatting.

---

## 🚀 Deployment Guide (Vercel & Supabase)

### 1. Deploying Database to Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the DDL migration script from [Database Schema](#-database-schema--migrations) or `src/lib/schema.sql`.
4. Copy your **Project URL** and **Service Role API Key** from `Project Settings -> API`.

### 2. Deploying to Vercel
1. Push your repository to **GitHub**.
2. Log into [vercel.com](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. Set **Root Directory** to `streak-app`.
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
6. Click **Deploy**!

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
