// src/app/customer/wallet/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

interface Transaction {
  id: string;
  type: 'purchase' | 'refund' | 'deposit';
  amount: number;
  cropName: string;
  date: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
}

export default function CustomerWalletPage() {
  const token = useAuthStore((state) => state.token);
  const [balance, setBalance] = useState(15000); // Simulated user balance
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate simulated payments based on order payments or default records
    function loadTransactions() {
      setLoading(true);
      const defaultTx: Transaction[] = [
        {
          id: 'tx-101',
          type: 'purchase',
          amount: 3500,
          cropName: 'شراء طماطم شيري',
          date: '01-06-2026',
          status: 'SUCCESS',
        },
        {
          id: 'tx-102',
          type: 'deposit',
          amount: 10000,
          cropName: 'شحن رصيد المحفظة',
          date: '30-05-2026',
          status: 'SUCCESS',
        },
      ];
      setTransactions(defaultTx);
      setLoading(false);
    }
    loadTransactions();
  }, [token]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-right">
        <h1 className="text-2xl font-extrabold text-[#111111]">المحفظة الإلكترونية</h1>
        <p className="text-xs text-gray-400 mt-1">تتبع رصيدك ومسحوبات الدفع والصفقات السابقة</p>
      </div>

      {/* Balance Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card A: Current Balance */}
        <div className="bg-gradient-to-br from-[#265C38] to-[#1f4f2c] rounded-[2.5rem] p-8 text-right text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-6 translate-x-6 text-9xl">💳</div>
          <div className="space-y-2 relative z-10">
            <span className="text-xs text-green-200 font-bold">الرصيد المتاح بالمحفظة</span>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black">{balance.toLocaleString()}</span>
              <span className="text-sm font-bold">ريال سعودي</span>
            </div>
            <p className="text-[10px] text-green-200/70 pt-2 border-t border-white/10">
              * رصيد آمن وموثق للدفع الفوري والتسوق السريع
            </p>
          </div>
        </div>

        {/* Card B: Quick Actions */}
        <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 text-right flex flex-col justify-between shadow-sm">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#111111]">إضافة رصيد للمحفظة</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              يمكنك شحن رصيدك لتسهيل الصفقات والمزايدة بنقرة واحدة في المزادات النشطة.
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setBalance((prev) => prev + 5000)}
              className="flex-1 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition cursor-pointer"
            >
              ➕ شحن رصيد (5,000 ريال)
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#111111] text-right">كشف الحساب والعمليات الأخيرة</h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-3">
            <div className="h-8 w-8 border-3 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
            <span className="text-xs text-gray-500 font-bold">جاري تحميل العمليات...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white border border-[#f0ebde]/75 rounded-2xl p-4 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3 text-right">
                  <span className={`text-xl p-2 rounded-xl ${tx.type === 'deposit' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {tx.type === 'deposit' ? '💰' : '🛒'}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-[#333333]">{tx.cropName}</h4>
                    <span className="text-[10px] text-gray-400 font-semibold">{tx.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`text-sm font-extrabold ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                    {tx.type === 'deposit' ? '+' : '-'}{tx.amount} ريال
                  </span>
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-lg font-bold">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
