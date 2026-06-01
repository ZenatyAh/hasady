// src/app/customer/orders/[id]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getOrderDetail, PurchaseOrder } from '@/services/api/orders';
import { useAuthStore } from '@/lib/store';

export default function CustomerOrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const token = useAuthStore((state) => state.token);

  const [order, setOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulation states
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [deliveryStep, setDeliveryStep] = useState(2); // 1 = Placed, 2 = Accepted & Unpaid, 3 = Paid & Shipping, 4 = Delivered

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const found = await getOrderDetail(id, token);
        setOrder(found);
        if (found) {
          // Adjust simulated step based on status
          if (found.status === 'PENDING') {
            setDeliveryStep(1);
          } else if (found.status === 'REJECTED') {
            setDeliveryStep(1);
          } else if (found.status === 'ACCEPTED') {
            // Check if already marked paid in session storage
            const paidKey = `order-paid-${found.id}`;
            const hasPaid = typeof window !== 'undefined' && sessionStorage.getItem(paidKey) === 'true';
            setIsPaid(hasPaid);
            setDeliveryStep(hasPaid ? 4 : 2);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadOrder();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="h-10 w-10 border-4 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
        <span className="text-sm text-gray-500 font-bold">جاري تحميل تفاصيل الطلب...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-bold text-[#111111]">الطلب غير موجود</h2>
        <p className="text-sm text-gray-500">لم نتمكن من العثور على سجل الطلب المحدد.</p>
        <Link href="/customer/orders">
          <button className="bg-[#265C38] text-white font-bold px-6 py-2.5 rounded-xl mt-4">
            العودة لقائمة الطلبات
          </button>
        </Link>
      </div>
    );
  }

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setIsPaid(true);
      setDeliveryStep(4); // Advance timeline to completed/delivered
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`order-paid-${order.id}`, 'true');
      }
      setShowPaymentModal(false);
    }, 1500);
  };

  // Timeline tracking list helper
  const steps = [
    { label: 'تم تقديم الطلب', desc: 'بانتظار موافقة البائع', num: 1 },
    { label: 'تم قبول العرض', desc: 'الطلب بانتظار الدفع', num: 2 },
    { label: 'قيد الشحن والتجهيز', desc: 'السائق يستعد للتحرك', num: 3 },
    { label: 'تم التوصيل بنجاح', desc: 'تم استلام المنتج وتأكيد الصفقة', num: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/customer/orders" className="inline-flex items-center gap-2 text-sm font-bold text-[#265C38] hover:underline self-start">
        <span>← العودة لقائمة طلباتك</span>
      </Link>

      {/* Header and Basic Card */}
      <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
        <div className="space-y-1">
          <span className="text-[10px] text-gray-400 font-semibold block">معرف الطلب: #{order.id}</span>
          <h1 className="text-xl font-extrabold text-[#111111]">{order.cropName}</h1>
          <p className="text-xs text-gray-400">تاريخ الطلب: {order.createdAt}</p>
        </div>

        <div className="flex flex-col sm:items-end text-right sm:text-left gap-1">
          <span className="text-xs text-gray-400 font-semibold">إجمالي القيمة</span>
          <span className="text-lg font-extrabold text-[#265C38]">{order.offeredPrice} ريال سعودي</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Timeline progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 shadow-sm text-right space-y-8">
            <h3 className="text-base font-bold text-[#265C38] border-b border-[#f0ebde]/45 pb-3">حالة الشحنة والتتبع</h3>

            {order.status === 'REJECTED' ? (
              <div className="bg-red-50 text-red-600 rounded-2xl p-5 text-center text-xs font-bold border border-red-200/50">
                🚨 تم رفض هذا الطلب من قبل البائع / صاحب المزرعة. يمكنك تصفح محاصيل أخرى.
              </div>
            ) : (
              /* Vertical Timeline */
              <div className="relative border-r-2 border-[#e8f1eb] mr-4 pr-6 space-y-8">
                {steps.map((st) => {
                  const isDone = deliveryStep >= st.num;
                  const isCurrent = deliveryStep === st.num;
                  return (
                    <div key={st.num} className="relative">
                      {/* Icon Indicator dot */}
                      <span
                        className={`absolute -right-[33px] top-1 flex items-center justify-center h-4.5 w-4.5 rounded-full border-2 transition ${
                          isDone
                            ? 'bg-[#265C38] border-[#265C38]'
                            : 'bg-white border-[#f0ebde]'
                        }`}
                      >
                        {isDone && (
                          <svg className="h-2 w-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>

                      <div className="space-y-1">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-[#265C38]' : isDone ? 'text-[#333333]' : 'text-gray-400'}`}>
                          {st.label}
                        </h4>
                        <p className="text-xs text-gray-400">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Payment Card / Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-6 shadow-sm space-y-6 text-right">
            <h3 className="text-base font-bold text-[#265C38] border-b border-[#f0ebde]/45 pb-3">الإجراءات المالية</h3>

            {order.status === 'PENDING' && (
              <div className="bg-yellow-50 text-yellow-600 rounded-2xl p-5 text-center text-xs leading-relaxed font-bold border border-yellow-200/50">
                ⏳ بانتظار قبول الطلب من المزارع. بمجرد قبول المزارع للطلب، ستتمكن من دفع القيمة وتتبع التوصيل.
              </div>
            )}

            {order.status === 'ACCEPTED' && !isPaid && (
              <div className="space-y-4">
                <p className="text-xs text-[#888888] leading-relaxed">
                  تم قبول طلبك بنجاح! يرجى إتمام الدفع الفوري لتأكيد شحن المحصول إليك.
                </p>
                <button
                  onClick={handlePayNow}
                  className="w-full bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition shadow-sm cursor-pointer"
                >
                  💳 دفع القيمة الآن (مويسر)
                </button>
              </div>
            )}

            {isPaid && (
              <div className="space-y-4">
                <div className="bg-green-50 text-green-600 rounded-2xl p-4 text-center text-xs font-bold border border-green-200/50">
                  ✅ تم دفع الطلب بنجاح وبانتظار شحن وتأكيد الاستلام.
                </div>

                <Link href={`/customer/reviews/rate?merchantId=farm-1&orderId=${order.id}`} className="block">
                  <button className="w-full bg-[#faf8f5] hover:bg-[#f0ebde] border border-[#f0ebde] text-[#265C38] text-xs font-bold py-3.5 rounded-xl transition cursor-pointer">
                    ⭐️ تقييم الصفقة والتاجر
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Moyasar Payment Gateway Modal Simulation */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn" dir="rtl">
          <div className="bg-white rounded-[2.5rem] border border-[#f0ebde] max-w-sm w-full p-6 text-right space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0ebde]/45 pb-3">
              <h3 className="text-base font-bold text-[#111111]">بوابة دفع مويسر (Moyasar)</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-400 hover:text-black">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400">رقم البطاقة</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full bg-[#faf8f5] text-[#111111] font-mono text-left py-2.5 px-4 rounded-xl border border-[#f0ebde] outline-none"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-gray-400 block">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    defaultValue="12/29"
                    className="w-full bg-[#faf8f5] text-[#111111] text-center py-2.5 rounded-xl border border-[#f0ebde] outline-none"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-1 text-right">
                  <label className="text-xs font-bold text-gray-400 block">رمز التحقق (CVV)</label>
                  <input
                    type="text"
                    defaultValue="123"
                    className="w-full bg-[#faf8f5] text-[#111111] text-center py-2.5 rounded-xl border border-[#f0ebde] outline-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={paymentLoading}
              className="w-full bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              {paymentLoading ? 'جاري التحقق والدفع...' : `تأكيد ودفع ${order.offeredPrice} ريال`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
