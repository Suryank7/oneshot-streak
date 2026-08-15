// ============================================================
// GET /api/puzzle — Today's Puzzle + Game State
// ============================================================
// Returns today's puzzle clues (NEVER the answer before a guess),
// the player's current game state, and streak information.
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { getPlayerGameState, playerExists } from '@/lib/game-service';
import type { ApiError } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('player_id');

  // Validate player_id parameter
  if (!playerId) {
    const errorResponse: ApiError = {
      error: 'missing_player_id',
      message: 'player_id query parameter is required.',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(playerId)) {
    const errorResponse: ApiError = {
      error: 'invalid_player_id',
      message: 'player_id must be a valid UUID.',
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  // Verify player exists
  const exists = await playerExists(playerId);
  if (!exists) {
    const errorResponse: ApiError = {
      error: 'player_not_found',
      message: 'Player not found.',
    };
    return NextResponse.json(errorResponse, { status: 404 });
  }

  try {
    const gameState = await getPlayerGameState(playerId);
    return NextResponse.json(gameState);
  } catch (error) {
    console.error('Failed to get game state:', error);

    const errorResponse: ApiError = {
      error: 'server_error',
      message: 'Could not load today\'s puzzle. Please try again.',
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
