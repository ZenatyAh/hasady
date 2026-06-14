'use client';

import React from 'react';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { OrderTrackingStepper, TrackingStatus } from '@/components/customer/OrderTrackingStepper';
import Link from 'next/link';

export default function CustomerOrderTrackingPage() {
  const { isReady } = useAuthGuard();

  // Dummy data for the tracking page
  const orderDetails = {
    id: '#102394',
    date: '14/06/2026',
    status: 'PREPARING' as TrackingStatus,
    items: [
      { name: 'طماطم بلدي', quantity: 2, price: 45 },
      { name: 'خيار طازج', quantity: 1, price: 30 },
    ],
    total: 130,
    deliveryAddress: 'الرياض, الملقا, الشارع الأول',
  };

  if (!isReady) {
    return null;
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="bg-surface-green rounded-[2.5rem] p-6 md:p-10 text-right shadow-sm border border-border-light flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">تتبع الطلب</h1>
          <p className="text-sm text-[#4c6a56] leading-relaxed">الطلب رقم {orderDetails.id}</p>
        </div>
        <Link href="/customer/orders">
          <button className="bg-white border border-border-light text-text-muted hover:text-primary hover:border-primary px-4 py-2 rounded-xl text-sm font-bold transition">
            عودة للطلبات
          </button>
        </Link>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-sm border border-border-light">
        <OrderTrackingStepper currentStatus={orderDetails.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-border-light space-y-4">
          <h2 className="text-lg font-bold text-foreground border-b border-border-light pb-3">
            تفاصيل المنتجات
          </h2>
          <div className="space-y-3">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span className="text-text-muted">
                  {item.quantity}x {item.name}
                </span>
                <span className="font-bold text-foreground">{item.price * item.quantity} ريال</span>
              </div>
            ))}
            <div className="pt-3 border-t border-border-light flex justify-between items-center text-base">
              <span className="font-bold text-foreground">الإجمالي (مع التوصيل)</span>
              <span className="font-extrabold text-primary">{orderDetails.total} ريال</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-border-light space-y-4">
          <h2 className="text-lg font-bold text-foreground border-b border-border-light pb-3">
            عنوان التوصيل
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">{orderDetails.deliveryAddress}</p>
          <div className="pt-4 mt-4 border-t border-border-light text-center">
            <p className="text-xs text-text-muted">هل تواجه مشكلة مع الطلب؟</p>
            <Link href="/customer/support">
              <button className="mt-2 text-primary text-sm font-bold hover:underline">
                تواصل مع الدعم الفني
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
