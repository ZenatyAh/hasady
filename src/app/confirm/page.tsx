'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { verifyOtp } from '@/services/api/auth';
import { useAuthStore } from '@/lib/store';
import { useGuestGuard } from '@/lib/use-guest-guard';

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function OtpIcon({ className }: { className?: string }) {
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
          d="M16 10C16 8.89543 16.8954 8 18 8H30C31.1046 8 32 8.89543 32 10V38C32 39.1046 31.1046 40 30 40H18C16.8954 40 16 39.1046 16 38V10Z"
          fill="#265C38"
        />
        <path
          d="M20 14H28M24 36H24.02"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="24"
          y="23"
          fill="white"
          fontSize="10"
          fontFamily="sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          OTP
        </text>
        <path
          d="M30 26L32.25 24.5C32.25 24.5 35 25.5 37 28.5C37 32 34 36.5 30 38C26 36.5 23 32 23 28.5C25 25.5 27.75 24.5 27.75 24.5L30 26Z"
          fill="white"
        />
        <path
          d="M30 27L31.5 25.5C31.5 25.5 33.5 26.5 35 29C35 32 32.5 35 30 36C27.5 35 25 32 25 29C26.5 26.5 28.5 25.5 28.5 25.5L30 27Z"
          fill="#265C38"
        />
        <path
          d="M27.5 30.5L29 32L32.5 28.5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ConfirmPage() {
  const { isReady } = useGuestGuard();
  const router = useRouter();

  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(59);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const pendingPhone = useAuthStore((state) => state.pendingPhone);
  const otpIntent = useAuthStore((state) => state.otpIntent);
  const pendingRole = useAuthStore((state) => state.pendingRole);
  const clearPendingOtp = useAuthStore((state) => state.clearPendingOtp);
  const setAuthSession = useAuthStore((state) => state.setAuthSession);
  const phone = pendingPhone ?? '';
  const activeOtpIntent = otpIntent ?? 'register';

  useEffect(() => {
    if (!hasHydrated) return;

    if (!phone) {
      router.replace(activeOtpIntent === 'reset' ? '/forgot-password' : '/signup');
    }
  }, [activeOtpIntent, hasHydrated, phone, router]);

  useEffect(() => {
    if (!hasHydrated || !phone || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [hasHydrated, phone, timeLeft]);

  if (!isReady) {
    return null;
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    // Take only the last character if they somehow type multiple (should be prevented by maxLength=1)
    const char = value.slice(-1);

    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newCode[i] = pastedData[i];
    }
    setCode(newCode);
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const otpCode = code.join('');
    if (!phone) {
      setError('رقم الهاتف غير متوفر، يرجى إعادة المحاولة');
      return;
    }

    if (otpCode.length < 6) {
      setError('يرجى إدخال رمز التحقق بالكامل');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp({ phone, code: otpCode, role: pendingRole ?? undefined });

      if (activeOtpIntent === 'reset') {
        router.push('/reset-password');
      } else {
        const willSetAuthSession = Boolean(res.token && res.user);
        if (willSetAuthSession && res.token && res.user) {
          setAuthSession(res.token, res.user);
        }
        clearPendingOtp();
        if (willSetAuthSession) {
          const target = res.user?.role === 'BUYER' ? '/customer' : '/merchant';
          router.push(target);
        } else {
          router.push('/success');
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!hasHydrated || !phone) {
    return null;
  }

  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center bg-[#fdfcfa] px-6 pt-8 pb-10">
      <div className="flex w-full max-w-sm flex-col items-center space-y-8">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center">
          <OtpIcon className="h-20 w-20 mb-6" />
          <h1 className="text-2xl font-bold text-[#111111]">أدخل رمز التحقق</h1>
          <p className="mt-2 text-sm text-[#888888]">
            لقد قمنا بإرسال رمز التأكيد لرقم الهاتف التالي
          </p>
          <p className="mt-1 text-base font-medium text-[#111111]" dir="ltr">
            {phone}
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex justify-center gap-2" dir="ltr">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                aria-label={`رقم ${index + 1} من رمز التحقق`}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'otp-error' : undefined}
                maxLength={1} // Only 1 digit per box to prevent overflow/hiding
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`h-14 w-12 rounded-xl border text-center text-xl font-semibold transition-colors focus:border-[#265C38] focus:outline-none ${
                  digit ? 'border-[#265C38] bg-[#fdfcfa]' : 'border-[#e0e0e0] bg-white'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-semibold text-[#111111]">{formatTime(timeLeft)}</span>
            <p className="text-sm text-[#888888]">
              لم تستلم رمزاً ؟{' '}
              <button
                type="button"
                disabled={timeLeft > 0}
                className={`font-semibold transition-colors ${
                  timeLeft > 0 ? 'text-gray-400' : 'text-[#265C38] hover:underline'
                }`}
                onClick={() => setTimeLeft(59)}
              >
                طلب رمز جديد!
              </button>
            </p>
          </div>

          {error && (
            <div
              id="otp-error"
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-center"
            >
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جاري التأكيد...' : 'تأكيد الحساب'}
          </Button>

          {/* Bottom Link */}
          <div className="pt-6 text-center">
            <p className="text-sm text-[#111111]">
              هل لديك حساب بالفعل ؟{' '}
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
