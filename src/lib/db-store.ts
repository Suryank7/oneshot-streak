// ============================================================
// Streak — Storage Abstraction Layer (Supabase + File Fallback)
// ============================================================
// Automatically uses Supabase PostgreSQL DB when env vars exist.
// Supports SUPABASE_URL and NEXT_PUBLIC_SUPABASE_URL.
// Uses os.tmpdir() for file fallback to prevent EROFS read-only errors on Vercel.
// ============================================================

import fs from 'fs';
import path from 'path';
import os from 'os';
import { supabase } from './supabase';
import type { Player, Puzzle, Attempt, PuzzleClues } from './types';

// Seed puzzle bank
const INITIAL_PUZZLES: Omit<Puzzle, 'id' | 'created_at'>[] = [
  { game_date: '2026-08-15', clue_1: "I'm an even number", clue_2: "I'm divisible by 3", clue_3: "I'm greater than 20", answer: 24, difficulty: 'medium' },
  { game_date: '2026-08-16', clue_1: "I'm a prime number", clue_2: "I'm between 10 and 20", clue_3: "My digits add up to 4", answer: 13, difficulty: 'easy' },
  { game_date: '2026-08-17', clue_1: "I'm an odd number", clue_2: "I'm a perfect square", clue_3: "I'm less than 30", answer: 25, difficulty: 'easy' },
  { game_date: '2026-08-18', clue_1: "I'm divisible by 5", clue_2: "I'm greater than 30", clue_3: "I'm even", answer: 40, difficulty: 'medium' },
  { game_date: '2026-08-19', clue_1: "I'm a prime number", clue_2: "I'm less than 10", clue_3: "I'm greater than 5", answer: 7, difficulty: 'easy' },
  { game_date: '2026-08-20', clue_1: "I'm divisible by 4", clue_2: "I'm between 25 and 45", clue_3: "My digits add up to 9", answer: 36, difficulty: 'medium' },
  { game_date: '2026-08-21', clue_1: "I'm an odd number", clue_2: "I'm divisible by 7", clue_3: "I'm less than 25", answer: 21, difficulty: 'easy' },
  { game_date: '2026-08-22', clue_1: "I'm an even number", clue_2: "I'm a perfect square", clue_3: "I'm greater than 10", answer: 16, difficulty: 'medium' },
  { game_date: '2026-08-23', clue_1: "I'm divisible by 3", clue_2: "I'm less than 20", clue_3: "I'm greater than 10", answer: 15, difficulty: 'medium' },
  { game_date: '2026-08-24', clue_1: "I'm a prime number", clue_2: "I'm greater than 20", clue_3: "I'm less than 35", answer: 29, difficulty: 'medium' },
  { game_date: '2026-08-25', clue_1: "I'm divisible by 6", clue_2: "I'm less than 50", clue_3: "My digits add up to 6", answer: 42, difficulty: 'medium' },
  { game_date: '2026-08-26', clue_1: "I'm an odd number", clue_2: "I'm between 30 and 50", clue_3: "I'm divisible by 3", answer: 33, difficulty: 'medium' },
  { game_date: '2026-08-27', clue_1: "I'm an even number", clue_2: "I'm less than 15", clue_3: "I'm greater than 5", answer: 8, difficulty: 'medium' },
  { game_date: '2026-08-28', clue_1: "I'm divisible by 5", clue_2: "I'm odd", clue_3: "I'm between 20 and 50", answer: 25, difficulty: 'easy' },
  { game_date: '2026-08-29', clue_1: "I'm a prime number", clue_2: "I'm greater than 35", clue_3: "I'm less than 50", answer: 37, difficulty: 'hard' },
  { game_date: '2026-08-30', clue_1: "My digits multiply to give 8", clue_2: "I'm greater than 20", clue_3: "I'm an even number", answer: 42, difficulty: 'hard' },
  { game_date: '2026-08-31', clue_1: "I'm divisible by 4", clue_2: "I'm less than 30", clue_3: "My digits add up to 3", answer: 12, difficulty: 'medium' },
  { game_date: '2026-09-01', clue_1: "I'm an odd number", clue_2: "I'm a two-digit number", clue_3: "Both my digits are the same", answer: 11, difficulty: 'easy' },
  { game_date: '2026-09-02', clue_1: "I'm divisible by 7", clue_2: "I'm greater than 30", clue_3: "I'm less than 50", answer: 49, difficulty: 'hard' },
  { game_date: '2026-09-03', clue_1: "I'm a prime number", clue_2: "I'm between 40 and 50", clue_3: "I'm odd", answer: 43, difficulty: 'hard' }
];

