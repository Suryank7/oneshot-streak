// ============================================================
// Streak — Player Identity Management (Client-Side)
// ============================================================

import { api } from './api';

const STORAGE_KEY = 'streak_player_id';
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getOrCreatePlayerId(): Promise<string> {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Only return stored if it's a valid UUID
    if (stored && UUID_REGEX.test(stored)) {
      return stored;
    }
    // Remove invalid/stale non-UUID strings like "random987654321"
    if (stored) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  const { player_id } = await api.createPlayer();

  if (typeof window !== 'undefined' && UUID_REGEX.test(player_id)) {
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
  if (typeof window !== 'undefined' && UUID_REGEX.test(player_id)) {
    localStorage.setItem(STORAGE_KEY, player_id);
  }
  return player_id;
}

export function getStoredPlayerId(): string | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && UUID_REGEX.test(stored)) {
    return stored;
  }
  return null;
}
