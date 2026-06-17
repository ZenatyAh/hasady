'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { useCreateRating } from '@/hooks/mutations';
import { PageHeader } from '@/components/merchant/PageHeader';
import { getErrorMessage } from '@/lib/api-errors';

export default function RateMerchantPage() {
  return (
    <Suspense fallback={null}>
      <RateMerchantForm />
    </Suspense>
  );
}

function RateMerchantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  const { isReady } = useAuthGuard();
  const createRating = useCreateRating();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  if (!isReady) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('يرجى اختيار التقييم بالنجوم أولاً');
      return;
    }

    if (!orderId) {
      setError('معرّف الطلب غير متوفر');
      return;
    }

    try {
      await createRating.mutateAsync({
        orderId,
        score: rating,
        comment: comment.trim() || undefined,
      });
      router.push('/merchant/reviews/history');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        <PageHeader title="تقييم التاجر" backHref="/merchant/reviews" />

        <form
          onSubmit={handleSubmit}
          className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6 text-center"
        >
          <div className="flex flex-col items-center space-y-3">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-gray-200 shrink-0 bg-gray-100">
              <Image src="/images/avatar.png" alt="المشتري" fill className="object-cover" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base font-bold text-[#111111]">تقييم المشتري</h2>
              <span className="text-xs text-gray-400 block">بعد إتمام الصفقة</span>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-center text-xs text-red-600">{error}</div>
          )}

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

          <div className="space-y-2 text-right">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="شارك رأيك في تجربة الشراء مع هذا التاجر"
              rows={5}
              className="w-full rounded-2xl border border-[#e0e0e0] bg-white p-4 text-sm text-[#333333] outline-none transition focus:border-[#265C38] resize-none"
            />
          </div>

          <div className="pt-4 border-t border-[#f0ebde]/55">
            <button
              type="submit"
              disabled={createRating.isPending}
              className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer disabled:opacity-50"
            >
              {createRating.isPending ? 'جاري الإرسال...' : 'إرسال التقييم'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
