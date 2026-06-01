// src/app/merchant/profile/bank/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { getDefaultBankAccount, BankAccount } from '@/services/api/wallet';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function BankAccountInfoPage() {
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !token) return;

    getDefaultBankAccount(token)
      .then((data) => {
        setBankAccount(data);
      })
      .catch((err) => {
        console.error('Failed to load default bank account:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, token]);

  if (!isReady) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="معلومات الحساب البنكي" backHref="/merchant/profile" />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-gray-400">جاري تحميل البيانات...</span>
          </div>
        ) : (
          <div className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
            {bankAccount ? (
              <div className="rounded-2xl border border-[#e0e0e0] bg-[#faf8f5]/65 p-6 space-y-4 text-right">
                <div className="grid grid-cols-1 gap-y-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">إسم صاحب الحساب</span>
                    <span className="font-semibold text-gray-800 text-base">
                      {bankAccount.accountHolderName}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">رقم الحساب</span>
                    <span className="font-semibold text-gray-800 text-base font-mono">
                      {bankAccount.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 block mb-0.5">اسم المصرف</span>
                    <span className="font-semibold text-[#265C38] text-base">
                      {bankAccount.bankName}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-[#e0e0e0] p-8 text-center text-sm text-gray-400 font-medium bg-[#faf8f5]/30">
                لم يتم تسجيل أي حساب بنكي بعد
              </div>
            )}

            {/* Edit Button */}
            <div className="pt-2">
              <Link href="/bank-account">
                <button className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer">
                  تعديل الحساب
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
