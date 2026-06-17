'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type AuthRole } from '@/lib/store';

type UseAuthGuardOptions = {
  redirectTo?: string;
  requiredRole?: AuthRole;
};

function getRoleHome(role: AuthRole | undefined) {
  if (role === 'BUYER') return '/customer';
  if (role === 'ADMIN') return '/merchant';
  return '/merchant';
}

export function useAuthGuard(options: UseAuthGuardOptions | string = {}) {
  const { redirectTo = '/login', requiredRole } =
    typeof options === 'string' ? { redirectTo: options, requiredRole: undefined } : options;
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const sessionStatus = useAuthStore((state) => state.sessionStatus);
  const isSessionReady = sessionStatus !== 'restoring';
  const isAuthenticated = Boolean(accessToken && user);
  const hasRequiredRole =
    !requiredRole ||
    user?.role === requiredRole ||
    (requiredRole === 'MERCHANT' && user?.role === 'ADMIN');

  useEffect(() => {
    if (!hasHydrated || !isSessionReady) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (!hasRequiredRole) {
      router.replace(user?.role ? getRoleHome(user.role) : redirectTo);
    }
  }, [
    hasHydrated,
    hasRequiredRole,
    isAuthenticated,
    isSessionReady,
    redirectTo,
    router,
    user?.role,
  ]);

  return {
    hasHydrated,
    token: accessToken,
    accessToken,
    user,
    isAuthenticated,
    isSessionReady,
    isReady: hasHydrated && isSessionReady && isAuthenticated && hasRequiredRole,
  };
}
