'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCheck({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      // Redirect to home if not signed in
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Show nothing while loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-text-secondary">Loading...</div>
      </div>
    );
  }

  // Show nothing if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  // Show children if authenticated
  return <>{children}</>;
}