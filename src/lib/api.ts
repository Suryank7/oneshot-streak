// ============================================================
// Streak — Frontend API Client
// ============================================================
// Typed fetch wrappers for all API endpoints.
// Runs in the browser — never sees the answer before guessing.
// ============================================================

import type {
  PuzzleResponse,
  GuessResponse,
  PlayerResponse,
  HealthResponse,
  ApiError,
} from './types';

class ApiClient {
  private baseUrl = '/api';

  /**
   * Creates a new anonymous player.
   */
  async createPlayer(): Promise<PlayerResponse> {
    const res = await fetch(`${this.baseUrl}/player`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const error: ApiError = await res.json();
      throw new ApiRequestError(error.error, error.message, res.status);
    }

    return res.json();
  }

  /**
   * Fetches today's puzzle and game state.
   */
  async getPuzzle(playerId: string): Promise<PuzzleResponse> {
    const res = await fetch(
      `${this.baseUrl}/puzzle?player_id=${encodeURIComponent(playerId)}`
    );

    if (!res.ok) {
      const error: ApiError = await res.json();
      throw new ApiRequestError(error.error, error.message, res.status);
    }

    return res.json();
  }

  /**
   * Submits a guess.
   */
  async submitGuess(playerId: string, guess: number): Promise<GuessResponse> {
    const res = await fetch(`${this.baseUrl}/guess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerId, guess }),
    });

    if (!res.ok) {
      const error: ApiError = await res.json();
      throw new ApiRequestError(error.error, error.message, res.status);
    }

    return res.json();
  }

  /**
   * Health check.
   */
  async checkHealth(): Promise<HealthResponse> {
    const res = await fetch(`${this.baseUrl}/health`);
    return res.json();
  }
}

export class ApiRequestError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

// Singleton instance
export const api = new ApiClient();
