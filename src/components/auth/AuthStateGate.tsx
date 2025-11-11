'use client';

import { useUser, useFirestore } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { User } from 'firebase/auth';

// Routes that are accessible without authentication
const PUBLIC_ROUTES = ['/login'];

// Function to create a user profile if it doesn't exist
const createUserProfileIfNeeded = async (firestore: any, user: User) => {
  if (!firestore || !user) return;

  const userRef = doc(firestore, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Document doesn't exist, so create it
    const newUserProfile = {
      id: user.uid,
      email: user.email || '',
      username: user.displayName || user.email?.split('@')[0] || 'New User',
      joinDate: serverTimestamp(),
      ecoPoints: 0,
    };
    // Use the non-blocking write function
    setDocumentNonBlocking(userRef, newUserProfile, { merge: false });
  }
};


export function AuthStateGate({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isUserLoading) {
      return; // Wait until user status is determined
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    if (user) {
        // Create user profile in Firestore if it's their first time.
        createUserProfileIfNeeded(firestore, user);
        if (isPublicRoute) {
            // If user is logged in and tries to access a public route (like login), redirect to dashboard
            router.replace('/');
        }
    } else if (!isPublicRoute) {
      // If user is not logged in and tries to access a protected route, redirect to login
      router.replace('/login');
    }
  }, [user, isUserLoading, router, pathname, firestore]);

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
