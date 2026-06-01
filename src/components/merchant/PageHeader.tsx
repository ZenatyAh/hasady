// src/components/merchant/PageHeader.tsx

import React from 'react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
  title: string;
  backHref?: string;
}

export function PageHeader({ title, backHref }: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  return (
    <header className="relative flex items-center justify-between py-4" dir="rtl">
      {/* Title */}
      <h1 className="flex-1 text-center text-lg font-bold text-[#111111] pr-12">{title}</h1>

      {/* Back Button (Green Box with Right Arrow) */}
      <button
        type="button"
        onClick={handleBack}
        className="absolute right-0 flex h-10 w-10 items-center justify-center rounded-xl bg-[#265C38] transition hover:bg-[#1f4f2c] focus:outline-none focus:ring-2 focus:ring-[#97cda6]"
        aria-label="رجوع"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 5L16 12L9 19"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </header>
  );
}
