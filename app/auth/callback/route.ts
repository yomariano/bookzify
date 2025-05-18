import { createServerClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest): Promise<NextResponse> => {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = createServerClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      // Redirect to login page with error
      return NextResponse.redirect(
        new URL(`/signup?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }

    // On successful authentication, redirect to the dashboard
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  // No code available, redirect to login
  return NextResponse.redirect(new URL('/signup', requestUrl.origin))
} 