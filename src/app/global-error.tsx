'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border border-[#f0ebde] rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <h1 className="text-lg font-bold text-[#111111]">تعذر تحميل الصفحة</h1>
          <p className="text-sm text-[#666666] leading-relaxed">
            حدث خطأ غير متوقع أثناء عرض المحتوى. جرّب إعادة التحميل أو العودة للصفحة السابقة.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-xl bg-[#265C38] px-5 py-2.5 text-sm font-bold text-white cursor-pointer"
            >
              إعادة المحاولة
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '/';
                }
              }}
              className="rounded-xl border border-[#f0ebde] px-5 py-2.5 text-sm font-bold text-[#265C38] cursor-pointer"
            >
              رجوع
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
