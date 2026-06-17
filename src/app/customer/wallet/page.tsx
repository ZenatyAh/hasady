'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store';
import { useWalletSummary, useBuyerPayments } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api-errors';

export default function CustomerWalletPage() {
  const { data: wallet, isLoading: walletLoading, error: walletError } = useWalletSummary();
  const { data: payments, isLoading: paymentsLoading, error: paymentsError } = useBuyerPayments();

  const loading = walletLoading || paymentsLoading;
  const error = walletError || paymentsError;

  const balance = wallet?.balance ?? 0;
  const currency = wallet?.currency ?? 'ريال سعودي';

  return (
    <div className="space-y-8">
      <div className="text-right">
        <h1 className="text-2xl font-extrabold text-[#111111]">المحفظة الإلكترونية</h1>
        <p className="text-xs text-gray-400 mt-1">تتبع رصيدك ومسحوبات الدفع والصفقات السابقة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#265C38] to-[#1f4f2c] rounded-[2.5rem] p-8 text-right text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 text-9xl">
            💳
          </div>
          <div className="space-y-2 relative z-10">
            <span className="text-xs text-green-200 font-bold">الرصيد المتاح بالمحفظة</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{balance.toLocaleString()}</span>
              <span className="text-sm font-bold">{currency}</span>
            </div>
            <p className="text-[10px] text-green-200/70 pt-2 border-t border-white/10">
              * رصيد آمن وموثق للدفع الفوري والتسوق السريع
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 text-right flex flex-col justify-between shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#111111]">سجل المدفوعات</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              تظهر هنا عمليات الدفع المرتبطة بطلباتك عبر Stripe.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#111111] text-right">
          كشف الحساب والعمليات الأخيرة
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="h-8 w-8 border-3 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
            <span className="text-xs text-gray-500 font-bold">جاري تحميل العمليات...</span>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-4 text-center text-xs text-red-600">
            {getErrorMessage(error)}
          </div>
        ) : (
          <div className="space-y-3">
            {(payments ?? []).length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">لا توجد عمليات دفع بعد</div>
            ) : (
              (payments ?? []).map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white border border-[#f0ebde]/75 rounded-2xl p-4 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3 text-right">
                    <span className="text-xl p-2 rounded-xl bg-red-50">🛒</span>
                    <div>
                      <h4 className="text-sm font-bold text-[#333333]">
                        دفع طلب {tx.orderId ? `#${tx.orderId.slice(-6)}` : ''}
                      </h4>
                      <span className="text-[10px] text-gray-400 font-semibold">
                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('ar-SA') : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-extrabold text-red-600">
                      -{Number(tx.amount).toLocaleString()} ريال
                    </span>
                    <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-lg font-bold">
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
