'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { resetPassword } from '@/services/api/auth';
import { useAuthStore } from '@/lib/store';
import { useGuestGuard } from '@/lib/use-guest-guard';

// ─── Eye icons ────────────────────────────────────────────────────────────────

function EyeOpenIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function PasswordIcon({ className }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-2xl bg-[#e8f1eb] ${className}`}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect
          x="12"
          y="16"
          width="24"
          height="16"
          rx="4"
          stroke="#265C38"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="24" r="1.5" fill="#265C38" />
        <path
          d="M17 21L19 27M19 21L17 27"
          stroke="#265C38"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <circle cx="24" cy="24" r="1.5" fill="#265C38" />
        <path
          d="M23 21L25 27M25 21L23 27"
          stroke="#265C38"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <circle cx="30" cy="24" r="1.5" fill="#265C38" />
        <path
          d="M29 21L31 27M31 21L29 27"
          stroke="#265C38"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

const resetSchema = z
  .object({
    password: z.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
    confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResetPasswordPage() {
  const { isReady } = useGuestGuard();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const pendingPhone = useAuthStore((state) => state.pendingPhone);
  const otpIntent = useAuthStore((state) => state.otpIntent);
  const clearPendingOtp = useAuthStore((state) => state.clearPendingOtp);
  const phone = pendingPhone ?? '';
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (!hasHydrated) return;

    if (!phone || otpIntent !== 'reset') {
      router.replace('/forgot-password');
    }
  }, [hasHydrated, otpIntent, phone, router]);

  if (!isReady) {
    return null;
  }

  const validate = () => {
    const result = resetSchema.safeParse({ password, confirmPassword });
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    setErrors({
      password: fieldErrors.password?.[0],
      confirmPassword: fieldErrors.confirmPassword?.[0],
    });
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;
    if (!phone) {
      setErrors({ general: 'رقم الهاتف غير متوفر، يرجى إعادة المحاولة' });
      return;
    }

    try {
      setLoading(true);
      await resetPassword({ phone, password });

      clearPendingOtp();
      router.push('/reset-success');
    } catch (err: unknown) {
      setErrors({
        general: err instanceof Error ? err.message : 'حدث خطأ غير متوقع',
      });
    } finally {
      setLoading(false);
    }
  };

  const getEyeIconClass = (show: boolean) => `h-5 w-5 ${show ? 'text-[#265C38]' : 'text-gray-400'}`;

  if (!hasHydrated || !phone || otpIntent !== 'reset') {
    return null;
  }

  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center bg-[#fdfcfa] px-6 pt-8 pb-10">
      <div className="flex w-full max-w-sm flex-col items-center space-y-8">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center">
          <PasswordIcon className="h-24 w-24 mb-6" />
          <h1 className="text-2xl font-bold text-[#111111]">ادخل كلمة المرور الجديدة!</h1>
          <p className="mt-2 text-sm text-[#888888] leading-relaxed">
            قم بإدخال كلمة المرور الجديدة ويجب ان تكون مكونة من 8 خانات!
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <Input
            label="كلمة المرور الجديدة"
            type={showPassword ? 'text' : 'password'}
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            dir="ltr"
            className="text-right"
            onIconClick={() => setShowPassword((prev) => !prev)}
            icon={
              showPassword ? (
                <EyeOpenIcon className={getEyeIconClass(showPassword)} />
              ) : (
                <EyeClosedIcon className={getEyeIconClass(showPassword)} />
              )
            }
          />

          <Input
            label="تأكيد كلمة المرور"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="******************"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            dir="ltr"
            className="text-right"
            onIconClick={() => setShowConfirmPassword((prev) => !prev)}
            icon={
              showConfirmPassword ? (
                <EyeOpenIcon className={getEyeIconClass(showConfirmPassword)} />
              ) : (
                <EyeClosedIcon className={getEyeIconClass(showConfirmPassword)} />
              )
            }
          />

          {errors.general && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
              {errors.general}
            </div>
          )}

          <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
            </Button>
          </div>

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
