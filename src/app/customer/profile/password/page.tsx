// src/app/customer/profile/password/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CustomerProfilePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
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
        <h1 className="text-base font-extrabold text-[#111111]">🔒 تغيير كلمة المرور</h1>
        <Link href="/customer/profile" className="text-xs font-bold text-[#265C38] hover:underline">
          إلغاء
        </Link>
      </div>

      {success && (
        <div className="bg-green-50 text-green-600 rounded-xl p-3 text-xs font-bold">
          ✓ تم تغيير كلمة المرور بنجاح...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#333333]">كلمة المرور الحالية</label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#333333]">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الحفظ...' : 'تحديث كلمة المرور'}
        </button>
      </form>
    </div>
  );
}
