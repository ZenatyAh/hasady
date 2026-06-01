// src/app/merchant/reviews/rate/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';

export interface UserReview {
  id: string;
  merchantName: string;
  comment: string;
  rating: number;
  date: string;
}

export default function RateMerchantPage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isReady) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('يرجى اختيار التقييم بالنجوم أولاً');
      return;
    }
    setSubmitting(true);

    const newReview: UserReview = {
      id: `rev-${Date.now()}`,
      merchantName: 'محمد علي إسماعيل',
      comment:
        comment.trim() ||
        'صاحب مزرعة ملتزم، جودة المنتجات ممتازة والتوصيل في الوقت، يعطيك العافية!',
      rating,
      date: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
    };

    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('hasady-reviews-history');
      let history: UserReview[] = [];
      if (stored) {
        try {
          history = JSON.parse(stored) as UserReview[];
        } catch {
          history = [];
        }
      }
      history = [newReview, ...history];
      sessionStorage.setItem('hasady-reviews-history', JSON.stringify(history));
    }

    setTimeout(() => {
      setSubmitting(false);
      router.push('/merchant/reviews/history');
    }, 600);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="تقييم التاجر" backHref="/merchant/reviews" />

        <form
          onSubmit={handleSubmit}
          className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6 text-center"
        >
          {/* Merchant Profile Details */}
          <div className="flex flex-col items-center space-y-3">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-200 shrink-0 bg-gray-100">
              <Image
                src="/images/avatar.png"
                alt="محمد علي إسماعيل"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-[#111111]">محمد علي إسماعيل</h2>
              <span className="text-xs font-mono text-gray-400 block">+966528787283</span>
            </div>
          </div>

          {/* Star Input */}
          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const fill = star <= (hoverRating || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="text-3xl transition duration-100 cursor-pointer focus:outline-none"
                >
                  {fill ? (
                    <span className="text-yellow-500">★</span>
                  ) : (
                    <span className="text-gray-300">★</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Text Area */}
          <div className="space-y-2 text-right">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شارك رأيك في تجربة الشراء مع هذا التاجر"
              rows={5}
              className="w-full rounded-2xl border border-[#e0e0e0] bg-white p-4 text-sm text-[#333333] outline-none transition focus:border-[#265C38] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#f0ebde]/55">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
