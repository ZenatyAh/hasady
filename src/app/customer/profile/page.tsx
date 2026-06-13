// src/app/customer/profile/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function CustomerProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);

  const handleLogout = () => {
    clearAuthSession();
    router.push('/login');
  };

  const displayName = user?.name || 'مشتري محاصيل';
  const displayPhone = user?.phone || '0597450057';

  const menuItems = [
    { label: '✏️ تعديل الحساب والبيانات الشخصية', href: '/customer/profile/edit' },
    { label: '🔒 تغيير كلمة المرور والأمان', href: '/customer/profile/password' },
    { label: '🏦 تفاصيل الحساب البنكي المسجل', href: '/customer/profile/bank' },
    { label: '📞 الدعم الفني والمساعدة', href: '/customer/profile/support' },
    { label: '📜 شروط وأحكام الاستخدام والخصوصية', href: '/customer/profile/terms' },
  ];

  return (
    <div className="max-w-md mx-auto space-y-6 text-right">
      {/* Profile Header Card */}
      <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-6 shadow-sm flex flex-col items-center text-center space-y-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-[#265C38] bg-gray-100">
          <Image src="/images/avatar.png" alt="Avatar" fill className="object-cover" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-extrabold text-[#111111]">{displayName}</h2>
          <span className="text-xs text-gray-400 font-mono" dir="ltr">
            {displayPhone}
          </span>
          <div className="mt-2">
            <span className="bg-[#e8f1eb] text-[#265C38] text-[10px] font-bold px-3 py-1 rounded-full border border-[#265C38]/10">
              حساب مشتري (مستهلك)
            </span>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-6 shadow-sm divide-y divide-[#f0ebde]/45">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center justify-between py-4 text-sm font-semibold text-[#333333] hover:text-[#265C38] transition first:pt-0 last:pb-0"
          >
            <span>{item.label}</span>
            <span className="text-gray-300">←</span>
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-sm font-bold py-4 rounded-2xl transition cursor-pointer"
      >
        🚪 تسجيل الخروج من الحساب
      </button>
    </div>
  );
}
