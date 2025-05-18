"use client"

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase'
import { Book } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function Dashboard() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [loadingBooks, setLoadingBooks] = useState(true)
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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signup')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchBooks()
    }
  }, [user, fetchBooks])

  if (loading) {
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