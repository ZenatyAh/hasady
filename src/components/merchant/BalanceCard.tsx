// src/components/merchant/BalanceCard.tsx

import React from 'react';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  lastLogin?: string;
}

export function BalanceCard({ balance, currency = '₪', lastLogin }: BalanceCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-[2rem] bg-[#265C38] px-6 py-7 text-white shadow-xl shadow-[#265C38]/10"
      dir="rtl"
    >
      {/* Top Left Wavy SVG Pattern Accent */}
      <svg
        className="absolute top-0 left-0 h-24 w-24 text-white/10 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M-10 10 C20 10, 10 50, 50 40 C70 30, 80 10, 110 20"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M-10 25 C30 25, 20 65, 60 55 C80 45, 90 20, 110 35"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M-10 40 C40 40, 30 80, 70 70 C90 60, 100 30, 110 50"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Bottom Right Wavy SVG Pattern Accent */}
      <svg
        className="absolute bottom-0 right-0 h-28 w-28 text-white/10 pointer-events-none"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 110 C30 80, 55 90, 60 50 C65 20, 95 10, 110 -10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M35 110 C45 90, 70 100, 75 70 C80 40, 100 30, 110 10"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M50 110 C60 100, 85 110, 90 90 C95 70, 105 60, 110 30"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Card Content */}
      <div className="relative z-10 flex flex-col space-y-4">
        {/* Title */}
        <span className="text-sm font-medium text-white/80">الرصيد المتاح للسحب</span>

        {/* Balance Amount */}
        <div className="flex items-baseline justify-center py-2">
          <span className="text-4xl font-extrabold tracking-tight">{balance.toLocaleString()}</span>
          <span className="text-2xl font-bold mr-2">{currency}</span>
        </div>

        {/* Last Login Info */}
        {lastLogin && (
          <div className="flex items-center justify-start text-[11px] text-white/70">
            <span>آخر تسجيل دخول:</span>
            <span className="mr-1.5 font-mono">{lastLogin}</span>
          </div>
        )}
      </div>
    </div>
  );
}
