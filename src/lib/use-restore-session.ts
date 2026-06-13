'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { getMe } from '@/services/api/users';
import { apiUserToUser } from '@/lib/mappers/user';

export function useRestoreSession() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

  useEffect(() => {
    if (!hasHydrated || !accessToken) return;
    if (user) return;

    let cancelled = false;

    getMe(accessToken)
      .then((apiUser) => {
        if (cancelled) return;
        setAuthSession({ accessToken, refreshToken: refreshToken ?? '' }, apiUserToUser(apiUser));
      })
      .catch(() => {
        if (!cancelled) clearAuthSession();
      });

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, accessToken, user, refreshToken, setAuthSession, clearAuthSession]);

  useEffect(() => {
    const onUnauthorized = () => {
      clearAuthSession();
      router.replace('/login');
    };

    window.addEventListener('mahaseel:unauthorized', onUnauthorized);
    return () => window.removeEventListener('mahaseel:unauthorized', onUnauthorized);
  }, [clearAuthSession, router]);
}
