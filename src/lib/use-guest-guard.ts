'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export function useGuestGuard() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = Boolean(accessToken && user);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) return;

    const target = user?.role === 'BUYER' ? '/customer' : '/merchant';
    router.replace(target);
  }, [hasHydrated, isAuthenticated, router, user?.role]);

  return {
    hasHydrated,
    token: accessToken,
    accessToken,
    user,
    isAuthenticated,
    isReady: hasHydrated && !isAuthenticated,
  };
}
