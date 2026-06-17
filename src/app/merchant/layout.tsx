// src/app/merchant/layout.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { useAuthStore } from '@/lib/store';
import { logout } from '@/lib/auth/logout';

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const { isReady } = useAuthGuard({ requiredRole: 'MERCHANT' });
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const navLinks = [
    { name: 'الرئيسية', href: '/merchant' },
    { name: 'إدارة المزارع', href: '/merchant/farms' },
    { name: 'إدارة المحاصيل', href: '/merchant/crops' },
  ];

  const displayName = user?.name || 'محمد علي إسماعيل';

  if (!isReady) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col" dir="rtl">
      {/* Desktop Header Navbar - hidden on mobile */}
      <header className="hidden md:block w-full bg-[#fdfcfa] border-b border-[#f0ebde]/45 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Right side: Logo & Branding */}
          <div className="flex items-center gap-4">
            <div className="relative h-10 w-10">
              <Image
                src="/images/onboard4.svg"
                alt="Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-bold text-[#265C38]">محاصيل</span>

            {/* Nav Links */}
            <nav className="flex items-center gap-6 mr-8">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/merchant' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-bold transition px-3 py-2 rounded-lg ${
                      isActive
                        ? 'text-[#265C38] bg-[#e8f1eb]'
                        : 'text-[#666666] hover:text-[#265C38] hover:bg-[#e8f1eb]/40'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Left side: Greeting, Avatar, Logout */}
          <div className="flex items-center gap-4">
            {/* Greeting */}
            <div className="text-right flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">مرحباً بك</span>
              <span className="text-sm font-bold text-[#111111]">{displayName}</span>
            </div>

            {/* Profile Avatar */}
            <Link
              href="/merchant/profile"
              className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100 block cursor-pointer transition transform hover:scale-105"
            >
              <Image src="/images/avatar.png" alt="Avatar" fill className="object-cover" />
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-[#d32f2f] hover:bg-[#ffebee] px-3.5 py-2 rounded-xl transition duration-150 border border-[#ffebee] cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <div className="flex-1 w-full flex flex-col">{children}</div>
    </div>
  );
}
