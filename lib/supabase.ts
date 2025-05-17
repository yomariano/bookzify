import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types'

// Ensure environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Check .env.local file.')
}

export const createClient = () => {
  // Type assertion is safe here because we checked above
  return createBrowserClient<Database>(
    supabaseUrl as string,
    supabaseKey as string
  )
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Book = Database['public']['Tables']['books']['Row'] 