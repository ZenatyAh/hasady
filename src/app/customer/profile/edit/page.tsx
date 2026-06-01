// src/app/customer/profile/edit/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function CustomerProfileEditPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const token = useAuthStore((state) => state.token);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate profile updates in Zustand store
      if (user && token) {
        setAuthSession(token, {
          ...user,
          name,
          phone,
        });
      }
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/customer/profile');
      }, 1000);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 shadow-sm text-right space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0ebde]/45 pb-3">
        <h1 className="text-base font-extrabold text-[#111111]">✏️ تعديل البيانات الشخصية</h1>
        <Link href="/customer/profile" className="text-xs font-bold text-[#265C38] hover:underline">
          إلغاء
        </Link>
      </div>

      {success && (
        <div className="bg-green-50 text-green-600 rounded-xl p-3 text-xs font-bold">
          ✓ تم تحديث البيانات بنجاح، جاري الحفظ...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#333333]">الاسم بالكامل</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#333333]">رقم الهاتف</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition text-left font-mono"
            dir="ltr"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'جاري التحديث...' : 'حفظ التعديلات'}
        </button>
      </form>
    </div>
  );
}
