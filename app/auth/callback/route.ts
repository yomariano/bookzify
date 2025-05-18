import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import type { CookieOptions } from '@supabase/ssr' // This line seems to be causing issues with CookieOptions below, let's see if it's needed. It might be re-declared by createServerClient or NextRequest

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Auth callback triggered. URL:', request.url)
  console.log('Auth code present:', !!code)

  if (code) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieStore = cookies() as any; // Type assertion to any as a temporary workaround

    console.log('Creating Supabase client for code exchange...')
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set(name, value, options)
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete(name, options)
          },
        },
      }
    )

    console.log('Exchanging code for session...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      console.log('Session exchange successful, redirecting to dashboard')
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    }
    
    console.error('Session exchange error:', error)
  }

  console.log('Auth callback failed, redirecting to error page')
  return NextResponse.redirect(`${requestUrl.origin}/auth-error`)
} 