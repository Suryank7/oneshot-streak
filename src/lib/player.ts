// ============================================================
// Streak — Player Identity Management (Client-Side)
// ============================================================
// Manages anonymous player ID in localStorage.
// Creates a new player via API on first visit.
// ============================================================

import { api } from './api';

const STORAGE_KEY = 'streak_player_id';

/**
 * Gets or creates a player ID.
 * - First checks localStorage for an existing ID
 * - If none exists, calls POST /api/player to create one
 * - Stores the new ID in localStorage
 */
export async function getOrCreatePlayerId(): Promise<string> {
  // Check localStorage first
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return stored;
    }
  }

  // No stored ID — create a new player
  const { player_id } = await api.createPlayer();

  // Persist to localStorage
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, player_id);
  }

  return player_id;
}

/**
 * Returns the stored player ID without creating one.
 */
export function getStoredPlayerId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
}
