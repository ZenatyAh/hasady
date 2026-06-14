import React from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface CheckoutSummaryProps {
  subtotal: number;
  deliveryFee: number;
  total: number;
  buttonText: string;
  buttonHref?: string;
  onButtonClick?: () => void;
}

export function CheckoutSummary({
  subtotal,
  deliveryFee,
  total,
  buttonText,
  buttonHref,
  onButtonClick,
}: CheckoutSummaryProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-border-light space-y-6 sticky top-6">
      <h3 className="text-lg font-bold text-foreground">ملخص الطلب</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center text-text-muted">
          <span>المجموع الفرعي</span>
          <span className="font-bold text-foreground">{subtotal} ريال</span>
        </div>
        <div className="flex justify-between items-center text-text-muted">
          <span>رسوم التوصيل</span>
          <span className="font-bold text-foreground">{deliveryFee} ريال</span>
        </div>
        <div className="pt-3 border-t border-border-light flex justify-between items-center text-base">
          <span className="font-bold text-foreground">الإجمالي</span>
          <span className="font-extrabold text-primary">{total} ريال</span>
        </div>
      </div>

      {buttonHref ? (
        <Link href={buttonHref} className="block">
          <Button variant="primary" size="lg" className="w-full">
            {buttonText}
          </Button>
        </Link>
      ) : (
        <Button variant="primary" size="lg" className="w-full" onClick={onButtonClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
}
