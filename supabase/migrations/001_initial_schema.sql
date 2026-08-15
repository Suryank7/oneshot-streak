-- ============================================================
-- Streak — Initial Database Schema
-- ============================================================
-- This migration creates the three core tables for the game:
--   players  — anonymous player identities
--   puzzles  — curated daily puzzles (one per date)
--   attempts — guess history with one-attempt enforcement
-- ============================================================

-- Players: anonymous identities (UUID-based)
CREATE TABLE IF NOT EXISTS players (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Puzzles: one curated puzzle per game date
CREATE TABLE IF NOT EXISTS puzzles (
  id          SERIAL PRIMARY KEY,
  game_date   DATE NOT NULL UNIQUE,
  clue_1      TEXT NOT NULL,
  clue_2      TEXT NOT NULL,
  clue_3      TEXT NOT NULL,
  answer      INTEGER NOT NULL CHECK (answer >= 1 AND answer <= 50),
  difficulty  TEXT NOT NULL DEFAULT 'medium',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Attempts: player guess history
-- The UNIQUE constraint on (player_id, game_date) is the DATABASE-LEVEL
-- enforcement of the one-guess-per-day rule. This prevents race conditions
-- where two simultaneous requests could both succeed.
CREATE TABLE IF NOT EXISTS attempts (
  id          SERIAL PRIMARY KEY,
  player_id   UUID NOT NULL REFERENCES players(id),
  puzzle_id   INTEGER NOT NULL REFERENCES puzzles(id),
  game_date   DATE NOT NULL,
  guess       INTEGER NOT NULL,
  is_correct  BOOLEAN NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- THE CRITICAL CONSTRAINT: one guess per player per day
  CONSTRAINT unique_player_date UNIQUE (player_id, game_date)
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_attempts_player_date ON attempts(player_id, game_date DESC);
CREATE INDEX IF NOT EXISTS idx_puzzles_game_date ON puzzles(game_date);
