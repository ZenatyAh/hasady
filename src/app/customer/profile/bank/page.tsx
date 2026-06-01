// src/app/customer/profile/bank/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';

export default function CustomerProfileBankPage() {
  return (
    <div className="max-w-md mx-auto bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 shadow-sm text-right space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0ebde]/45 pb-3">
        <h1 className="text-base font-extrabold text-[#111111]">🏦 الحساب البنكي المسجل</h1>
        <Link href="/customer/profile" className="text-xs font-bold text-[#265C38] hover:underline">
          عودة
        </Link>
      </div>

      <div className="bg-[#faf8f5] border border-[#f0ebde]/45 rounded-2xl p-5 space-y-4">
        <div className="space-y-1">
          <span className="text-xs text-gray-400 block font-semibold">اسم البنك</span>
          <span className="text-sm font-bold text-[#333333]">البنك الأهلي السعودي (SNB)</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-gray-400 block font-semibold">اسم صاحب الحساب</span>
          <span className="text-sm font-bold text-[#333333]">محمد علي إسماعيل</span>
        </div>

        <div className="space-y-1">
          <span className="text-xs text-gray-400 block font-semibold">رقم الحساب (IBAN)</span>
          <span className="text-sm font-bold text-[#333333] font-mono" dir="ltr">
            SA 84 1000 0000 1234 5678 9012
          </span>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 leading-relaxed text-center">
        * يتم استخدام هذا الحساب في استرداد الأموال للطلبات المرفوضة أو المرتجعة.
      </p>
    </div>
  );
}
