'use client';

import React, { useState } from 'react';
import { CartItem } from '@/components/customer/CartItem';
import { CheckoutSummary } from '@/components/customer/CheckoutSummary';
import Link from 'next/link';

export default function CartPage() {
  const [items, setItems] = useState([
    {
      id: '1',
      name: 'طماطم بلدي',
      farmName: 'مزرعة القصيم',
      price: 45,
      quantity: 2,
      imageUrl: '/images/placeholder-crop.png',
    },
    {
      id: '2',
      name: 'خيار طازج',
      farmName: 'مزرعة الوفاء',
      price: 30,
      quantity: 1,
      imageUrl: '/images/placeholder-crop.png',
    },
  ]);

  const handleIncrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecrease = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 0 ? 25 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="space-y-8">
      <div className="bg-surface-green rounded-[2.5rem] p-6 md:p-10 text-right shadow-sm border border-border-light">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-2">سلة المشتريات</h1>
        <p className="text-sm text-[#4c6a56] leading-relaxed">
          راجع محاصيلك قبل إتمام الطلب، يمكنك تعديل الكميات أو إزالة المنتجات.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-dashed border-border-light space-y-4">
          <span className="text-5xl">🛒</span>
          <h2 className="text-xl font-bold text-foreground">السلة فارغة</h2>
          <p className="text-sm text-text-muted">لم تقم بإضافة أي محاصيل إلى سلة المشتريات بعد.</p>
          <Link href="/customer">
            <button className="mt-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition">
              تصفح المحاصيل
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                {...item}
                onIncrease={handleIncrease}
                onDecrease={handleDecrease}
                onRemove={handleRemove}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <CheckoutSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              buttonText="متابعة للدفع"
              buttonHref="/customer/checkout"
            />
          </div>
        </div>
      )}
    </div>
  );
}
