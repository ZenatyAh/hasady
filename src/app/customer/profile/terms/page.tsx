// src/app/customer/profile/terms/page.tsx

'use client';

import React from 'react';
import Link from 'next/link';

export default function CustomerProfileTermsPage() {
  return (
    <div className="max-w-md mx-auto bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 shadow-sm text-right space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0ebde]/45 pb-3">
        <h1 className="text-base font-extrabold text-[#111111]">📜 الشروط والأحكام</h1>
        <Link href="/customer/profile" className="text-xs font-bold text-[#265C38] hover:underline">
          عودة
        </Link>
      </div>

      <div className="space-y-4 text-xs text-[#666666] leading-relaxed">
        <h3 className="font-bold text-[#333333] text-sm">سياسات الاستخدام لمنصة محاصيل</h3>
        <p>
          مرحباً بك في منصة محاصيل، يرجى قراءة الشروط والأحكام بدقة قبل استخدام التطبيق.
        </p>

        <h4 className="font-bold text-[#333333]">1. الصفقات والبيع الفوري:</h4>
        <p>
          يلتزم المشتري بدفع قيمة المحصول فور تأكيد البائع لقبول الطلب عبر بوابة دفع مويسر الإلكترونية المتاحة في التطبيق.
        </p>

        <h4 className="font-bold text-[#333333]">2. المزايدات والمزادات:</h4>
        <p>
          يعد تقديم المزايدة في المزاد العلني التزاماً مالياً وقانونياً بالدفع في حال فوز السوم، ولا يجوز سحب السوم بعد اعتماده.
        </p>

        <h4 className="font-bold text-[#333333]">3. الشحن والتسليم:</h4>
        <p>
          يتم شحن وتوصيل المحاصيل وفقاً للخيارات المتفق عليها مع السائقين المعتمدين لدى المزرعة.
        </p>
      </div>
    </div>
  );
}
