// ============================================================
// Streak — Type Definitions
// ============================================================
// Shared types for the game. Used by both API routes and
// the game service. Frontend components import response types.
// ============================================================

// --- Database Models ---

export interface Player {
  id: string;
  created_at: string;
}

export interface Puzzle {
  id: number;
  game_date: string;
  clue_1: string;
  clue_2: string;
  clue_3: string;
  answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at: string;
}

export interface Attempt {
  id: number;
  player_id: string;
  puzzle_id: number;
  game_date: string;
  guess: number;
  is_correct: boolean;
  created_at: string;
}

// --- API Types ---

export interface StreakInfo {
  current: number;
  longest: number;
  is_new_best?: boolean;
}

export interface PuzzleClues {
  clue_1: string;
  clue_2: string;
  clue_3: string;
}

export type GameState = 'ready' | 'completed' | 'unavailable';

export interface PuzzleResponse {
  game_date: string;
  puzzle: PuzzleClues | null;
  state: GameState;
  result?: {
    guess: number;
    is_correct: boolean;
    answer: number;
  };
  streak: StreakInfo;
  next_puzzle_at: string;
  message?: string;
}

export interface GuessRequest {
  player_id: string;
  guess: number;
}

export interface GuessResponse {
  result: 'correct' | 'wrong';
  answer: number;
  streak: StreakInfo;
  next_puzzle_at: string;
}

export interface PlayerResponse {
  player_id: string;
}

export interface HealthResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  game_date: string;
}

export interface ApiError {
  error: string;
  message: string;
}

// --- Frontend State ---

export type UIState =
  | 'loading'
  | 'ready'
  | 'submitting'
  | 'correct'
  | 'wrong'
  | 'completed'
  | 'unavailable'
  | 'error';
