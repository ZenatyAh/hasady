// src/app/merchant/orders/[id]/page.tsx

'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { getOrderDetail, acceptOrder, PurchaseOrder } from '@/services/api/orders';
import { PageHeader } from '@/components/merchant/PageHeader';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isReady) return;

    getOrderDetail(id, token)
      .then((data) => {
        setOrder(data);
      })
      .catch((err) => {
        console.error('Failed to load order detail:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, id, token]);

  const handleConfirmAccept = async () => {
    if (!token || !order) return;
    setSubmitting(true);
    try {
      await acceptOrder(order.id, token);
      setIsModalOpen(false);
      router.push('/merchant/orders');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء قبول الطلب');
      setIsModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isReady) {
    return null;
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      if (i <= floorRating) {
        stars.push(
          <span key={i} className="text-yellow-500 text-sm">
            ★
          </span>
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300 text-sm">
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      {/* Centered responsive container */}
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="تأكيد القبول" backHref="/merchant/orders" />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-gray-400">جاري تحميل تفاصيل الطلب...</span>
          </div>
        ) : !order ? (
          <div className="text-center py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm text-sm text-gray-400 font-medium">
            الطلب غير موجود في النظام
          </div>
        ) : (
          <div className="bg-[#fdfcfa] p-5 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
            {/* Crop Info Header */}
            <div className="border-b border-[#f0ebde]/55 pb-4">
              <h2 className="text-lg font-bold text-[#111111]">{order.cropName}</h2>
              <p className="text-sm text-gray-400 leading-relaxed mt-1">{order.description}</p>
            </div>

            {/* Buyer Card */}
            <div className="relative rounded-[2rem] border border-[#e0e0e0] bg-[#faf8f5]/45 p-5 flex items-start gap-4">
              {/* Buyer ID Label Bottom Left */}
              <span className="absolute bottom-4 left-4 text-[10px] text-gray-400 font-mono">
                #{order.buyerId}
              </span>

              {/* Left content: Details */}
              <div className="flex-1 space-y-1.5 text-right">
                <div className="flex items-center gap-1.5 justify-start">
                  <h3 className="text-base font-bold text-[#265C38]">{order.buyerName}</h3>
                  {/* Verified checkmark badge */}
                  <span className="flex items-center justify-center h-4.5 w-4.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px]">
                    ✓
                  </span>
                </div>

                <div className="flex gap-0.5 justify-start">{renderStars(order.buyerRating)}</div>

                <div className="text-xs text-gray-500 font-medium flex items-center justify-start gap-1">
                  <span>رقم الهاتف:</span>
                  <span className="font-mono text-gray-700">{order.buyerPhone}</span>
                </div>
              </div>

              {/* Right content: Avatar */}
              <div className="relative h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-sm ring-1 ring-gray-200 shrink-0 bg-gray-100">
                <Image
                  src="/images/avatar.png"
                  alt={order.buyerName}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Offered Price Label & Explainer */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#111111]">السعر المقدم</label>
              <p className="text-xs text-gray-400 leading-relaxed">
                يرجى مراجعة بيانات المشتري والسعر المطروح بعناية قبل تأكيد القبول. سيتم إشعار
                المشتري فورًا بعد الموافقة، ويمكن التواصل مباشرة من خلال الرقم لمتابعة عملية البيع.
              </p>
            </div>

            {/* Price display container (elegant light green graphic card background) */}
            <div className="relative overflow-hidden rounded-2xl bg-[#e8f1eb]/70 p-6 flex flex-col items-center justify-center border border-[#97cda6]/20">
              {/* Graphic background lines */}
              <svg
                className="absolute bottom-0 right-0 h-16 w-32 text-[#265C38]/10 pointer-events-none"
                viewBox="0 0 100 50"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 40 C30 20, 60 50, 100 30"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 48 C30 28, 60 58, 100 38"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>

              <div className="relative z-10 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-[#265C38] tracking-tight">
                  {order.offeredPrice.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-[#265C38]/85">ريال سعودي</span>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-center text-sm text-red-600 border border-red-100">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4 border-t border-[#f0ebde]/55">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer"
              >
                تأكيد القبول
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
          dir="rtl"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-[#fdfcfa] p-6 shadow-xl border border-[#f0ebde]/45 text-center space-y-6 animate-in fade-in zoom-in duration-200">
            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#265C38]">تأكيد قبول الطلب</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                هل أنت متأكد من قبول الطلب؟ سيتم إشعار المشتري فورًا بعد التأكيد.
              </p>
            </div>

            {/* Buttons Row */}
            <div className="flex gap-4">
              {/* Confirm Button (Left) */}
              <button
                type="button"
                onClick={handleConfirmAccept}
                disabled={submitting}
                className="flex-1 py-3.5 bg-[#265C38] hover:bg-[#1f4f2c] text-white font-bold rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'جاري التأكيد...' : 'تأكيد'}
              </button>

              {/* Cancel Button (Right) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={submitting}
                className="flex-1 py-3.5 bg-[#fbebe8] hover:bg-[#f7d6d0] text-[#d32f2f] font-bold rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
