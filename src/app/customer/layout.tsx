// src/app/customer/layout.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';

// ─── SVG Navigation Icons ───────────────────────────────────────────────────

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  );
}

function OrdersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.48 3.499c.173-.434.762-.434.935 0l1.861 4.67 4.908.232c.474.022.663.606.319.923l-3.774 3.486 1.09 4.88c.105.47-.394.832-.801.564L12 15.61l-4.288 2.525c-.407.268-.906-.094-.801-.564l1.09-4.88-3.774-3.486c-.344-.317-.155-.901.319-.923l4.908-.232 1.861-4.67z"
      />
    </svg>
  );
}

function ProfileIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
      />
    </svg>
  );
}

// ─── Layout Component ────────────────────────────────────────────────────────

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { isReady } = useAuthGuard({ requiredRole: 'BUYER' });
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  if (!isReady) {
    return null;
  }

  const navLinks = [
    { name: 'الرئيسية', href: '/customer', icon: HomeIcon },
    { name: 'طلباتي', href: '/customer/orders', icon: OrdersIcon },
    { name: 'المحفظة', href: '/customer/wallet', icon: WalletIcon },
    { name: 'التقييمات', href: '/customer/reviews', icon: StarIcon },
  ];

  const displayName = user?.name || 'مشتري محاصيل';

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col pb-16 md:pb-0" dir="rtl">
      {/* ── Desktop Header Navbar ── */}
      <header className="hidden md:block w-full bg-[#fdfcfa] border-b border-[#f0ebde]/45 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
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

            <nav className="flex items-center gap-6 mr-8">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== '/customer' && pathname.startsWith(link.href));
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-bold transition px-3 py-2 rounded-lg flex items-center gap-2 ${
                      isActive
                        ? 'text-[#265C38] bg-[#e8f1eb]'
                        : 'text-[#666666] hover:text-[#265C38] hover:bg-[#e8f1eb]/40'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Button */}
            <Link
              href="/customer/notifications"
              className={`p-2 rounded-full transition relative ${
                pathname === '/customer/notifications'
                  ? 'text-[#265C38] bg-[#e8f1eb]'
                  : 'text-[#666666] hover:text-[#265C38] hover:bg-[#e8f1eb]/40'
              }`}
            >
              <BellIcon className="h-5 w-5" />
            </Link>

            <div className="text-right flex flex-col">
              <span className="text-[10px] text-gray-400 font-medium">مرحباً بك</span>
              <span className="text-sm font-bold text-[#111111]">{displayName}</span>
            </div>

            <Link
              href="/customer/profile"
              className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-gray-100 block cursor-pointer transition transform hover:scale-105"
            >
              <Image src="/images/avatar.png" alt="Avatar" fill className="object-cover" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-bold text-[#d32f2f] hover:bg-[#ffebee] px-3.5 py-2 rounded-xl transition duration-150 border border-[#ffebee] cursor-pointer"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Top Header ── */}
      <header className="md:hidden w-full bg-[#fdfcfa] border-b border-[#f0ebde]/45 sticky top-0 z-50 flex items-center justify-between px-4 h-16 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <Image src="/images/onboard4.svg" alt="Logo" fill className="object-contain" />
          </div>
          <span className="text-base font-bold text-[#265C38]">محاصيل</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/customer/notifications"
            className="p-1.5 text-[#666666] hover:text-[#265C38] rounded-full transition"
          >
            <BellIcon className="h-5.5 w-5.5" />
          </Link>
          <Link
            href="/customer/profile"
            className="relative h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100 block"
          >
            <Image src="/images/avatar.png" alt="Avatar" fill className="object-cover" />
          </Link>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8 flex flex-col">
        {children}
      </main>

      {/* ── Mobile Bottom Navigation Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#fdfcfa] border-t border-[#f0ebde]/50 z-50 flex items-center justify-around h-16 shadow-lg">
        {navLinks.map((link) => {
          const isActive =
            pathname === link.href || (link.href !== '/customer' && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center w-12 h-full transition ${
                isActive ? 'text-[#265C38]' : 'text-gray-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-bold mt-1">{link.name}</span>
            </Link>
          );
        })}
        {/* Mobile Profile Tab */}
        <Link
          href="/customer/profile"
          className={`flex flex-col items-center justify-center w-12 h-full transition ${
            pathname.startsWith('/customer/profile') ? 'text-[#265C38]' : 'text-gray-400'
          }`}
        >
          <ProfileIcon className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-1">الحساب</span>
        </Link>
      </nav>
    </div>
  );
}
