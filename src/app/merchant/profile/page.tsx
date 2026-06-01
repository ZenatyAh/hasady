// src/app/merchant/profile/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function ProfileLandingPage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

  if (!isReady) {
    return null;
  }

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  const displayName = user?.name || 'محمد علي إسماعيل';
  const displayPhone = user?.phone || '+966528787283';

  const menuItems = [
    {
      label: 'تعديل كلمة المرور',
      href: '/merchant/profile/password',
      icon: (
        <svg
          className="h-5 w-5 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      label: 'تعديل الملف الشخصي',
      href: '/merchant/profile/edit',
      icon: (
        <svg
          className="h-5 w-5 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      label: 'معلومات الحساب البنكي',
      href: '/merchant/profile/bank',
      icon: (
        <svg
          className="h-5 w-5 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
    },
    {
      label: 'التواصل مع الدعم الفني',
      href: '/merchant/profile/support',
      icon: (
        <svg
          className="h-5 w-5 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      label: 'الشروط والأحكام واتفاقية الاستخدام',
      href: '/merchant/profile/terms',
      icon: (
        <svg
          className="h-5 w-5 text-gray-400 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="الصفحة الشخصية" backHref="/merchant" />

        {/* Profile Card & Stats */}
        <div className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
          {/* User Meta */}
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[#265C38]/10 bg-gray-100">
              <Image src="/images/avatar.png" alt={displayName} fill className="object-cover" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-[#111111]">{displayName}</h2>
              <span className="text-xs text-gray-400 font-medium">صاحب مزرعة</span>
              <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500 font-medium">
                <svg
                  className="h-3.5 w-3.5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="font-mono">{displayPhone}</span>
              </div>
            </div>
          </div>

          {/* Stats Boxes (Completed orders, membership date, and ratings) */}
          <div className="grid grid-cols-3 gap-4 border-t border-[#f0ebde]/55 pt-6 text-center">
            <div className="bg-[#faf8f5]/65 rounded-2xl p-4 border border-[#e0e0e0]/40 flex flex-col items-center">
              <span className="text-xs text-gray-400 font-medium mb-1 block">طلبات مكتملة</span>
              <span className="text-lg font-extrabold text-[#265C38] font-mono leading-none">
                200
              </span>
            </div>
            <div className="bg-[#faf8f5]/65 rounded-2xl p-4 border border-[#e0e0e0]/40 flex flex-col items-center">
              <span className="text-xs text-gray-400 font-medium mb-1 block">عضو منذ</span>
              <span className="text-sm font-extrabold text-[#265C38] font-mono leading-none pt-0.5">
                2023-05
              </span>
            </div>
            <div className="bg-[#faf8f5]/65 rounded-2xl p-4 border border-[#e0e0e0]/40 flex flex-col items-center">
              <span className="text-xs text-gray-400 font-medium mb-1 block">التقييم</span>
              <div className="flex items-baseline justify-center pt-0.5">
                <span className="text-sm font-extrabold text-[#265C38] font-mono leading-none">
                  4.8
                </span>
                <span className="text-[9px] text-gray-400 mr-1 block">(120)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Settings */}
        <div className="bg-[#fdfcfa] rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm overflow-hidden p-4 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center justify-between p-4 rounded-2xl transition hover:bg-[#faf8f5] group"
            >
              {/* Right content: Icon & Label */}
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf8f5] border border-[#e0e0e0]/40 group-hover:bg-[#265C38]/5 transition">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-[#111111] group-hover:text-[#265C38] transition">
                  {item.label}
                </span>
              </div>

              {/* Left arrow indicator */}
              <div className="text-gray-400 group-hover:text-[#265C38] transition">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Logout Trigger */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#fdfcfa] hover:bg-[#ffebee]/10 border border-[#ffebee] hover:border-[#ffd8d8] text-[#d32f2f] text-sm font-bold rounded-[2rem] transition duration-150 cursor-pointer shadow-sm"
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </main>
  );
}
