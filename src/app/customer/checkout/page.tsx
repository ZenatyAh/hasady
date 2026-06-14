'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { CheckoutSummary } from '@/components/customer/CheckoutSummary';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'CASH'>('CARD');

  // Dummy values for the summary
  const subtotal = 105;
  const deliveryFee = 25;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    // Navigate to a success page or order tracking directly
    router.push('/customer/orders/track');
  };

  return (
    <div className="space-y-8">
      <div className="bg-surface-green rounded-[2.5rem] p-6 md:p-10 text-right shadow-sm border border-border-light">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">إتمام الطلب</h1>
        <p className="text-sm text-[#4c6a56] leading-relaxed">
          الرجاء إدخال تفاصيل التوصيل واختيار طريقة الدفع المناسبة لك.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-border-light space-y-4">
            <h2 className="text-xl font-bold text-foreground border-b border-border-light pb-3">
              عنوان التوصيل
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <Input label="المدينة" placeholder="مثال: الرياض" />
              <Input label="الحي" placeholder="مثال: الملقا" />
              <div className="md:col-span-2">
                <Input label="الشارع ورقم المبنى" placeholder="الشارع، رقم المبنى، أقرب معلم" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-border-light space-y-4">
            <h2 className="text-xl font-bold text-foreground border-b border-border-light pb-3">
              طريقة الدفع
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentMethod === 'CARD'
                    ? 'border-primary bg-surface-green text-primary'
                    : 'border-border-light text-text-muted hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">💳</span>
                <span className="font-bold text-sm">البطاقة البنكية</span>
              </button>
              <button
                onClick={() => setPaymentMethod('CASH')}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                  paymentMethod === 'CASH'
                    ? 'border-primary bg-surface-green text-primary'
                    : 'border-border-light text-text-muted hover:border-primary/50'
                }`}
              >
                <span className="text-2xl">💵</span>
                <span className="font-bold text-sm">الدفع عند الاستلام</span>
              </button>
            </div>

            {paymentMethod === 'CARD' && (
              <div className="mt-4 p-4 bg-surface-green/50 rounded-xl space-y-3">
                <Input label="رقم البطاقة" placeholder="0000 0000 0000 0000" />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="تاريخ الانتهاء" placeholder="MM/YY" />
                  <Input label="رمز التحقق (CVV)" placeholder="123" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <CheckoutSummary
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            buttonText="تأكيد الطلب"
            onButtonClick={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}
