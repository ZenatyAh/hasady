// src/app/merchant/reviews/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function ReviewsLandingPage() {
  const { isReady } = useAuthGuard();

  if (!isReady) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="التقييمات" backHref="/merchant" />

        <div className="space-y-6">
          {/* Card 1: Rate Last Transaction */}
          <div className="bg-[#fdfcfa] p-6 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#111111]">تقييم الصفقة الأخيرة</h2>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                قم بإضافة تقييم وتعليق للتاجر للصفقة الأخيرة التي أتممتها معه، وساهم في تحسين
                التجربة للجميع.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/merchant/reviews/rate">
                <button className="w-full py-3.5 bg-[#e8f1eb] hover:bg-[#d8e6dc] text-[#265C38] text-sm font-bold rounded-2xl transition duration-150 cursor-pointer">
                  تقييم الآن
                </button>
              </Link>
            </div>
          </div>

          {/* Card 2: Previous Ratings */}
          <div className="bg-[#fdfcfa] p-6 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-base font-bold text-[#111111]">التقييمات السابقة</h2>
              <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
                تصفّح تقييماتك وتعليقاتك السابقة التي قمت بها، وراجع سجل تعاملاتك بسهولة.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/merchant/reviews/history">
                <button className="w-full py-3.5 bg-[#e8f1eb] hover:bg-[#d8e6dc] text-[#265C38] text-sm font-bold rounded-2xl transition duration-150 cursor-pointer">
                  عرض التقييمات
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
