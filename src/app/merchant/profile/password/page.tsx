// src/app/merchant/profile/password/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function EditPasswordPage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isReady) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    if (newPassword.length < 6) {
      setError('يجب أن تتكون كلمة المرور الجديدة من 6 خانات على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('تأكيد كلمة المرور الجديدة غير متطابق');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('تم تحديث كلمة المرور بنجاح');
      setTimeout(() => {
        router.push('/merchant/profile');
      }, 1000);
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="تعديل كلمة المرور" backHref="/merchant/profile" />

        <div className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
          {/* Subtitle */}
          <div className="text-center space-y-1.5 pb-2 border-b border-[#f0ebde]/55">
            <p className="text-xs text-gray-400 leading-relaxed">
              حافظ على أمان حسابك، قم بتحديث كلمة المرور الخاصة بك بانتظام
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-right">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                كلمة المرور الحالية <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                {/* Lock Icon (Right) */}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#e0e0e0] bg-white py-3.5 pr-11 pl-11 text-sm text-[#333333] outline-none transition focus:border-[#265C38]"
                />
                {/* Eye Icon (Left) */}
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute left-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showCurrent ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                كلمة المرور الجديدة <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                {/* Lock Icon */}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#e0e0e0] bg-white py-3.5 pr-11 pl-11 text-sm text-[#333333] outline-none transition focus:border-[#265C38]"
                />
                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute left-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showNew ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                تأكيد كلمة المرور الجديدة <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                {/* Lock Icon */}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-[#e0e0e0] bg-white py-3.5 pr-11 pl-11 text-sm text-[#333333] outline-none transition focus:border-[#265C38]"
                />
                {/* Eye Icon */}
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute left-3.5 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                >
                  {showConfirm ? (
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
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    </svg>
                  ) : (
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
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
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
                {loading ? 'جاري الحفظ...' : 'تعديل كلمة المرور'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
