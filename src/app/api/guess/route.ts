// ============================================================
// POST /api/guess — Submit a Guess
// ============================================================
// The most important endpoint. Validates the guess server-side,
// records the attempt (UNIQUE constraint prevents duplicates),
// and returns the result with updated streak.
//
// Rate limited to 5 requests per minute per player.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { submitGuess, GameError } from '@/lib/game-service';
import type { GuessRequest, ApiError } from '@/lib/types';

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(playerId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(playerId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(playerId, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= 5) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Clean up stale entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function POST(request: NextRequest) {
  let body: GuessRequest;

  // Parse request body
  try {
    body = await request.json();
  } catch {
    const errorResponse: ApiError = {
      error: 'invalid_body',
      message: 'Request body must be valid JSON with player_id and guess.',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const { player_id, guess } = body;

  // Validate player_id
  if (!player_id || typeof player_id !== 'string') {
    const errorResponse: ApiError = {
      error: 'missing_player_id',
      message: 'player_id is required.',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(player_id)) {
    const errorResponse: ApiError = {
      error: 'invalid_player_id',
      message: 'player_id must be a valid UUID.',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Validate guess type and range (server-side validation)
  if (guess === undefined || guess === null) {
    const errorResponse: ApiError = {
      error: 'missing_guess',
      message: 'guess is required.',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  const guessNum = Number(guess);
  if (!Number.isInteger(guessNum) || guessNum < 1 || guessNum > 50) {
    const errorResponse: ApiError = {
      error: 'invalid_guess',
      message: 'Guess must be a whole number between 1 and 50.',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Rate limiting
  if (!checkRateLimit(player_id)) {
    const errorResponse: ApiError = {
      error: 'rate_limited',
      message: 'Too many requests. Try again shortly.',
    };
    return NextResponse.json(errorResponse, { status: 429 });
  }

  // Submit the guess
  try {
    const result = await submitGuess(player_id, guessNum);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof GameError) {
      const errorResponse: ApiError = {
        error: error.code,
        message: error.message,
      };
      return NextResponse.json(errorResponse, { status: error.statusCode });
    }

    console.error('Unexpected error in guess submission:', error);
    const errorResponse: ApiError = {
      error: 'server_error',
      message: 'Something went wrong. Your guess was not recorded.',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
