// src/app/merchant/profile/support/page.tsx

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function ContactSupportPage() {
  const router = useRouter();
  const { isReady } = useAuthGuard();

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  if (!isReady) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('يرجى كتابة رسالتك قبل الإرسال');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('تم إرسال رسالتك لفريق الدعم الفني بنجاح، سنقوم بالرد عليك قريباً');
      setMessage('');
      setTimeout(() => {
        router.push('/merchant/profile');
      }, 1500);
    }, 900);
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="تواصل معنا" backHref="/merchant/profile" />

        <div className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6 text-center">
          {/* Support Vector Illustration */}
          <div className="flex justify-center py-2">
            <svg
              width="220"
              height="150"
              viewBox="0 0 220 150"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Blob */}
              <circle cx="110" cy="75" r="60" fill="#e8f1eb" opacity="0.7" />
              {/* Desk */}
              <path d="M40 110 H180 V115 H40 Z" fill="#265C38" />
              <path d="M60 115 V140 H65 V115 Z" fill="#265C38" />
              <path d="M155 115 V140 H160 V115 Z" fill="#265C38" />
              {/* Monitor */}
              <rect x="90" y="45" width="40" height="30" rx="4" fill="#333333" />
              <rect x="94" y="49" width="32" height="22" fill="#fafafa" />
              {/* Screen Details */}
              <rect x="97" y="52" width="20" height="3" rx="1.5" fill="#265C38" />
              <circle cx="120" cy="53.5" r="1.5" fill="#4ade80" />
              {/* Stand */}
              <path d="M105 75 L102 95 H118 L115 75 Z" fill="#4b5563" />
              <rect x="98" y="95" width="24" height="4" rx="2" fill="#333333" />
              {/* Plant */}
              <rect x="45" y="90" width="10" height="20" rx="3" fill="#666666" />
              <path d="M50 90 C45 80 40 85 43 70 C48 60 52 75 50 90 Z" fill="#265C38" />
              <path d="M50 90 C55 80 60 85 57 70 C52 60 48 75 50 90 Z" fill="#265C38" />
              {/* Sitting Person Silhouette */}
              <circle cx="148" cy="50" r="10" fill="#374151" />
              <path d="M138 75 C138 65 158 65 158 75 V110 H138 Z" fill="#4b5563" />
              {/* Chair Backrest */}
              <path d="M158 85 H166 V115 H158 Z" fill="#1f2937" />
            </svg>
          </div>

          {/* Heading & Sub */}
          <div className="space-y-2">
            <h2 className="text-base font-bold text-[#111111]">نحن هنا من أجلك</h2>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm mx-auto">
              لا تتردد في التواصل معنا! راحتك تهمنا، وخطوتك الأولى تبدأ هنا. نحن دائما بجانبك لجعل
              كل شيء أسهل وأسرع.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">تواصل معنا</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="الرسالة التي تريد إرسالها إلينا لا تترد في التواصل معنا"
                rows={4}
                className="w-full rounded-2xl border border-[#e0e0e0] bg-white p-4 text-sm text-[#333333] outline-none transition focus:border-[#265C38] resize-none"
              />
            </div>

            {success && (
              <div className="rounded-xl bg-emerald-50 p-3.5 text-center text-xs text-emerald-600 border border-emerald-100 animate-fade-in">
                {success}
              </div>
            )}

            {/* Submit */}
            <div className="pt-2 border-t border-[#f0ebde]/55">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold rounded-2xl transition duration-150 shadow-md shadow-[#163f24]/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
