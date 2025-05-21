'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorMessage = searchParams.get('message') || 'An unexpected error occurred during authentication.';

  useEffect(() => {
    // Optional: redirect after a delay if needed, or let user click a button
    // const timer = setTimeout(() => {
    //   router.push('/');
    // }, 5000);
    // return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="p-8 bg-card rounded-lg shadow-md text-center max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-destructive mb-4">Authentication Error</h1>
        <p className="text-muted-foreground mb-6">{errorMessage}</p>
        <Button onClick={() => router.push('/')} variant="outline">
          Go to Homepage
        </Button>
      </div>
    </div>
  );
} 