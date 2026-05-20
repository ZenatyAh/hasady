'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { register } from '@/services/api/auth';
import { AuthLogo } from '@/components/ui/AuthLogo';
import { useAuthStore } from '@/lib/store';

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

// ─── Validation ───────────────────────────────────────────────────────────────

const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'الاسم بالكامل مطلوب')
    .min(3, 'يجب أن يحتوي الاسم على 3 أحرف على الأقل'),
  phone: z
    .string()
    .min(1, 'رقم الهاتف مطلوب')
    .length(10, 'يجب أن يتكون رقم الهاتف من 10 أرقام')
    .regex(/^\d+$/, 'رقم الهاتف يجب أن يحتوي على أرقام فقط')
    .startsWith('05', 'يجب أن يبدأ رقم الهاتف ب 05'),
  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

interface FormErrors {
  name?: string;
  phone?: string;
  password?: string;
  general?: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SignupPage() {
  const router = useRouter();
  const setPendingOtp = useAuthStore((state) => state.setPendingOtp);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = signupSchema.safeParse({ name, phone, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        phone: fieldErrors.phone?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    try {
      setLoading(true);
      const res = await register({ name: name.trim(), phone, password });

      /**
       * ⚡ Backend integration point:
       *   - Save res.token to a cookie / localStorage / auth context
       *   - Redirect to the dashboard or OTP verification screen
       *
       * Example:
       *   document.cookie = `token=${res.token}; path=/`;
       *   router.push('/dashboard');
       */
      console.log('Registration successful', res);
      setPendingOtp(phone, 'register');
      router.push('/confirm');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'حدث خطأ غير متوقع، يرجى المحاولة مجدداً';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  const eyeIconClass = `h-5 w-5 ${showPassword ? 'text-[#265C38]' : 'text-gray-400'}`;

  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center bg-white px-6 pt-8 pb-10">
      <div className="w-full max-w-sm space-y-8">
        <AuthLogo />

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111111]">سجل الآن مجاناً!</h1>
          <p className="mt-2 text-sm text-[#888888]">
            أدخل البيانات التالية لإنشاء حساب جديد، إبدء الآن انه مجاني
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full name */}
          <Input
            id="signup-name"
            label="الإسم بالكامل"
            type="text"
            placeholder="محمـد علي إسماعيل"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          {/* Phone number */}
          <Input
            id="signup-phone"
            label="رقم الهاتف"
            type="tel"
            placeholder="0597450057"
            autoComplete="tel"
            inputMode="numeric"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            error={errors.phone}
            dir="ltr"
            className="text-right"
          />

          {/* Password */}
          <Input
            id="signup-password"
            label="كلمة المرور"
            type={showPassword ? 'text' : 'password'}
            placeholder="******************"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            dir="ltr"
            className="text-right"
            onIconClick={() => setShowPassword((prev) => !prev)}
            icon={
              showPassword ? (
                <EyeOpenIcon className={eyeIconClass} />
              ) : (
                <EyeClosedIcon className={eyeIconClass} />
              )
            }
          />

          {/* General error */}
          {errors.general && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {errors.general}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <Button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 text-base"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  جاري التسجيل...
                </span>
              ) : (
                'تسجيل مستخدم جديد'
              )}
            </Button>
          </div>

          {/* Terms notice */}
          <p className="text-center text-xs text-[#888888] leading-relaxed">
            بالضغط على{' '}
            <span className="font-semibold text-[#111111] underline">تسجيل مستخدم جديد</span> فأنت
            توافق على{' '}
            <Link
              href="/terms"
              className="font-semibold text-[#111111] underline hover:text-[#265C38]"
            >
              سياسة الاستخدام والخصوصية
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
