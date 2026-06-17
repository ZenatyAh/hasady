'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import type { AuthRole } from '@/lib/store';

function getRoleHome(role: AuthRole | undefined) {
  if (role === 'BUYER') return '/customer';
  if (role === 'ADMIN') return '/merchant';
  return '/merchant';
}

export function useGuestGuard() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const sessionStatus = useAuthStore((state) => state.sessionStatus);
  const isSessionReady = sessionStatus !== 'restoring';
  const isAuthenticated = Boolean(accessToken && user);

  useEffect(() => {
    if (!hasHydrated || !isSessionReady || !isAuthenticated) return;

    router.replace(getRoleHome(user?.role));
  }, [hasHydrated, isAuthenticated, isSessionReady, router, user?.role]);

  return {
    hasHydrated,
    token: accessToken,
    accessToken,
    user,
    isAuthenticated,
    isSessionReady,
    isReady: hasHydrated && isSessionReady && !isAuthenticated,
  };
}
