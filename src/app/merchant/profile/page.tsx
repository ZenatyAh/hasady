'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { useMe } from '@/hooks/queries';
import { logout } from '@/lib/auth/logout';
import { PageHeader } from '@/components/merchant/PageHeader';
import { PageLoader } from '@/components/ui/PageLoader';

export default function ProfileLandingPage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();
  const { data: me, isLoading, error } = useMe();

  if (!isReady) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
        <PageLoader />
      </main>
    );
  }

  const displayName = me?.fullName ?? me?.email ?? 'تاجر محاصيل';
  const displayPhone = me?.phone ?? '';
  const avatarSrc = me?.profileImage ?? '/images/avatar.png';

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
        <PageHeader title="الصفحة الشخصية" backHref="/merchant" />

        {error && (
          <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 border border-red-100">
            تعذر تحميل بيانات الحساب
          </div>
        )}

        <div className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-[#265C38]/10 bg-gray-100">
              <Image
                src={avatarSrc}
                alt={displayName}
                fill
                className="object-cover"
                unoptimized={Boolean(me?.profileImage)}
              />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-[#111111]">{displayName}</h2>
              <span className="text-xs text-gray-400 font-medium">صاحب مزرعة</span>
              {displayPhone && (
                <div className="flex items-center justify-center gap-1 mt-1 text-xs text-gray-500 font-medium">
                  <span className="font-mono">{displayPhone}</span>
                </div>
              )}
            </div>
          </div>

          {me?.ratingAvg !== undefined && (
            <div className="grid grid-cols-1 gap-4 border-t border-[#f0ebde]/55 pt-6 text-center">
              <div className="bg-[#faf8f5]/65 rounded-2xl p-4 border border-[#e0e0e0]/40 flex flex-col items-center">
                <span className="text-xs text-gray-400 font-medium mb-1 block">التقييم</span>
                <div className="flex items-baseline justify-center pt-0.5">
                  <span className="text-sm font-extrabold text-[#265C38] font-mono leading-none">
                    {me.ratingAvg}
                  </span>
                  {me.ratingCount !== undefined && (
                    <span className="text-[9px] text-gray-400 mr-1 block">({me.ratingCount})</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#fdfcfa] rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm overflow-hidden p-4 space-y-1">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center justify-between p-4 rounded-2xl transition hover:bg-[#faf8f5] group"
            >
              <div className="flex items-center gap-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf8f5] border border-[#e0e0e0]/40 group-hover:bg-[#265C38]/5 transition">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-[#111111] group-hover:text-[#265C38] transition">
                  {item.label}
                </span>
              </div>
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

        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#fdfcfa] hover:bg-[#ffebee]/10 border border-[#ffebee] hover:border-[#ffd8d8] text-[#d32f2f] text-sm font-bold rounded-[2rem] transition duration-150 cursor-pointer shadow-sm"
          >
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>
    </main>
  );
}
