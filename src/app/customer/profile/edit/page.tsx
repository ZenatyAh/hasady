'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useUpdateProfile } from '@/hooks/mutations';
import { getErrorMessage } from '@/lib/api-errors';

export default function CustomerProfileEditPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const updateProfile = useUpdateProfile();

  const resolvedName = name || user?.name || '';
  const resolvedBio = bio || user?.bio || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await updateProfile.mutateAsync({ fullName: resolvedName, bio: resolvedBio || undefined });
      setSuccess(true);
      setTimeout(() => router.push('/customer/profile'), 1000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
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

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-3 text-xs font-bold">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#333333]">الاسم بالكامل</label>
          <input
            type="text"
            value={resolvedName}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#333333]">نبذة تعريفية</label>
          <textarea
            value={resolvedBio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition resize-none"
          />
        </div>

        {user?.phone && (
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#333333]">رقم الهاتف</label>
            <input
              type="tel"
              value={user.phone}
              readOnly
              className="w-full bg-gray-50 text-gray-500 py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs text-left font-mono cursor-not-allowed"
              dir="ltr"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={updateProfile.isPending}
          className="w-full bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition disabled:opacity-50"
        >
          {updateProfile.isPending ? 'جاري الحفظ...' : 'حفظ التعديلات'}
        </button>
      </form>
    </div>
  );
}
