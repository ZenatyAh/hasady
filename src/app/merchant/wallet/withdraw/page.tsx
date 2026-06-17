// src/app/merchant/wallet/withdraw/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import {
  getWalletSummary,
  getDefaultBankAccount,
  createWithdrawalRequest,
  WalletSummary,
  BankAccount,
} from '@/services/api/wallet';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function WithdrawProfitsPage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isReady) return;

    Promise.all([getWalletSummary(), getDefaultBankAccount()])
      .then(([walletData, bankData]) => {
        setWallet(walletData);
        setBankAccount(bankData);
      })
      .catch((err) => {
        console.error('Failed to load withdrawal resources:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, token]);

  const handleSubmitClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || wallet.withdrawableBalance <= 0) {
      setError('لا يوجد رصيد قابل للسحب حالياً');
      return;
    }
    if (!bankAccount) {
      setError('يرجى إضافة حساب بنكي أولاً لتتمكن من السحب');
      return;
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!wallet || !token) return;
    setSubmitting(true);
    try {
      await createWithdrawalRequest(wallet.withdrawableBalance, notes);
      setIsModalOpen(false);
      router.push('/merchant/wallet');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      {/* Centered responsive container */}
      <div className="max-w-2xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="طلب سحب أرباح" backHref="/merchant/wallet" />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-gray-400">جاري تحميل البيانات...</span>
          </div>
        ) : (
          <div className="bg-[#fdfcfa] p-5 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
            {/* Balance Indicator Row */}
            <div className="flex items-center justify-between border-b border-[#f0ebde]/55 pb-4">
              <span className="text-sm font-bold text-[#111111]">الرصيد القابل للسحب</span>
              <span className="text-lg font-bold text-[#265C38]">
                {(wallet?.withdrawableBalance ?? 0).toLocaleString()} ريال سعودي
              </span>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111111]">الملاحظات</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="إذا كان لديك ملاحظات تخص عملية السحب اكتبها هنا"
                rows={4}
                className="w-full rounded-2xl border border-[#e0e0e0] bg-white p-4 text-sm text-[#333333] outline-none transition focus:border-[#265C38] resize-none"
              />
            </div>

            {/* Bank Account Info Section */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-[#111111]">معلومات الحساب البنكي</h3>

              {bankAccount ? (
                <div className="rounded-2xl border border-[#e0e0e0] bg-[#faf8f5]/65 p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div>
                      <span className="text-xs text-gray-400 block mb-0.5">إسم صاحب الحساب</span>
                      <span className="font-semibold text-gray-800">
                        {bankAccount.accountHolderName}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-0.5">رقم الحساب</span>
                      <span className="font-semibold text-gray-800 font-mono">
                        {bankAccount.accountNumber}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs text-gray-400 block mb-0.5">اسم المصرف</span>
                      <span className="font-semibold text-[#265C38]">{bankAccount.bankName}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-[#e0e0e0] p-6 text-center text-sm text-gray-400 font-medium bg-[#faf8f5]/30">
                  لم تقم بإضافة حساب بنكي بعد
                </div>
              )}

              <Link href="/bank-account" className="block">
                <button className="w-full py-3.5 border border-[#265C38] hover:bg-[#265C38]/5 text-[#265C38] font-bold rounded-2xl transition duration-150 cursor-pointer">
                  تعديل الحساب
                </button>
              </Link>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600 border border-red-100 animate-fade-in">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#f0ebde]/55">
              <button
                type="button"
                onClick={handleSubmitClick}
                className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer"
              >
                إرسال الطلب
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
          dir="rtl"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-[#fdfcfa] p-6 shadow-xl border border-[#f0ebde]/45 text-center space-y-6 animate-in fade-in zoom-in duration-200">
            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#265C38]">تأكيد إرسال الطلب</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                هل أنت متأكد من إرسال طلب السحب؟ تأكد من صحة جميع البيانات قبل المتابعة.
              </p>
            </div>

            {/* Buttons Row */}
            <div className="flex gap-4">
              {/* Confirm Button (Left) */}
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="flex-1 py-3.5 bg-[#265C38] hover:bg-[#1f4f2c] text-white font-bold rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'جاري الإرسال...' : 'تأكيد'}
              </button>

              {/* Cancel Button (Right) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="flex-1 py-3.5 bg-[#fbebe8] hover:bg-[#f7d6d0] text-[#d32f2f] font-bold rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
