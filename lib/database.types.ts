export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          avatar_url?: string
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          avatar_url?: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          avatar_url?: string
        }
      }
      books: {
        Row: {
          id: string
          created_at?: string
          updated_at?: string
          name: string
          url: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          url: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          url?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 