// src/components/merchant/DashboardHeader.tsx

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface DashboardHeaderProps {
  userName: string;
  avatarUrl?: string;
}

export function DashboardHeader({
  userName,
  avatarUrl = '/images/avatar.png',
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4" dir="rtl">
      {/* User Information */}
      <div className="flex flex-col text-right">
        <span className="text-xs text-[#8c9c90] font-medium mb-0.5">صباح الخير</span>
        <h1 className="text-xl font-bold text-[#111111]">{userName}</h1>
      </div>

      {/* User Avatar */}
      <Link
        href="/merchant/profile"
        className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-md ring-1 ring-[#265C38]/10 block cursor-pointer transition transform hover:scale-105"
      >
        <Image src={avatarUrl} alt={userName} fill className="object-cover" priority />
      </Link>
    </header>
  );
}
