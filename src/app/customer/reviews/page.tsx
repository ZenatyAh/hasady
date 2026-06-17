'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store';
import { useGivenRatings } from '@/hooks/queries';
import { getErrorMessage } from '@/lib/api-errors';

export default function CustomerReviewsPage() {
  const { data: ratings = [], isLoading, error } = useGivenRatings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0ebde]/45 pb-4 text-right">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">التقييمات والمراجعات</h1>
          <p className="text-xs text-gray-400 mt-1">عرض ومتابعة تقييماتك السابقة لمزارعي محاصيل</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="h-8 w-8 border-3 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-bold">جاري تحميل التقييمات...</span>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-center text-xs text-red-600">
          {getErrorMessage(error)}
        </div>
      ) : ratings.length === 0 ? (
        <div className="bg-[#fdfcfa] rounded-3xl border border-dashed border-[#f0ebde] p-16 text-center max-w-md mx-auto space-y-3">
          <span className="text-4xl">⭐</span>
          <h3 className="text-lg font-bold text-[#111111]">لا توجد تقييمات بعد</h3>
          <p className="text-sm text-[#888888]">
            بمجرد إتمام طلباتك، يمكنك تقييم البائعين ومشاركة تجربتك مع المجتمع.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ratings.map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-[#f0ebde]/75 rounded-[2rem] p-6 shadow-sm text-right space-y-3"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#111111]">
                    {rev.reviewed?.fullName ?? 'تاجر'}
                  </h3>
                  <span className="text-[10px] text-gray-400 font-semibold">
                    طلب #{rev.orderId.slice(-6)}
                    {rev.createdAt
                      ? ` • ${new Date(rev.createdAt).toLocaleDateString('ar-SA')}`
                      : ''}
                  </span>
                </div>

                <div className="flex gap-0.5 text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star}>{star <= rev.score ? '★' : '☆'}</span>
                  ))}
                </div>
              </div>

              {rev.comment && (
                <p className="text-xs text-gray-600 leading-relaxed border-t border-[#f0ebde]/45 pt-3">
                  {rev.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
