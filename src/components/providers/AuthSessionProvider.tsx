'use client';

import { useRestoreSession } from '@/lib/use-restore-session';

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  useRestoreSession();
  return <>{children}</>;
}
