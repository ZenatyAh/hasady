'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';
import { useUpdateProfile } from '@/hooks/mutations';
import { getErrorMessage } from '@/lib/api-errors';

export default function EditProfileInfoPage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();
  const user = useAuthStore((state) => state.user);

  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateProfile = useUpdateProfile();

  const resolvedName = fullName || user?.name || '';
  const resolvedBio = bio || user?.bio || '';

  if (!isReady) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!resolvedName.trim()) {
      setError('يرجى إدخال الاسم الكامل');
      return;
    }

    try {
      await updateProfile.mutateAsync({
        fullName: resolvedName.trim(),
        bio: resolvedBio.trim() || undefined,
      });
      setSuccess('تم تحديث البيانات الشخصية بنجاح');
      setTimeout(() => router.push('/merchant/profile'), 1000);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        <PageHeader title="معلومات الحساب الشخصي" backHref="/merchant/profile" />

        <div className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">الإسم الكامل</label>
              <input
                type="text"
                value={resolvedName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="محمد علي إسماعيل"
                className="w-full rounded-xl border border-[#e0e0e0] bg-white py-3.5 px-4 text-sm text-[#333333] outline-none transition focus:border-[#265C38]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">نبذة تعريفية</label>
              <textarea
                value={resolvedBio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-[#e0e0e0] bg-white py-3.5 px-4 text-sm text-[#333333] outline-none transition focus:border-[#265C38] resize-none"
              />
            </div>

            {user?.phone && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">رقم الهاتف</label>
                <input
                  type="text"
                  value={user.phone}
                  readOnly
                  dir="ltr"
                  className="w-full rounded-xl border border-[#e0e0e0] bg-gray-50 py-3.5 px-4 text-sm text-gray-500 outline-none cursor-not-allowed text-right"
                />
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 p-3.5 text-center text-xs text-red-600 border border-red-100">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl bg-emerald-50 p-3.5 text-center text-xs text-emerald-600 border border-emerald-100">
                {success}
              </div>
            )}

            <div className="pt-4 border-t border-[#f0ebde]/55">
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer disabled:opacity-50"
              >
                {updateProfile.isPending ? 'جاري التحديث...' : 'تعديل'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
