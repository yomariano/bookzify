import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local file.')
}

export async function middleware(req: NextRequest) {
  console.log('Middleware executing for path:', req.nextUrl.pathname)
  
  const res = NextResponse.next()
  
  // Type assertion is safe here because we checked above
  const supabase = createServerClient(
    supabaseUrl as string,
    supabaseKey as string,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('Session check result:', {
    hasSession: !!session,
    path: req.nextUrl.pathname,
    isProtectedRoute: req.nextUrl.pathname.startsWith('/dashboard'),
    isAuthPage: req.nextUrl.pathname === '/signup' || req.nextUrl.pathname === '/login'
  })

  // If there's no session and the user is trying to access a protected route
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    console.log('No session, redirecting to signup')
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/signup'
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and the user is trying to access auth pages
  if (session && (req.nextUrl.pathname === '/signup' || req.nextUrl.pathname === '/login')) {
    console.log('Session exists, redirecting to dashboard')
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/dashboard'
    return NextResponse.redirect(redirectUrl)
  }

  console.log('Middleware completed, proceeding with request')
  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/signup', '/login']
} 