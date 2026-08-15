// ============================================================
// Streak — Player Identity Management (Client-Side)
// ============================================================

import { api } from './api';

const STORAGE_KEY = 'streak_player_id';

export async function getOrCreatePlayerId(): Promise<string> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
  }

  const { player_id } = await api.createPlayer();

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, player_id);
  }

  return player_id;
}

export function clearStoredPlayerId(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function createFreshPlayerId(): Promise<string> {
  clearStoredPlayerId();
  const { player_id } = await api.createPlayer();
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, player_id);
  }
  return player_id;
}

export function getStoredPlayerId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}
