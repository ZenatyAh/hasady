'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to welcome page after 2.5 seconds
    const timer = setTimeout(() => {
      router.push('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#18181b] text-[#265C38]">
      <div className="relative flex animate-pulse flex-col items-center justify-center">
        <div className="relative h-48 w-64 overflow-hidden">
          {/* Replace src with the actual logo image path when available */}
          <Image
            src="/images/logo.png"
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
