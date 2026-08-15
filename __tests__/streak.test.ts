// ============================================================
// Streak Calculation Tests
// ============================================================
// Tests the core streak logic in isolation.
// These are the most critical tests because streak calculation
// is the heart of the game's business logic.
// ============================================================

import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../src/lib/streak';
import type { Attempt } from '../src/lib/types';

// Helper to create mock attempts
function mockAttempt(
  gameDate: string,
  isCorrect: boolean,
  guess: number = 24
): Attempt {
  return {
    id: Math.random(),
    player_id: 'test-player',
    puzzle_id: 1,
    game_date: gameDate,
    guess,
    is_correct: isCorrect,
    created_at: new Date().toISOString(),
  };
}

describe('calculateStreak', () => {
  it('returns zero for empty attempt history', () => {
    const result = calculateStreak([], '2026-08-15');
    expect(result.current).toBe(0);
    expect(result.longest).toBe(0);
  });

  it('returns 1 for first correct answer', () => {
    const attempts = [mockAttempt('2026-08-15', true)];
    const result = calculateStreak(attempts, '2026-08-15');
    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
  });

  it('increments streak for consecutive correct days', () => {
    const attempts = [
      mockAttempt('2026-08-13', true),
      mockAttempt('2026-08-14', true),
      mockAttempt('2026-08-15', true),
    ];
    const result = calculateStreak(attempts, '2026-08-15');
    expect(result.current).toBe(3);
    expect(result.longest).toBe(3);
  });

  it('resets current streak on wrong answer', () => {
    const attempts = [
      mockAttempt('2026-08-13', true),
      mockAttempt('2026-08-14', true),
      mockAttempt('2026-08-15', false), // Wrong today
    ];
    const result = calculateStreak(attempts, '2026-08-15');
    expect(result.current).toBe(0);
    expect(result.longest).toBe(2); // Previous 2-day streak preserved
  });

  it('resets current streak on missed day', () => {
    const attempts = [
      mockAttempt('2026-08-12', true),
      mockAttempt('2026-08-13', true),
      // 2026-08-14 missed
      mockAttempt('2026-08-15', true),
    ];
    const result = calculateStreak(attempts, '2026-08-15');
    expect(result.current).toBe(1); // Only today counts
    expect(result.longest).toBe(2); // Aug 12-13 streak preserved
  });

  it('preserves longest streak after reset', () => {
    const attempts = [
      // 5-day streak
      mockAttempt('2026-08-06', true),
      mockAttempt('2026-08-07', true),
      mockAttempt('2026-08-08', true),
      mockAttempt('2026-08-09', true),
      mockAttempt('2026-08-10', true),
      // Wrong answer breaks it
      mockAttempt('2026-08-11', false),
      // New streak of 2
      mockAttempt('2026-08-14', true),
      mockAttempt('2026-08-15', true),
    ];
    const result = calculateStreak(attempts, '2026-08-15');
    expect(result.current).toBe(2);
    expect(result.longest).toBe(5); // Original 5-day streak
  });

  it('handles long gap then correct answer', () => {
    const attempts = [
      mockAttempt('2026-08-01', true),
      // Long gap
      mockAttempt('2026-08-15', true),
    ];
    const result = calculateStreak(attempts, '2026-08-15');
    expect(result.current).toBe(1);
    expect(result.longest).toBe(1);
  });

  it('correctly handles wrong answer after 20-day streak', () => {
    // Build a 20-day streak
    const attempts: Attempt[] = [];
    for (let i = 0; i < 20; i++) {
      const date = new Date('2026-07-26');
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      attempts.push(mockAttempt(dateStr, true));
    }
    // Wrong answer on day 21
    attempts.push(mockAttempt('2026-08-15', false));

    const result = calculateStreak(attempts, '2026-08-15');
    expect(result.current).toBe(0);
    expect(result.longest).toBe(20);
  });

  it('handles current streak when last play was yesterday', () => {
    // Player played yesterday (correct) but not yet today
    const attempts = [
      mockAttempt('2026-08-13', true),
      mockAttempt('2026-08-14', true),
    ];
    const result = calculateStreak(attempts, '2026-08-15');
    // Today not played yet — streak continues from yesterday
    expect(result.current).toBe(2);
    expect(result.longest).toBe(2);
  });

  it('returns zero current when last play was 2+ days ago', () => {
    const attempts = [
      mockAttempt('2026-08-12', true),
      mockAttempt('2026-08-13', true),
    ];
    // Today is Aug 15, missed Aug 14
    const result = calculateStreak(attempts, '2026-08-15');
    expect(result.current).toBe(0);
    expect(result.longest).toBe(2);
  });
});
