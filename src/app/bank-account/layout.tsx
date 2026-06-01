'use client';

import { useAuthGuard } from '@/lib/use-auth-guard';

export default function BankAccountLayout({ children }: { children: React.ReactNode }) {
  const { isReady } = useAuthGuard();

  if (!isReady) {
    return null;
  }

  return children;
}
