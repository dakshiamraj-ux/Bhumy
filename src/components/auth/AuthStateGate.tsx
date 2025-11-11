'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppRouter } from 'next/dist/client/components/app-router';

// Routes that are accessible without authentication
const PUBLIC_ROUTES = ['/login'];

export function AuthStateGate({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is determined
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (user && isPublicRoute) {
      // If user is logged in and tries to access a public route (like login), redirect to dashboard
      router.replace('/');
    } else if (!user && !isPublicRoute) {
      // If user is not logged in and tries to access a protected route, redirect to login
      router.replace('/login');
    }
  }, [user, isUserLoading, router, pathname]);

  if (isUserLoading) {
    // You can render a global loading spinner here if desired
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Prevent rendering of pages during redirection
  const isPublic = PUBLIC_ROUTES.includes(pathname);
  if ((user && isPublic) || (!user && !isPublic)) {
    return (
       <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
