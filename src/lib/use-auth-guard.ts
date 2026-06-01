'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { agentLog } from '@/lib/agent-debug';
import { useAuthStore } from '@/lib/store';

export function useAuthGuard(redirectTo = '/login') {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    // #region agent log
    agentLog(
      'use-auth-guard.ts:effect',
      'auth_guard_state',
      { hasHydrated, hasToken: Boolean(token), redirectTo, willRedirect: hasHydrated && !token },
      'B'
    );
    // #endregion
    if (!hasHydrated) return;
    if (!token) {
      router.replace(redirectTo);
    }
  }, [hasHydrated, redirectTo, router, token]);

  return { hasHydrated, token, isReady: hasHydrated && Boolean(token) };
}
