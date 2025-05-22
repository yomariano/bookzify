"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContextType, AuthState } from '../types/auth';

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log('[AuthProvider][Init] Component mounting with initial state:', JSON.stringify(initialState, null, 2));
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    console.log('[AuthProvider][Effect] Auth effect starting, setting up listeners and checking session');
    let isEffectActive = true; // For cleanup tracking

    // Check for active session on mount
    const checkSession = async () => {
      console.log('[AuthProvider][Session] Beginning session check');
      console.log('[AuthProvider][Session] Current state before check:', JSON.stringify(state, null, 2));
      
      try {
        console.log('[AuthProvider][Session] Calling supabase.auth.getSession()');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isEffectActive) {
          console.log('[AuthProvider][Session] Effect cleanup occurred during session check, aborting');
          return;
        }

        if (error) {
          console.error('[AuthProvider][Session] Error getting session:', {
            errorMessage: error.message,
            errorCode: error.code,
            errorStatus: error.status,
            stack: error.stack
          });
          throw error;
        }
        
        const sessionDetails = session ? {
          userId: session.user?.id,
          userEmail: session.user?.email,
          expiresAt: session.expires_at,
          providerToken: !!session.provider_token,
          accessToken: !!session.access_token,
        } : null;

        console.log('[AuthProvider][Session] Session check complete:', {
          hasSession: !!session,
          sessionDetails,
          timestamp: new Date().toISOString(),
        });

        setState((prev) => {
          const newState = {
            ...prev,
            user: session?.user || null,
            session,
            isLoading: false,
          };
          console.log('[AuthProvider][State] Updating state after session check:', {
            prevState: JSON.stringify(prev, null, 2),
            newState: JSON.stringify(newState, null, 2),
            changes: {
              userChanged: prev.user?.id !== newState.user?.id,
              sessionChanged: prev.session?.access_token !== newState.session?.access_token,
              loadingChanged: prev.isLoading !== newState.isLoading,
            }
          });
          return newState;
        });
      } catch (error) {
        console.error('[AuthProvider][Session] Session check failed:', {
          error,
          timestamp: new Date().toISOString(),
          currentState: JSON.stringify(state, null, 2)
        });
        
        if (!isEffectActive) return;
        
        setState((prev) => {
          const newState = {
            ...prev,
            error: error as Error,
            isLoading: false,
          };
          console.log('[AuthProvider][State] Updating state after session error:', {
            prevState: JSON.stringify(prev, null, 2),
            newState: JSON.stringify(newState, null, 2)
          });
          return newState;
        });
      }
    };

    checkSession();

    // Set up listener for auth changes
    console.log('[AuthProvider][Listener] Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AuthProvider][Auth Event]', {
          event,
          timestamp: new Date().toISOString(),
          sessionDetails: session ? {
            userId: session.user?.id,
            userEmail: session.user?.email,
            expiresAt: session.expires_at,
            providerToken: !!session.provider_token,
            accessToken: !!session.access_token,
          } : null
        });

        setState((prev) => {
          const newState = {
            ...prev,
            user: session?.user || null,
            session,
            isLoading: false,
          };
          console.log('[AuthProvider][State] State update from auth event:', {
            event,
            prevState: JSON.stringify(prev, null, 2),
            newState: JSON.stringify(newState, null, 2),
            changes: {
              userChanged: prev.user?.id !== newState.user?.id,
              sessionChanged: prev.session?.access_token !== newState.session?.access_token,
              loadingChanged: prev.isLoading !== newState.isLoading,
            }
          });
          return newState;
        });
      }
    );

    return () => {
      console.log('[AuthProvider][Cleanup] Starting effect cleanup');
      isEffectActive = false;
      console.log('[AuthProvider][Cleanup] Unsubscribing from auth state changes');
      subscription.unsubscribe();
      console.log('[AuthProvider][Cleanup] Cleanup complete');
    };
  }, []);

  const signInWithGoogle = async () => {
    console.log('[AuthProvider][Google Sign-in] Initiating sign-in process');
    console.log('[AuthProvider][Google Sign-in] Current state:', JSON.stringify(state, null, 2));
    
    setState((prev) => {
      const newState = { ...prev, isLoading: true, error: null };
      console.log('[AuthProvider][State] Updating state for sign-in start:', {
        prevState: JSON.stringify(prev, null, 2),
        newState: JSON.stringify(newState, null, 2)
      });
      return newState;
    });

    try {
      console.log('[AuthProvider][Google Sign-in] Calling supabase.auth.signInWithOAuth');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://bookzify.xyz/auth/callback', // Change this line
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('[AuthProvider][Google Sign-in] OAuth error:', {
          errorMessage: error.message,
          errorCode: error.code,
          errorStatus: error.status,
          stack: error.stack
        });
        throw error;
      }

      console.log('[AuthProvider][Google Sign-in] Sign-in successful:', {
        hasUrl: !!data.url,
        redirectUrl: data.url,
        timestamp: new Date().toISOString()
      });

      if (data.url) {
        console.log('[AuthProvider][Google Sign-in] Redirecting to:', data.url);
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('[AuthProvider][Google Sign-in] Sign-in failed:', {
        error,
        timestamp: new Date().toISOString(),
        currentState: JSON.stringify(state, null, 2)
      });

      setState((prev) => {
        const newState = {
          ...prev,
          error: error as Error,
          isLoading: false,
        };
        console.log('[AuthProvider][State] Updating state after sign-in error:', {
          prevState: JSON.stringify(prev, null, 2),
          newState: JSON.stringify(newState, null, 2)
        });
        return newState;
      });
    }
  };

  const signOut = async () => {
    console.log('[AuthProvider][Sign-out] Initiating sign-out process');
    console.log('[AuthProvider][Sign-out] Current state:', JSON.stringify(state, null, 2));
    
    setState((prev) => {
      const newState = { ...prev, isLoading: true, error: null };
      console.log('[AuthProvider][State] Updating state for sign-out start:', {
        prevState: JSON.stringify(prev, null, 2),
        newState: JSON.stringify(newState, null, 2)
      });
      return newState;
    });

    try {
      console.log('[AuthProvider][Sign-out] Calling supabase.auth.signOut');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('[AuthProvider][Sign-out] Error:', {
          errorMessage: error.message,
          errorCode: error.code,
          errorStatus: error.status,
          stack: error.stack
        });
        throw error;
      }
      
      console.log('[AuthProvider][Sign-out] Sign-out successful', {
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[AuthProvider][Sign-out] Sign-out failed:', {
        error,
        timestamp: new Date().toISOString(),
        currentState: JSON.stringify(state, null, 2)
      });

      setState((prev) => {
        const newState = {
          ...prev,
          error: error as Error,
          isLoading: false,
        };
        console.log('[AuthProvider][State] Updating state after sign-out error:', {
          prevState: JSON.stringify(prev, null, 2),
          newState: JSON.stringify(newState, null, 2)
        });
        return newState;
      });
    }
  };

  const value = {
    ...state,
    signInWithGoogle,
    signOut,
  };

  console.log('[AuthProvider][Render] Rendering with context value:', {
    hasUser: !!value.user,
    hasSession: !!value.session,
    isLoading: value.isLoading,
    hasError: !!value.error,
    timestamp: new Date().toISOString()
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  console.log('[useAuth] Hook called');
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('[useAuth] Hook used outside of AuthProvider context', {
      timestamp: new Date().toISOString(),
      stack: new Error().stack
    });
    throw new Error('useAuth must be used within an AuthProvider');
  }
  console.log('[useAuth] Returning context:', {
    hasUser: !!context.user,
    hasSession: !!context.session,
    isLoading: context.isLoading,
    hasError: !!context.error,
    timestamp: new Date().toISOString()
  });
  return context;
};