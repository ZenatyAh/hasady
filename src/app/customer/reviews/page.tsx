// src/app/customer/reviews/page.tsx

'use client';

import React, { useState } from 'react';

interface Review {
  id: string;
  merchantName: string;
  cropName: string;
  rating: number;
  comment: string;
  date: string;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    merchantName: 'مزرعة الخيرات النجدية',
    cropName: 'طماطم شيري',
    rating: 5,
    comment: 'منتجات نظيفة جداً وتعبئة ممتازة وسرعة عالية في الاستجابة والشحن.',
    date: '28-05-2026',
  },
];

function loadStoredReviews(): Review[] {
  if (typeof window === 'undefined') return [];

  const stored = sessionStorage.getItem('hasady-reviews');
  if (stored) {
    try {
      return JSON.parse(stored) as Review[];
    } catch {
      sessionStorage.removeItem('hasady-reviews');
    }
  }

  sessionStorage.setItem('hasady-reviews', JSON.stringify(DEFAULT_REVIEWS));
  return DEFAULT_REVIEWS;
}

export default function CustomerReviewsPage() {
  const [reviews] = useState<Review[]>(loadStoredReviews);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0ebde]/45 pb-4 text-right">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">التقييمات والمراجعات</h1>
          <p className="text-xs text-gray-400 mt-1">عرض ومتابعة تقييماتك السابقة لمزارعي محاصيل</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-[#fdfcfa] rounded-3xl border border-dashed border-[#f0ebde] p-16 text-center max-w-md mx-auto space-y-3">
          <span className="text-4xl">⭐</span>
          <h3 className="text-lg font-bold text-[#111111]">لا توجد تقييمات بعد</h3>
          <p className="text-sm text-[#888888]">
            بمجرد إتمام طلباتك، يمكنك تقييم البائعين ومشاركة تجربتك مع المجتمع.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#f0ebde]/75 rounded-[2rem] p-6 shadow-sm text-right space-y-3"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#111111]">{rev.merchantName}</h3>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    {rev.cropName} • {rev.date}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-lg">
                      {i < rev.rating ? '★' : '☆'}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs leading-relaxed text-[#666666] bg-[#faf8f5] rounded-xl p-4 border border-[#f0ebde]/35">
                {rev.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
