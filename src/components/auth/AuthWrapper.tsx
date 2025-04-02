// File path: /components/auth/AuthWrapper.tsx

'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

// List of paths that don't require authentication
const publicPaths = ['/', '/sign-in', '/sign-up'];

interface AuthWrapperProps {
  children: ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = publicPaths.includes(pathname);

  useEffect(() => {
    if (isLoaded) {
      // If user is not signed in and the route requires authentication
      if (!userId && !isPublicPath) {
        router.push('/sign-in');
      }
      
      // If user is signed in and trying to access auth pages
      if (userId && (pathname === '/sign-in' || pathname === '/sign-up')) {
        router.push('/home');
      }
    }
  }, [isLoaded, userId, router, pathname, isPublicPath]);

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-photo-indigo"></div>
      </div>
    );
  }

  return <>{children}</>;
}