// ============================================================
// Streak — Core Game Service (Server-Side Only)
// ============================================================
// Contains all game business logic:
//   - Puzzle lookup (without answer)
//   - Guess validation and recording
//   - Streak calculation from attempt history
//   - Player game state determination
//
// Delegates storage to db-store.ts (Supabase + File Fallback)
// ============================================================

import { getGameDate, getNextPuzzleAt } from './game-date';
import { calculateStreak, getPreviousDay } from './streak';
import {
  dbCreatePlayer,
  dbPlayerExists,
  dbGetTodaysPuzzleClues,
  dbGetTodaysPuzzleFull,
  dbGetAttemptForDate,
  dbGetAllAttempts,
  dbRecordAttempt,
} from './db-store';
import type {
  PuzzleResponse,
  GuessResponse,
  GameState,
} from './types';

// --- Player Management ---

export async function createPlayer(): Promise<string> {
  return await dbCreatePlayer();
}

export async function playerExists(playerId: string): Promise<boolean> {
  return await dbPlayerExists(playerId);
}

// --- Main Game Operations ---

/**
 * Gets the complete game state for a player.
 * This is what GET /api/puzzle returns.
 */
export async function getPlayerGameState(playerId: string): Promise<PuzzleResponse> {
  const gameDate = getGameDate();
  const nextPuzzleAt = getNextPuzzleAt();

  // Get all attempts for streak calculation
  const allAttempts = await dbGetAllAttempts(playerId);
  const streak = calculateStreak(allAttempts, gameDate);

  // Check if player already played today
  const todaysAttempt = await dbGetAttemptForDate(playerId, gameDate);

  if (todaysAttempt) {
    // Already played — show result
    const puzzle = await dbGetTodaysPuzzleFull(gameDate);
    const puzzleClues = puzzle
      ? { clue_1: puzzle.clue_1, clue_2: puzzle.clue_2, clue_3: puzzle.clue_3 }
      : null;

    return {
      game_date: gameDate,
      puzzle: puzzleClues,
      state: 'completed' as GameState,
      result: {
        guess: todaysAttempt.guess,
        is_correct: todaysAttempt.is_correct,
        answer: puzzle?.answer ?? 0,
      },
      streak,
      next_puzzle_at: nextPuzzleAt,
    };
  }

  // Not yet played — check if puzzle exists
  const puzzleData = await dbGetTodaysPuzzleClues(gameDate);

  if (!puzzleData) {
    return {
      game_date: gameDate,
      puzzle: null,
      state: 'unavailable' as GameState,
      streak,
      next_puzzle_at: nextPuzzleAt,
      message: 'No puzzle available for today. Check back tomorrow!',
    };
  }

  return {
    game_date: gameDate,
    puzzle: puzzleData.clues,
    state: 'ready' as GameState,
    streak,
    next_puzzle_at: nextPuzzleAt,
  };
}

/**
 * Submits a guess. This is the core game operation.
 */
export async function submitGuess(
  playerId: string,
  guess: number
): Promise<GuessResponse> {
  const gameDate = getGameDate();

  // 1. Validate guess
  if (!Number.isInteger(guess) || guess < 1 || guess > 50) {
    throw new GameError('invalid_guess', 'Guess must be a whole number between 1 and 50.', 400);
  }

  // 2. Verify player exists
  const exists = await playerExists(playerId);
  if (!exists) {
    throw new GameError('invalid_player', 'Player not found.', 400);
  }

  // 3. Get today's puzzle (with answer — server side only)
  const puzzle = await dbGetTodaysPuzzleFull(gameDate);
  if (!puzzle) {
    throw new GameError('no_puzzle', 'No puzzle available for today.', 404);
  }

  // 4. Determine correctness
  const isCorrect = guess === puzzle.answer;

  // 5. Record the attempt — enforcement via dbRecordAttempt (UNIQUE check)
  const recordResult = await dbRecordAttempt(playerId, puzzle.id, gameDate, guess, isCorrect);

  if (!recordResult.success) {
    if (recordResult.isDuplicate) {
      throw new GameError('already_played', "You've already taken your shot today.", 409);
    }
    throw new Error('Failed to record attempt.');
  }

  // 6. Calculate updated streak
  const allAttempts = await dbGetAllAttempts(playerId);
  const streak = calculateStreak(allAttempts, gameDate);

  // Check if this is a new personal best
  const previousLongest = calculateStreak(
    allAttempts.filter(a => a.game_date !== gameDate),
    getPreviousDay(gameDate)
  ).longest;
  const isNewBest = streak.longest > previousLongest;

  return {
    result: isCorrect ? 'correct' : 'wrong',
    answer: puzzle.answer,
    streak: {
      ...streak,
      is_new_best: isNewBest,
    },
    next_puzzle_at: getNextPuzzleAt(),
  };
}

// --- Custom Error Class ---

export class GameError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'GameError';
  }
}
