'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useGuestGuard } from '@/lib/use-guest-guard';

export default function SplashPage() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated } = useGuestGuard();

  useEffect(() => {
    // Only set up the timer if store is hydrated and the user is NOT logged in
    if (!hasHydrated || isAuthenticated) return;

    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [hasHydrated, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#18181b] text-[#265C38]">
      <div className="relative flex animate-pulse flex-col items-center justify-center">
        <div className="relative h-48 w-64 overflow-hidden">
          {/* Replace src with the actual logo image path when available */}
          <Image
            src="/images/onboard4.svg"
            alt="Mahaseel Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>
      <div className="mt-8 flex items-center gap-2">
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#265C38] [animation-delay:-0.3s]"></div>
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#265C38] [animation-delay:-0.15s]"></div>
        <div className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#265C38]"></div>
      </div>
    </div>
  );
}
