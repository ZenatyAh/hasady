// src/app/merchant/reviews/history/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';
import { UserReview } from '../rate/page';

const DEFAULT_HISTORY: UserReview[] = [
  {
    id: 'rev-1',
    merchantName: 'محمد علي إسماعيل',
    comment: 'صاحب مزرعة ملتزم، جودة المنتجات ممتازة والتوصيل في الوقت، يعطيك العافية!',
    rating: 4,
    date: '14-09-2025',
  },
  {
    id: 'rev-2',
    merchantName: 'محمد علي إسماعيل',
    comment: 'صاحب مزرعة ملتزم، جودة المنتجات ممتازة والتوصيل في الوقت، يعطيك العافية!',
    rating: 4,
    date: '14-09-2025',
  },
  {
    id: 'rev-3',
    merchantName: 'محمد علي إسماعيل',
    comment: 'صاحب مزرعة ملتزم، جودة المنتجات ممتازة والتوصيل في الوقت، يعطيك العافية!',
    rating: 4,
    date: '14-09-2025',
  },
  {
    id: 'rev-4',
    merchantName: 'محمد علي إسماعيل',
    comment: 'صاحب مزرعة ملتزم، جودة المنتجات ممتازة والتوصيل في الوقت، يعطيك العافية!',
    rating: 4,
    date: '14-09-2025',
  },
  {
    id: 'rev-5',
    merchantName: 'محمد علي إسماعيل',
    comment: 'صاحب مزرعة ملتزم، جودة المنتجات ممتازة والتوصيل في الوقت، يعطيك العافية!',
    rating: 4,
    date: '14-09-2025',
  },
];

export default function ReviewsHistoryPage() {
  const { isReady } = useAuthGuard();
  const [reviews] = useState<UserReview[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('hasady-reviews-history');
      if (stored) {
        try {
          return JSON.parse(stored) as UserReview[];
        } catch {
          return DEFAULT_HISTORY;
        }
      } else {
        sessionStorage.setItem('hasady-reviews-history', JSON.stringify(DEFAULT_HISTORY));
        return DEFAULT_HISTORY;
      }
    }
    return DEFAULT_HISTORY;
  });

  useEffect(() => {
    // Handled in state initializer
  }, []);

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
        {/* Header */}
        <PageHeader title="التقييمات السابقة" backHref="/merchant/reviews" />

        <div className="bg-[#fdfcfa] p-5 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
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
                  {/* Right: Avatar image */}
                  <div className="relative h-11 w-11 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                    <Image
                      src="/images/avatar.png"
                      alt={rev.merchantName}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 space-y-1 pr-0.5">
                    <div className="flex items-center gap-1">
                      <h4 className="text-sm font-bold text-[#265C38]">{rev.merchantName}</h4>
                      <span className="flex items-center justify-center h-3.5 w-3.5 rounded-full bg-emerald-100 text-emerald-600 text-[8px]">
                        ✓
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      {rev.comment}
                    </p>
                  </div>

                  {/* Left: Star rating and Date */}
                  <div className="flex flex-col items-end justify-between self-stretch shrink-0 pb-1 pt-0.5">
                    <div className="flex gap-0.5">{renderStars(rev.rating)}</div>
                    <span className="text-[9px] text-gray-400 font-mono leading-none block">
                      {rev.date}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
