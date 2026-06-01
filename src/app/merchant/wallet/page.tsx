// src/app/merchant/wallet/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import {
  getWalletSummary,
  getWithdrawalRequests,
  WalletSummary,
  WithdrawalRequest,
} from '@/services/api/wallet';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function WalletPage() {
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady || !token) return;

    Promise.all([getWalletSummary(token), getWithdrawalRequests(token)])
      .then(([walletData, requestsData]) => {
        setWallet(walletData);
        setRequests(requestsData);
      })
      .catch((err) => {
        console.error('Failed to load wallet data:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, token]);

  if (!isReady) {
    return null;
  }

  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-xs font-semibold text-[#b45309]">
            الطلب قيد المعالجة
          </span>
        );
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center rounded-full bg-[#d1fae5] px-2.5 py-0.5 text-xs font-semibold text-[#065f46]">
            تم تنفيذ الطلب
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center rounded-full bg-[#fee2e2] px-2.5 py-0.5 text-xs font-semibold text-[#991b1b]">
            مرفوضة
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      {/* Centered responsive container */}
      <div className="max-w-4xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="المحفظة" backHref="/merchant" />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-gray-400">جاري تحميل المحفظة...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Financial Summary Card (Left side on desktop, top on mobile) */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-[#fdfcfa] p-6 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-bold text-[#265C38] mb-4">الملخص المالي</h3>

                  {/* Available Balance */}
                  <div className="py-4 border-b border-[#f0ebde]/55 flex flex-col items-center text-center">
                    <span className="text-xs text-gray-400 font-medium mb-1 block">
                      الرصيد المتوفر
                    </span>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-extrabold text-[#265C38] tracking-tight">
                        {wallet?.balance.toLocaleString() ?? '0'}
                      </span>
                      <span className="text-sm font-bold text-gray-500 mr-1.5">ريال سعودي</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm py-1.5">
                      <span className="text-gray-400 font-medium">الرصيد المعلق</span>
                      <span className="font-semibold text-gray-700">
                        {wallet?.pendingBalance.toLocaleString() ?? '0'} ريال سعودي
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1.5">
                      <span className="text-gray-400 font-medium">الرصيد القابل للسحب</span>
                      <span className="font-semibold text-[#265C38]">
                        {wallet?.withdrawableBalance.toLocaleString() ?? '0'} ريال سعودي
                      </span>
                    </div>
                  </div>
                </div>

                <Link href="/merchant/wallet/withdraw" className="block">
                  <button className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer">
                    طلب سحب أرباح
                  </button>
                </Link>
              </div>
            </div>

            {/* Transfer Requests List (Right side on desktop, bottom on mobile) */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-[#fdfcfa] p-6 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-[#111111] border-b border-[#f0ebde]/55 pb-3">
                  طلبات التحويل
                </h3>

                {requests.length === 0 ? (
                  <div className="text-center py-12 text-sm text-gray-400 font-medium">
                    لا توجد طلبات تحويل سابقة
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-[#faf8f5]/65 border border-[#f0ebde]/35 transition hover:bg-[#faf8f5]/90"
                      >
                        <div className="space-y-1">
                          {getStatusBadge(req.status)}
                          <span className="text-[10px] text-gray-400 block font-mono">
                            {req.createdAt}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                          {req.amount.toLocaleString()} ريال سعودي
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
