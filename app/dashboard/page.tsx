"use client"

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Book } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

function DashboardPageContent() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams() // Get query params (e.g., code)
  const [books, setBooks] = useState<Book[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [sessionLoading, setSessionLoading] = useState(true) // Track session retrieval
  const supabase = createClient()

  const fetchBooks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setBooks(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoadingBooks(false)
    }
  }, [supabase])

  // Handle OAuth callback and session retrieval
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const code = searchParams.get('code')
      if (code) {
        console.log('OAuth code detected:', code)
        try {
          // Wait for Supabase to exchange the code and set the session
          const { data, error } = await supabase.auth.getSession()
          if (error) {
            console.error('Error getting session:', error.message)
            router.push('/signup')
            return
          }
          if (!data.session) {
            console.log('No session set after OAuth callback')
            router.push('/signup')
          }
        } catch (error) {
          console.error('Error during OAuth callback:', error)
          router.push('/signup')
        }
      }
      setSessionLoading(false) // Done checking session
    }

    handleOAuthCallback()
  }, [searchParams, router, supabase])

  // Redirect if not authenticated (after session check)
  useEffect(() => {
    if (!sessionLoading && !loading && !user) {
      console.log('No user found, redirecting to signup')
      router.push('/signup')
    }
  }, [user, loading, sessionLoading, router])

  // Fetch books once user is confirmed
  useEffect(() => {
    if (user) {
      fetchBooks()
    }
  }, [user, fetchBooks])

  if (loading || sessionLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {profile?.avatar_url && (
              <Image
                src={profile.avatar_url}
                alt={profile.full_name || ''}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">Welcome, {profile?.full_name}</h1>
              <p className="text-muted-foreground">{profile?.email}</p>
            </div>
          </div>
          <Button onClick={signOut}>Sign Out</Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loadingBooks ? (
            <p>Loading books...</p>
          ) : books.length === 0 ? (
            <p>No books found. Start adding some!</p>
          ) : (
            books.map((book) => (
              <Card key={book.id}>
                <CardHeader>
                  <CardTitle>{book.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-[3/4] relative rounded-md overflow-hidden">
                    <Image
                      src={book.url}
                      alt={book.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <DashboardPageContent />
    </Suspense>
  )
}