"use client"

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Book } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)
  const supabase = createClient()

  const fetchBooks = useCallback(async () => {
    if (!user) return
    
    try {
      setLoadingBooks(true)
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBooks(data || [])
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoadingBooks(false)
    }
  }, [supabase, user])

  // Redirect if not authenticated
  useEffect(() => {
    debugger
    if (!loading && !user) {
      router.push('/signup')
    }
  }, [user, loading, router])

  // Fetch books once user is confirmed
  useEffect(() => {
    if (user) {
      fetchBooks()
    }
  }, [user, fetchBooks])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (!user) return null

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <header className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {profile?.avatar_url && (
                <div className="h-12 w-12 rounded-full overflow-hidden relative">
                  <Image
                    src={profile.avatar_url}
                    alt={profile.full_name || ''}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold">Welcome, {profile?.full_name || user.email}</h1>
                <p className="text-muted-foreground">{profile?.email || user.email}</p>
              </div>
            </div>
            <Button onClick={signOut} variant="outline">Sign Out</Button>
          </div>
        </header>

        <section>
          <h2 className="text-xl font-semibold mb-4">Your Library</h2>
          {loadingBooks ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="aspect-[3/4] w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : books.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No books found</h3>
              <p className="text-muted-foreground mb-4">Start adding some books to your library</p>
              <Button onClick={() => router.push('/library')}>Browse Library</Button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="truncate">{book.name}</CardTitle>
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
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-36" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="aspect-[3/4] w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}