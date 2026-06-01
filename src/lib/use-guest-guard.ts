'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export function useGuestGuard(redirectTo = '/merchant') {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!hasHydrated) return;
    if (token) {
      const target = user?.role === 'BUYER' ? '/customer' : '/merchant';
      router.replace(target);
    }
  }, [hasHydrated, redirectTo, router, token, user]);

  return { hasHydrated, token, isReady: hasHydrated && !token };
}
