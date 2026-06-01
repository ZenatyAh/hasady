// src/components/merchant/QuickAccessCard.tsx

import React from 'react';
import Link from 'next/link';

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function QuickAccessCard({ title, description, href, icon }: QuickAccessCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center justify-start rounded-[1.5rem] bg-white p-4 text-center border border-[#f0ebde] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#265C38]/30 hover:shadow-md active:translate-y-0"
      dir="rtl"
    >
      {/* Icon Container */}
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f2ec] text-[#265C38] transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      {/* Title */}
      <h3 className="mt-4 text-sm font-bold text-[#111111] transition-colors group-hover:text-[#265C38]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-[#888888] line-clamp-2">
        {description}
      </p>
    </Link>
  );
}
