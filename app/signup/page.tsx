"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { createClient } from '@/lib/supabase'
// import { useRouter } from 'next/navigation' // Removed unused import
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { FcGoogle } from 'react-icons/fc'
import { useAuth } from '@/lib/auth-context' // Corrected import path

export default function SignUp() {
  // const router = useRouter() // Original line, router is unused
  useAuth() // Calling useAuth() to see if it's needed, removed unused destructuring
  const [loading, setLoading] = useState(false) // Reinstated local loading state
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign-in process...')
      setLoading(true)

      const redirectToUrl = `${window.location.origin}/dashboard`;
      console.log('Attempting to redirect to:', redirectToUrl); // Log the URL

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectToUrl, // Use the logged variable
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error('Google sign-in error:', error)
        throw error
      }
      console.log('Google sign-in initiated successfully')
    } catch (error) {
      console.error('Error signing in with Google:', error)
    } finally {
      console.log('Google sign-in flow completed. Redirect URL:', `${window.location.origin}/dashboard`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
          <CardDescription>
            Get started with BookHub today
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  )
} 