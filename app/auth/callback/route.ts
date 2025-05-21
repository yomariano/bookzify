import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/'; // Default redirect to home

  if (code) {
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(new URL(next, request.url).toString());
      }
      console.error('[AuthCallback][Error] Error exchanging code for session:', error);
    } catch (e) {
      console.error('[AuthCallback][Error] Exception during code exchange:', e);
    }
  }

  // Fallback redirect to an error page or home if code exchange fails or no code is present
  const errorUrl = new URL('/auth/error', request.url);
  errorUrl.searchParams.set('message', 'Authentication failed during callback.');
  return NextResponse.redirect(errorUrl.toString());
} 