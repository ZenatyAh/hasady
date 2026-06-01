// src/app/customer/profile/support/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CustomerProfileSupportPage() {
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/customer/profile');
      }, 1000);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 shadow-sm text-right space-y-6">
      <div className="flex items-center justify-between border-b border-[#f0ebde]/45 pb-3">
        <h1 className="text-base font-extrabold text-[#111111]">📞 الدعم الفني</h1>
        <Link href="/customer/profile" className="text-xs font-bold text-[#265C38] hover:underline">
          عودة
        </Link>
      </div>

      {success && (
        <div className="bg-green-50 text-green-600 rounded-xl p-3 text-xs font-bold">
          ✓ تم إرسال تذكرتك بنجاح، سنقوم بالرد عليك خلال 24 ساعة...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#333333]">عنوان الاستفسار</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="مثال: مشكلة في الدفع"
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-[#333333]">تفاصيل الرسالة</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="يرجى كتابة التفاصيل هنا..."
            rows={4}
            className="w-full bg-[#faf8f5] text-[#111111] py-3 px-4 rounded-xl border border-[#f0ebde] outline-none text-xs focus:border-[#265C38] transition"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
        </button>
      </form>
    </div>
  );
}
