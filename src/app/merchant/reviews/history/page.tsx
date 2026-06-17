'use client';

import React from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { useGivenRatings } from '@/hooks/queries';
import { PageHeader } from '@/components/merchant/PageHeader';
import { getErrorMessage } from '@/lib/api-errors';

export default function ReviewsHistoryPage() {
  const { isReady } = useAuthGuard();
  const { data: reviews = [], isLoading, error } = useGivenRatings();

  if (!isReady) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(
          <span key={i} className="text-yellow-500 text-[11px] leading-none">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-[11px] leading-none">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        <PageHeader title="التقييمات السابقة" backHref="/merchant/reviews" />

        <div className="bg-[#fdfcfa] p-5 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="h-8 w-8 border-3 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
              <span className="text-xs text-gray-500 font-bold">جاري تحميل التقييمات...</span>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-center text-xs text-red-600">
              {getErrorMessage(error)}
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400 font-medium">
                  لا توجد تقييمات سابقة حالياً
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="flex items-start gap-3.5 p-4 rounded-[1.5rem] bg-[#faf8f5]/65 border border-[#e0e0e0] transition hover:bg-[#faf8f5]/90 text-right relative min-h-[96px]"
                  >
                    <div className="relative h-11 w-11 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                      <Image
                        src="/images/avatar.png"
                        alt={rev.reviewed?.fullName ?? 'مستخدم'}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 space-y-1 pr-0.5">
                      <div className="flex items-center gap-1">
                        <h4 className="text-sm font-bold text-[#265C38]">
                          {rev.reviewed?.fullName ?? 'مستخدم'}
                        </h4>
                        <span className="flex items-center justify-center h-3.5 w-3.5 rounded-full bg-emerald-100 text-emerald-600 text-[8px]">
                          ✓
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        {rev.comment ?? '—'}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch shrink-0 pb-1 pt-0.5">
                      <div className="flex gap-0.5">{renderStars(rev.score)}</div>
                      <span className="text-[9px] text-gray-400 font-mono leading-none block">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('ar-SA') : '—'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
