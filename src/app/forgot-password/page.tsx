'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { recoverPassword } from '@/services/api/auth';
import { useAuthStore } from '@/lib/store';

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function PadlockIcon({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-2xl bg-[#e8f1eb] ${className}`}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17 22V16C17 12.134 20.134 9 24 9C27.866 9 31 12.134 31 16V22"
          stroke="#265C38"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="12"
          y="22"
          width="24"
          height="18"
          rx="4"
          stroke="#265C38"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="31" r="1.5" fill="#265C38" />
        <circle cx="24" cy="31" r="1.5" fill="#265C38" />
        <circle cx="30" cy="31" r="1.5" fill="#265C38" />

        {/* Question mark overlay in bottom right corner */}
        <circle cx="36" cy="36" r="8" fill="#e8f1eb" />
        <path
          d="M36 39.5V38.5M36 36.5C37.1046 36.5 38 35.6046 38 34.5C38 33.3954 37.1046 32.5 36 32.5C34.8954 32.5 34 33.3954 34 34.5"
          stroke="#265C38"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

const recoverSchema = z.object({
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .length(10, 'يجب أن يتكون رقم الهاتف من 10 أرقام')
    .regex(/^\d+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط')
    .startsWith('05', 'يجب أن يبدأ رقم الهاتف ب 05'),
});

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const router = useRouter();
  const setPendingOtp = useAuthStore((state) => state.setPendingOtp);

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; general?: string }>({});

  const validate = () => {
    const result = recoverSchema.safeParse({ phone });
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    setErrors({
      phone: fieldErrors.phone?.[0],
    });
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await recoverPassword({ phone });
      console.log('Recovery request successful', res);

      setPendingOtp(phone, 'reset');
      router.push('/confirm');
    } catch (err: unknown) {
      setErrors({
        general: err instanceof Error ? err.message : 'حدث خطأ غير متوقع',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center bg-[#fdfcfa] px-6 pt-8 pb-10">
      <div className="flex w-full max-w-sm flex-col items-center space-y-8">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center">
          <PadlockIcon className="h-24 w-24 mb-6" />
          <h1 className="text-2xl font-bold text-[#111111]">استعادة كلمة المرور!</h1>
          <p className="mt-2 text-sm text-[#888888]">
            قم بإدخال رقم الهاتف لإستعادة كلمة المرور الخاصة بك!
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <Input
            label="رقم الهاتف"
            type="tel"
            placeholder="0597450057"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            error={errors.phone}
            dir="ltr"
            className="text-right"
          />

          {errors.general && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جاري التحقق...' : 'تحقق'}
          </Button>

          {/* Bottom Link */}
          <div className="pt-6 text-center">
            <p className="text-sm text-[#111111]">
              تذكرت كلمة المرور ؟{' '}
              <Link
                href="/login"
                className="font-semibold text-[#265C38] transition hover:underline"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
