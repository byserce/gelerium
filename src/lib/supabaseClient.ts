'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton Supabase client instance
let supabase: SupabaseClient | null = null;

export const getSupabase = () => {
  if (supabase) {
    return supabase;
  }
  
  // This code will only run on the client side
  if (typeof window !== 'undefined') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
    }

    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    });

    return supabase;
  }
  
  // On the server side, return null or a mock client if needed,
  // but for build purposes, returning null/undefined behavior is key
  // to avoid trying to use environment variables that aren't there.
  return null;
};

// For components that still rely on a direct export,
// we can export a function that gets the client.
// However, it's better to update them to use getSupabase().
export const supabaseClient = getSupabase();
