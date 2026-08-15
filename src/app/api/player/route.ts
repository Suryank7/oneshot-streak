// ============================================================
// POST /api/player — Create Anonymous Player
// ============================================================

import { NextResponse } from 'next/server';
import { createPlayer } from '@/lib/game-service';
import type { PlayerResponse, ApiError } from '@/lib/types';

export async function POST() {
  try {
    const playerId = await createPlayer();

    const response: PlayerResponse = {
      player_id: playerId,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to create player:', error);

    const errorResponse: ApiError = {
      error: 'player_creation_failed',
      message: 'Could not create player. Please try again.',
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
