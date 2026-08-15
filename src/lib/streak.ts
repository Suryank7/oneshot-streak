// ============================================================
// Streak — Pure Streak Calculation (No DB Dependencies)
// ============================================================
// Extracted as a pure module so it can be unit-tested without
// requiring Supabase credentials or any external services.
// ============================================================

import type { Attempt, StreakInfo } from './types';

/**
 * Calculates current and longest streak from attempt history.
 *
 * Rules:
 *   - Current streak = consecutive correct answers ending at today or yesterday
 *   - If today has a wrong answer, current streak = 0
 *   - If yesterday was missed, current streak is at most 1 (if today was correct)
 *   - Longest streak = maximum consecutive correct answers ever
 */
export function calculateStreak(attempts: Attempt[], gameDate: string): StreakInfo {
  if (attempts.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Calculate longest streak by walking all attempts chronologically
  const sortedAsc = [...attempts].sort(
    (a, b) => a.game_date.localeCompare(b.game_date)
  );

  let longest = 0;
  let running = 0;

  for (let i = 0; i < sortedAsc.length; i++) {
    const attempt = sortedAsc[i];

    if (!attempt.is_correct) {
      running = 0;
      continue;
    }

    // Correct attempt — check if it's consecutive
    if (i === 0) {
      running = 1;
    } else {
      const prevDate = sortedAsc[i - 1].game_date;
      const currDate = attempt.game_date;
      const prevCorrect = sortedAsc[i - 1].is_correct;

      if (prevCorrect && isConsecutiveDay(prevDate, currDate)) {
        running += 1;
      } else {
        running = 1;
      }
    }

    longest = Math.max(longest, running);
  }

  // Calculate current streak by walking backward from today
  const sortedDesc = [...attempts].sort(
    (a, b) => b.game_date.localeCompare(a.game_date)
  );

  let current = 0;
  let expectedDate = gameDate;

  // If no attempt exists for today, the player hasn't broken their streak yet.
  // Start counting from yesterday instead.
  const hasPlayedToday = sortedDesc.some(a => a.game_date === gameDate);
  if (!hasPlayedToday) {
    expectedDate = getPreviousDay(gameDate);
  }

  for (const attempt of sortedDesc) {
    if (attempt.game_date === expectedDate) {
      if (!attempt.is_correct) {
        // Wrong answer on this day — streak is 0
        current = 0;
        break;
      }
      current += 1;
      expectedDate = getPreviousDay(expectedDate);
    } else if (attempt.game_date < expectedDate) {
      // Missed a day — streak breaks
      break;
    }
    // Skip future attempts (shouldn't exist, but defensive)
  }

  return { current, longest };
}

/**
 * Checks if two date strings represent consecutive days.
 */
export function isConsecutiveDay(dateA: string, dateB: string): boolean {
  const a = new Date(dateA);
  const b = new Date(dateB);
  const diffMs = b.getTime() - a.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays === 1;
}

/**
 * Returns the previous day as a YYYY-MM-DD string.
 */
export function getPreviousDay(dateStr: string): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}
