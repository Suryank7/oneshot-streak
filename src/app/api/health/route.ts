// ============================================================
// GET /api/health — Health Check Endpoint
// ============================================================

import { NextResponse } from 'next/server';
import { getGameDate } from '@/lib/game-date';
import type { HealthResponse } from '@/lib/types';

export async function GET() {
  const response: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    game_date: getGameDate(),
  };

  return NextResponse.json(response);
}
