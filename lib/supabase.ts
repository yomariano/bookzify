import { createBrowserClient } from '@supabase/ssr'
import { createClient as createClientServer } from '@supabase/supabase-js'
import { Database } from './database.types'

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local file.')
}

// Browser client for client components
export const createClient = () => {
  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        autoRefreshToken: true,
      },
    }
  )
}

// Server client for server components and API routes
export const createServerClient = () => {
  return createClientServer<Database>(
    supabaseUrl,
    supabaseKey,
    {
      auth: {
        persistSession: false,
      },
    }
  )
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Book = Database['public']['Tables']['books']['Row'] 