interface FileDB {
  players: Player[];
  puzzles: Puzzle[];
  attempts: Attempt[];
}

// Use os.tmpdir() on Vercel to prevent read-only filesystem errors (EROFS)
const DB_PATH = (process.env.VERCEL || process.env.NODE_ENV === 'production')
  ? path.join(os.tmpdir(), 'streak-db.json')
  : path.join(process.cwd(), '.data', 'db.json');

function isSupabaseConfigured(): boolean {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (url.includes('your-project') || key.includes('your-service-role-key')) return false;
  return true;
}

// --- File Storage Helper ---
function loadFileDB(): FileDB {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      const db: FileDB = JSON.parse(data);
      ensureTodayPuzzleInFileDB(db);
      return db;
    }
  } catch (e) {
    console.warn('File DB read failed, initializing fresh store', e);
  }

  // Initialize fresh
  const db: FileDB = {
    players: [],
    puzzles: INITIAL_PUZZLES.map((p, idx) => ({
      id: idx + 1,
      ...p,
      created_at: new Date().toISOString()
    })),
    attempts: []
  };
  ensureTodayPuzzleInFileDB(db);
  saveFileDB(db);
  return db;
}

function saveFileDB(db: FileDB) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save file DB:', e);
  }
}

function ensureTodayPuzzleInFileDB(db: FileDB) {
  const now = new Date();
  const todayStr = now.toLocaleDateString('en-CA', { timeZone: process.env.GAME_TIMEZONE || 'Asia/Kolkata' });
  const exists = db.puzzles.some(p => p.game_date === todayStr);

  if (!exists) {
    const template = INITIAL_PUZZLES[0];
    db.puzzles.push({
      id: db.puzzles.length + 1,
      game_date: todayStr,
      clue_1: template.clue_1,
      clue_2: template.clue_2,
      clue_3: template.clue_3,
      answer: template.answer,
      difficulty: template.difficulty,
      created_at: new Date().toISOString()
    });
  }
}

async function ensureTodayPuzzleInSupabase(gameDate: string): Promise<Puzzle | null> {
  const template = INITIAL_PUZZLES.find(p => p.game_date === gameDate) || INITIAL_PUZZLES[0];
  try {
    const { data, error } = await supabase
      .from('puzzles')
      .insert({
        game_date: gameDate,
        clue_1: template.clue_1,
        clue_2: template.clue_2,
        clue_3: template.clue_3,
        answer: template.answer,
        difficulty: template.difficulty
      })
      .select('*')
      .single();

    if (!error && data) return data as Puzzle;
    if (error) console.warn('Supabase ensureTodayPuzzle insert notice:', error.message);
  } catch (e) {
    console.warn('Failed to seed today puzzle in Supabase:', e);
  }
  return null;
}

// --- Store Interface Implementation ---

export async function dbCreatePlayer(): Promise<string> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert({})
        .select('id')
        .single();
      if (!error && data) return data.id;
      console.warn('Supabase createPlayer returned notice:', error);
    } catch (e) {
      console.warn('Supabase createPlayer Exception:', e);
    }
  }

  const db = loadFileDB();
  const id = crypto.randomUUID();
  db.players.push({ id, created_at: new Date().toISOString() });
  saveFileDB(db);
  return id;
}

export async function dbEnsurePlayerExists(playerId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('players')
        .upsert({ id: playerId }, { onConflict: 'id' })
        .select('id')
        .single();
      if (!error && data) return true;
    } catch (e) {
      console.warn('Supabase ensurePlayerExists failed:', e);
    }
  }

  const db = loadFileDB();
  if (!db.players.some(p => p.id === playerId)) {
    db.players.push({ id: playerId, created_at: new Date().toISOString() });
    saveFileDB(db);
  }
  return true;
}

export async function dbPlayerExists(playerId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('id')
        .eq('id', playerId)
        .maybeSingle();
      if (!error && data) return true;
    } catch (e) {
      console.warn('Supabase playerExists failed, using file fallback');
    }
  }

  const db = loadFileDB();
  return db.players.some(p => p.id === playerId);
}

