'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<any>;
  signOut: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) {
        setLoading(false);
        return;
    };

    const getSession = async () => {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error("Error getting session:", error.message);
        }
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    user,
    session,
    loading,
    signIn: (email: string, pass: string) => {
      if (!supabase) throw new Error("Supabase client is not available");
      return supabase.auth.signInWithPassword({ email, password: pass })
    },
    signOut: () => {
      if (!supabase) throw new Error("Supabase client is not available");
      return supabase.auth.signOut()
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
