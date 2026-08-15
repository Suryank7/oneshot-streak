// ============================================================
// Streak — Game Date Utility (Server-Side Only)
// ============================================================
// Single source of truth for determining the current game date.
// All game logic flows through this — the frontend never
// calculates game dates.
// ============================================================

const GAME_TIMEZONE = process.env.GAME_TIMEZONE || 'Asia/Kolkata';

/**
 * Returns today's game date as a YYYY-MM-DD string in the configured timezone.
 * This is the single authority for "what day is it in the game."
 */
export function getGameDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-CA', { timeZone: GAME_TIMEZONE });
}

/**
 * Returns the ISO timestamp for the next puzzle reset (midnight in game timezone).
 */
export function getNextPuzzleAt(): string {
  const today = getGameDate();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Construct midnight in the game timezone
  // We use a known offset approach for IST (UTC+5:30)
  // For production, a timezone library would be more robust
  const midnightUTC = new Date(`${tomorrowStr}T00:00:00+05:30`);
  return midnightUTC.toISOString();
}
