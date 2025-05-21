'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthContextType, AuthState } from '@/types/auth';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'; // Import Session and AuthChangeEvent

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    let isEffectActive = true;

    const checkSession = async () => {
      try {
        // Type annotation for the destructured session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isEffectActive) return;

        if (error) {
          console.error('[AuthProvider][Error] Error getting session:', {
            errorMessage: error.message,
            // errorCode: error.code, // .code might not exist on all error types
            // errorStatus: error.status, // .status might not exist on all error types
            stack: error.stack
          });
          throw error;
        }

        setState((prev) => ({
          ...prev,
          user: session?.user ?? null, // Ensure user is explicitly null if session.user is undefined
          session,
          isLoading: false,
        }));
      } catch (error) {
        console.error('[AuthProvider][Error] Session check failed:', {
          error,
          timestamp: new Date().toISOString()
        });
        
        if (!isEffectActive) return;
        
        setState((prev) => ({
          ...prev,
          error: error as Error,
          isLoading: false,
        }));
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      // Add types for _event and session
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!isEffectActive) return;
        setState((prev) => ({
          ...prev,
          user: session?.user ?? null, // Ensure user is explicitly null if session.user is undefined
          session,
          isLoading: false,
        }));
      }
    );

    return () => {
      isEffectActive = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('[AuthProvider][Error] Google sign-in error:', {
          errorMessage: error.message,
          // errorCode: error.code,
          // errorStatus: error.status,
          stack: error.stack
        });
        throw error;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('[AuthProvider][Error] Sign-in failed:', {
        error,
        timestamp: new Date().toISOString()
      });

      setState((prev) => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
    }
  };

  const signOut = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[AuthProvider][Error] Sign-out error:', {
          errorMessage: error.message,
          // errorCode: error.code,
          // errorStatus: error.status,
          stack: error.stack
        });
        throw error;
      }
      // Reset state after sign out
      setState(initialState);
      // Optionally redirect or update UI further
    } catch (error) {
      console.error('[AuthProvider][Error] Sign-out failed:', {
        error,
        timestamp: new Date().toISOString()
      });

      setState((prev) => ({
        ...prev,
        error: error as Error,
        isLoading: false,
      }));
    }
  };

  const value = {
    ...state,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('[AuthProvider][Error] Hook used outside of AuthProvider context');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 