// src/app/customer/reviews/rate/page.tsx

'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function RateMerchantFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const merchantId = searchParams.get('merchantId') || 'farm-1';
  const orderId = searchParams.get('orderId') || 'unknown';

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem('hasady-reviews');
        let reviewsList = [];
        if (stored) {
          try {
            reviewsList = JSON.parse(stored);
          } catch {
            reviewsList = [];
          }
        }

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

        const newReview = {
          id: `rev-${Date.now()}`,
          merchantName: merchantId === 'farm-1' ? 'مزرعة الخيرات النجدية' : 'المزارع المحلي',
          cropName: 'طلب مكتمل #' + orderId.slice(-4),
          rating,
          comment: comment.trim() || 'خدمة جيدة جداً وتعاملي مستمر مع المزرعة.',
          date: formattedDate,
        };

        reviewsList = [newReview, ...reviewsList];
        sessionStorage.setItem('hasady-reviews', JSON.stringify(reviewsList));
      }

      setIsSubmitting(false);
      router.push('/customer/reviews');
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 shadow-sm text-right space-y-6">
      <div className="text-center space-y-1">
        <span className="text-3xl block">⭐</span>
        <h1 className="text-xl font-extrabold text-[#111111]">تقييم المزارع والصفقة</h1>
        <p className="text-xs text-gray-400">شاركنا رأيك حول جودة المنتج وسرعة التوصيل</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Selector */}
        <div className="space-y-2 text-center">
          <span className="text-xs font-bold text-gray-400 block">اختر التقييم بالنجوم:</span>
          <div className="flex justify-center gap-2 text-3xl text-yellow-400" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="hover:scale-115 transition transform focus:outline-none cursor-pointer"
              >
                {star <= rating ? '★' : '☆'}
              </button>
            ))}
          </div>
        </div>

        {/* Comment Textarea */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#333333] block">اكتب تعليقك ورأيك بالتفصيل:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب ملاحظاتك هنا..."
            rows={4}
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-2xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/customer/reviews')}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-3.5 rounded-xl transition cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

export default function CustomerRatePage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="h-10 w-10 border-4 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
        <span className="text-sm text-gray-500 font-bold">جاري التحميل...</span>
      </div>
    }>
      <RateMerchantFormContent />
    </Suspense>
  );
}
