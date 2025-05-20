import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

// Define public routes that don't require authentication
const publicRoutes = [
  '/signup',
  '/auth/callback',
  '/auth/v1/callback'  // Add Supabase's auth callback path
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }
  
  // For API routes, let them handle their own auth
  if (pathname.includes('/api/')) {
    return NextResponse.next()
  }

  // Create a Supabase client
  const supabase = createServerClient()
  
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession()
    
    // If no session and trying to access a protected route, redirect to signup
    if (!session) {
      const redirectUrl = new URL('/signup', request.url)
      // Preserve the original URL as a parameter to redirect back after auth
      redirectUrl.searchParams.set('redirectTo', request.url)
      return NextResponse.redirect(redirectUrl)
    }
    
    return NextResponse.next()
  } catch (error) {
    // If there's an error checking the session, redirect to signup as a fallback
    console.error('Auth middleware error:', error)
    return NextResponse.redirect(new URL('/signup', request.url))
  }
}

// Specify which paths this middleware should run for
export const config = {
  matcher: [
    // Match all request paths except for _next, static, public, and api/auth
    '/((?!_next|static|public|favicon.ico).*)',
  ],
} 