export async function dbGetTodaysPuzzleClues(gameDate: string): Promise<{ id: number; clues: PuzzleClues } | null> {
  if (isSupabaseConfigured()) {
    try {
      let { data, error } = await supabase
        .from('puzzles')
        .select('id, clue_1, clue_2, clue_3')
        .eq('game_date', gameDate)
        .maybeSingle();

      if (!data) {
        const created = await ensureTodayPuzzleInSupabase(gameDate);
        if (created) {
          return {
            id: created.id,
            clues: { clue_1: created.clue_1, clue_2: created.clue_2, clue_3: created.clue_3 }
          };
        }
      } else if (!error && data) {
        return {
          id: data.id,
          clues: { clue_1: data.clue_1, clue_2: data.clue_2, clue_3: data.clue_3 }
        };
      }
    } catch (e) {
      console.warn('Supabase getTodaysPuzzleClues failed, using file fallback');
    }
  }

  const db = loadFileDB();
  const puzzle = db.puzzles.find(p => p.game_date === gameDate);
  if (!puzzle) return null;
  return {
    id: puzzle.id,
    clues: { clue_1: puzzle.clue_1, clue_2: puzzle.clue_2, clue_3: puzzle.clue_3 }
  };
}

export async function dbGetTodaysPuzzleFull(gameDate: string): Promise<Puzzle | null> {
  if (isSupabaseConfigured()) {
    try {
      let { data, error } = await supabase
        .from('puzzles')
        .select('*')
        .eq('game_date', gameDate)
        .maybeSingle();

      if (!data) {
        const created = await ensureTodayPuzzleInSupabase(gameDate);
        if (created) return created;
      } else if (!error && data) {
        return data as Puzzle;
      }
    } catch (e) {
      console.warn('Supabase getTodaysPuzzleFull failed, using file fallback');
    }
  }

  const db = loadFileDB();
  const puzzle = db.puzzles.find(p => p.game_date === gameDate);
  return puzzle || null;
}

export async function dbGetAttemptForDate(playerId: string, gameDate: string): Promise<Attempt | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('attempts')
        .select('*')
        .eq('player_id', playerId)
        .eq('game_date', gameDate)
        .maybeSingle();
      if (!error && data) return data as Attempt;
    } catch (e) {
      console.warn('Supabase getAttemptForDate failed, using file fallback');
    }
  }

  const db = loadFileDB();
  const attempt = db.attempts.find(a => a.player_id === playerId && a.game_date === gameDate);
  return attempt || null;
}

export async function dbGetAllAttempts(playerId: string): Promise<Attempt[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('attempts')
        .select('*')
        .eq('player_id', playerId)
        .order('game_date', { ascending: false });
      if (!error && data) return data as Attempt[];
    } catch (e) {
      console.warn('Supabase getAllAttempts failed, using file fallback');
    }
  }

  const db = loadFileDB();
  return db.attempts
    .filter(a => a.player_id === playerId)
    .sort((a, b) => b.game_date.localeCompare(a.game_date));
}

export async function dbRecordAttempt(
  playerId: string,
  puzzleId: number,
  gameDate: string,
  guess: number,
  isCorrect: boolean
): Promise<{ success: boolean; isDuplicate: boolean }> {
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('attempts')
        .insert({
          player_id: playerId,
          puzzle_id: puzzleId,
          game_date: gameDate,
          guess,
          is_correct: isCorrect,
        });

      if (!error) return { success: true, isDuplicate: false };
      if (error.code === '23505') return { success: false, isDuplicate: true };
    } catch (e) {
      console.warn('Supabase recordAttempt failed, using file fallback');
    }
  }

  const db = loadFileDB();
  const duplicate = db.attempts.some(a => a.player_id === playerId && a.game_date === gameDate);
  if (duplicate) {
    return { success: false, isDuplicate: true };
  }

  const newAttempt: Attempt = {
    id: db.attempts.length + 1,
    player_id: playerId,
    puzzle_id: puzzleId,
    game_date: gameDate,
    guess,
    is_correct: isCorrect,
    created_at: new Date().toISOString()
  };

  db.attempts.push(newAttempt);
  saveFileDB(db);
  return { success: true, isDuplicate: false };
}
