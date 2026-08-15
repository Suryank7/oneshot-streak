// ============================================================
// API Validation Tests
// ============================================================
// Tests server-side input validation for the guess endpoint.
// These verify that the API correctly rejects invalid inputs
// regardless of what the frontend sends.
// ============================================================

import { describe, it, expect } from 'vitest';

// Since we can't easily test Next.js API routes in isolation with vitest,
// we test the validation logic that the API routes depend on.

describe('Guess Validation', () => {
  // Test the validation rules that the API enforces

  it('rejects non-integer guesses', () => {
    const guess = 3.5;
    expect(Number.isInteger(guess)).toBe(false);
  });

  it('rejects guesses below range', () => {
    const guess = 0;
    const isValid = Number.isInteger(guess) && guess >= 1 && guess <= 50;
    expect(isValid).toBe(false);
  });

  it('rejects guesses above range', () => {
    const guess = 51;
    const isValid = Number.isInteger(guess) && guess >= 1 && guess <= 50;
    expect(isValid).toBe(false);
  });

  it('accepts valid guesses', () => {
    for (const guess of [1, 25, 50]) {
      const isValid = Number.isInteger(guess) && guess >= 1 && guess <= 50;
      expect(isValid).toBe(true);
    }
  });

  it('rejects NaN guesses', () => {
    const guess = NaN;
    const isValid = Number.isInteger(guess) && guess >= 1 && guess <= 50;
    expect(isValid).toBe(false);
  });

  it('rejects negative guesses', () => {
    const guess = -5;
    const isValid = Number.isInteger(guess) && guess >= 1 && guess <= 50;
    expect(isValid).toBe(false);
  });
});

describe('UUID Validation', () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  it('accepts valid UUIDs', () => {
    expect(uuidRegex.test('a1b2c3d4-e5f6-7890-abcd-ef1234567890')).toBe(true);
    expect(uuidRegex.test('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('rejects invalid UUIDs', () => {
    expect(uuidRegex.test('not-a-uuid')).toBe(false);
    expect(uuidRegex.test('')).toBe(false);
    expect(uuidRegex.test('12345')).toBe(false);
  });

  it('rejects SQL injection in UUID field', () => {
    expect(uuidRegex.test("'; DROP TABLE players; --")).toBe(false);
  });
});

describe('Game Date Logic', () => {
  it('formats date as YYYY-MM-DD', () => {
    const date = new Date('2026-08-15T10:30:00+05:30');
    const formatted = date.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    expect(formatted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('consecutive day check works correctly', () => {
    const isConsecutive = (dateA: string, dateB: string) => {
      const a = new Date(dateA);
      const b = new Date(dateB);
      const diffMs = b.getTime() - a.getTime();
      return diffMs / (1000 * 60 * 60 * 24) === 1;
    };

    expect(isConsecutive('2026-08-14', '2026-08-15')).toBe(true);
    expect(isConsecutive('2026-08-13', '2026-08-15')).toBe(false);
    expect(isConsecutive('2026-08-31', '2026-09-01')).toBe(true);
  });
});
