'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type AuthRole } from '@/lib/store';

type UseAuthGuardOptions = {
  redirectTo?: string;
  requiredRole?: AuthRole;
};

function getRoleHome(role: AuthRole | undefined) {
  return role === 'BUYER' ? '/customer' : '/merchant';
}

export function useAuthGuard(options: UseAuthGuardOptions | string = {}) {
  const { redirectTo = '/login', requiredRole } =
    typeof options === 'string' ? { redirectTo: options, requiredRole: undefined } : options;
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = Boolean(user);
  const hasRequiredRole = !requiredRole || user?.role === requiredRole;

  useEffect(() => {
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (!hasRequiredRole) {
      router.replace(user?.role ? getRoleHome(user.role) : redirectTo);
    }
  }, [hasHydrated, hasRequiredRole, isAuthenticated, redirectTo, router, user?.role]);

  return {
    hasHydrated,
    token,
    user,
    isAuthenticated,
    isReady: hasHydrated && isAuthenticated && hasRequiredRole,
  };
}
