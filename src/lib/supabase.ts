// ============================================================
// Streak — Supabase Admin Client (Server-Side Only)
// ============================================================
// This client uses the SERVICE_ROLE_KEY which bypasses RLS.
// It must NEVER be imported by client components.
// Only API route handlers and server-side modules use this.
//
// Uses lazy initialization to avoid crashing at build time
// when environment variables aren't set yet (e.g., during
// Next.js static analysis or CI builds).
// ============================================================

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

/**
 * Returns the Supabase admin client, creating it on first use.
 * Throws at call time (not import time) if env vars are missing.
 */
function getSupabaseClient(): SupabaseClient {
  if (_supabase) return _supabase;

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. ' +
      'Copy .env.example to .env.local and fill in your Supabase credentials.'
    );
  }

  _supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _supabase;
}

// Export as a getter so it's lazy-initialized
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getSupabaseClient();
    const value = client[prop as keyof SupabaseClient];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});
