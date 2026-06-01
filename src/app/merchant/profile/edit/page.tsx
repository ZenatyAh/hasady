// src/app/merchant/profile/edit/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function EditProfileInfoPage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const token = useAuthStore((state) => state.token);

  const [fullName, setFullName] = useState(() => user?.name || '');
  const [phone, setPhone] = useState(() => user?.phone || '0503202382');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setFullName(user.name);
        setPhone(user.phone || '0503202382');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!isReady) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !phone.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('تم تحديث البيانات الشخصية بنجاح');

      // Update store
      if (user && token) {
        setAuthSession(token, {
          ...user,
          name: fullName.trim(),
          phone: phone.trim(),
        });
      }

      setTimeout(() => {
        router.push('/merchant/profile');
      }, 1000);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="معلومات الحساب الشخصي" backHref="/merchant/profile" />

        <div className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
          {/* Subtitle */}
          <div className="text-center space-y-1.5 pb-2 border-b border-[#f0ebde]/55">
            <p className="text-xs text-gray-400 leading-relaxed">
              حافظ على أمان حسابك، قم بتحديث كلمة المرور الخاصة بك بانتظام
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">الإسم الكامل</label>
              <div className="relative flex items-center">
                {/* User Icon (Right) */}
                <div className="absolute right-3.5 text-gray-400">
                  <svg
                    className="h-4.5 w-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="محمد علي إسماعيل"
                  className="w-full rounded-xl border border-[#e0e0e0] bg-white py-3.5 pr-11 pl-4 text-sm text-[#333333] outline-none transition focus:border-[#265C38]"
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">رقم الهاتف</label>
              <div className="relative flex items-center">
                {/* Phone Icon (Right) */}
                <div className="absolute right-3.5 text-gray-400">
                  <svg
                    className="h-4.5 w-4.5"
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
                </div>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966503202382"
                  dir="ltr"
                  className="w-full rounded-xl border border-[#e0e0e0] bg-white py-3.5 pr-11 pl-4 text-sm text-[#333333] outline-none transition focus:border-[#265C38] text-right"
                />
              </div>
            </div>

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

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#f0ebde]/55">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'جاري التحديث...' : 'تعديل'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
