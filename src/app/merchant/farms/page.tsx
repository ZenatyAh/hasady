// src/app/merchant/farms/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { getFarms, Farm } from '@/services/api/farms';
import { PageHeader } from '@/components/merchant/PageHeader';
import { FarmCard } from '@/components/merchant/FarmCard';

export default function FarmsListPage() {
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isReady) return;

    getFarms(token)
      .then((data) => {
        setFarms(data);
      })
      .catch((err) => {
        console.error('Failed to load farms:', err);
        setError('حدث خطأ أثناء تحميل قائمة المزارع');
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
      {/* Responsive Container */}
      <div className="max-w-7xl mx-auto flex flex-col space-y-6">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden">
          <PageHeader title="قائمة المزارع" backHref="/merchant" />
        </div>

        {/* Section Title & Desktop Add Button Row */}
        <div className="flex items-center justify-between mt-2 md:mt-4 mb-2">
          <h2 className="text-xl font-bold text-[#265C38]">قائمة مزارعك</h2>
          <Link href="/merchant/farms/add" className="hidden md:block">
            <button className="rounded-2xl bg-[#265C38] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1f4f2c] transition duration-200 cursor-pointer">
              تسجيل مزرعة جديدة +
            </button>
          </Link>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-[#888888]">جاري تحميل المزارع...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center text-sm text-red-600 my-8">
            {error}
          </div>
        ) : farms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#e0e0e0] bg-white p-10 text-center flex flex-col items-center justify-center my-8 space-y-4">
            <svg
              className="h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5-1.5l-3-1m-3.182-3.182a4.5 4.5 0 11-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm text-[#888888]">لا توجد مزارع مسجلة حالياً</span>
            <Link href="/merchant/farms/add">
              <button className="rounded-xl bg-[#265C38] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1f4f2c]">
                سجل مزرعتك الأولى
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <FarmCard key={farm.id} farm={farm} />
            ))}
          </div>
        )}

        {/* Mobile Floating Action Button (FAB) - Hidden on Desktop */}
        <Link
          href="/merchant/farms/add"
          className="md:hidden fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#265C38] text-white shadow-xl hover:bg-[#1f4f2c] transition duration-200"
          aria-label="إضافة مزرعة جديدة"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </main>
  );
}
