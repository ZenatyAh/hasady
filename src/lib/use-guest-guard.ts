'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export function useGuestGuard() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    if (!hasHydrated || !isAuthenticated) return;

    const target = user?.role === 'BUYER' ? '/customer' : '/merchant';
    router.replace(target);
  }, [hasHydrated, isAuthenticated, router, user?.role]);

  return { hasHydrated, token, user, isAuthenticated, isReady: hasHydrated && !isAuthenticated };
}
