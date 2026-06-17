'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
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
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-[#f0ebde] rounded-3xl p-8 text-center space-y-4 shadow-sm">
        <h2 className="text-lg font-bold text-[#111111]">تعذر تحميل الصفحة</h2>
        <p className="text-sm text-[#666666] leading-relaxed">
          حدث خطأ أثناء تحميل هذا القسم. يمكنك إعادة المحاولة أو العودة للرئيسية.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-[#265C38] px-5 py-2.5 text-sm font-bold text-white cursor-pointer"
          >
            إعادة المحاولة
          </button>
          <Link
            href="/"
            className="rounded-xl border border-[#f0ebde] px-5 py-2.5 text-sm font-bold text-[#265C38]"
          >
            الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
