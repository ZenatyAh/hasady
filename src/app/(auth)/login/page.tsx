'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { login } from '@/services/api/auth';
import { useAuthStore } from '@/lib/store';
import { useGuestGuard } from '@/lib/use-guest-guard';

const loginSchema = z.object({
  email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('البريد الإلكتروني غير صالح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export default function LoginPage() {
  const { isReady } = useGuestGuard();
  const router = useRouter();
  const setAuthSession = useAuthStore((state) => state.setAuthSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'BUYER' | 'MERCHANT'>('BUYER');

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  if (!isReady) {
    return null;
  }

  const validate = () => {
    const result = loginSchema.safeParse({ email, password });
    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    setErrors({
      email: fieldErrors.email?.[0],
      password: fieldErrors.password?.[0],
    });
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validate()) return;

    try {
      setLoading(true);
      const res = await login({ email, password, role });
      setAuthSession({ accessToken: res.accessToken, refreshToken: res.refreshToken }, res.user);
      const target = res.user.role === 'MERCHANT' ? '/merchant' : '/customer';
      router.push(target);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'حدث خطأ غير متوقع';
      setErrors({ general: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center bg-[#fdfcfa] px-6 pt-8 pb-10">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111111]">أهلاً بعودتك!</h1>
          <p className="mt-2 text-sm text-[#888888]">
            أدخل البيانات التالية لتتمكن من الوصول إلى حسابك
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Role Selector */}
            <div className="flex rounded-lg bg-[#f0ebde] p-1">
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                className={`flex-1 rounded-md py-2 text-center text-sm font-semibold transition ${
                  role === 'BUYER'
                    ? 'bg-[#265C38] text-white shadow-sm'
                    : 'text-[#888888] hover:text-[#111111]'
                }`}
              >
                مشتري (مستهلك)
              </button>
              <button
                type="button"
                onClick={() => setRole('MERCHANT')}
                className={`flex-1 rounded-md py-2 text-center text-sm font-semibold transition ${
                  role === 'MERCHANT'
                    ? 'bg-[#265C38] text-white shadow-sm'
                    : 'text-[#888888] hover:text-[#111111]'
                }`}
              >
                تاجر (مزارع)
              </button>
            </div>

            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="user@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              dir="ltr"
              className="text-right"
            />

            <Input
              label="كلمة المرور"
              type={showPassword ? 'text' : 'password'}
              placeholder="**************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              dir="ltr" // Passwords are typed LTR
              className="text-right"
              onIconClick={() => setShowPassword(!showPassword)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-5 w-5 ${showPassword ? 'text-[#265C38]' : 'text-gray-400'}`}
                >
                  {showPassword ? (
                    <>
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </>
                  )}
                </svg>
              }
            />
          </div>

          <div className="flex items-center">
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-[#111111] hover:underline"
            >
              هل نسيت كلمة المرور ؟
            </Link>
          </div>

          {errors.general && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{errors.general}</div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>

          <p className="text-center text-sm text-[#888888]">
            ليس لديك حساب؟{' '}
            <Link
              href="/signup"
              className="font-semibold text-[#111111] underline hover:text-[#265C38]"
            >
              إنشاء حساب جديد
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
