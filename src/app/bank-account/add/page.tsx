'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addBankAccount } from '@/services/api/auth';

// ─── Validation Schema ────────────────────────────────────────────────────────

const bankAccountSchema = z.object({
  bankName: z
    .string()
    .trim()
    .min(1, 'إسم المصرف مطلوب')
    .min(2, 'يجب أن يحتوي اسم المصرف على حرفين على الأقل'),
  accountHolderName: z
    .string()
    .trim()
    .min(1, 'الإسم الكامل لصاحب الحساب مطلوب')
    .min(3, 'يجب أن يحتوي الاسم على 3 أحرف على الأقل'),
  accountNumber: z
    .string()
    .min(1, 'رقم الحساب مطلوب')
    .min(10, 'يجب أن يتكون رقم الحساب من 10 أرقام على الأقل')
    .regex(/^\d+$/, 'رقم الحساب يجب أن يحتوي على أرقام فقط'),
});

type FormErrors = {
  bankName?: string;
  accountHolderName?: string;
  accountNumber?: string;
  general?: string;
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddBankAccountPage() {
  const router = useRouter();

  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = bankAccountSchema.safeParse({ bankName, accountHolderName, accountNumber });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        bankName: fieldErrors.bankName?.[0],
        accountHolderName: fieldErrors.accountHolderName?.[0],
        accountNumber: fieldErrors.accountNumber?.[0],
      });
      return;
    }

    try {
      setLoading(true);
      const res = await addBankAccount({
        bankName: bankName.trim(),
        accountHolderName: accountHolderName.trim(),
        accountNumber,
      });

      /**
       * ⚡ Backend integration point:
       *   - Save res.accountId to user context / state
       *   - Example: userStore.setBankAccountId(res.accountId);
       */
      console.log('Bank account added', res);
      router.push('/bank-account/success');
    } catch (err: unknown) {
      setErrors({
        general: err instanceof Error ? err.message : 'حدث خطأ غير متوقع، يرجى المحاولة مجدداً',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center bg-[#fdfcfa] px-6 pt-8 pb-10">
      <div className="w-full max-w-sm space-y-8">
        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111111]">إضافة حساب بنكي</h1>
          <p className="mt-2 text-sm text-[#888888]">
            أدخل معلوماتك البنكية بدقة لتتمكن من استلام أرباحك عند السحب
          </p>
        </div>

        {/* ── Form ─────────────────────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Bank Name */}
          <Input
            id="bank-name"
            label="إسم المصرف"
            type="text"
            placeholder="بنك فلسطين"
            autoComplete="organization"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            error={errors.bankName}
          />

          {/* Account Holder Full Name */}
          <Input
            id="account-holder-name"
            label="الإسم الكامل لصاحب الحساب"
            type="text"
            placeholder="محمد علي إسماعيل موسى"
            autoComplete="name"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            error={errors.accountHolderName}
          />

          {/* Account Number */}
          <Input
            id="account-number"
            label="رقم الحساب الكامل"
            type="text"
            placeholder="43563454535353"
            inputMode="numeric"
            autoComplete="off"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
            error={errors.accountNumber}
            dir="ltr"
            className="text-right"
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
              id="add-bank-account-submit"
              type="submit"
              disabled={loading}
              className="w-full py-4 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  جاري الإضافة...
                </span>
              ) : (
                'إضافة الحساب'
              )}
            </Button>
          </div>

          {/* Bottom link */}
          <div className="pt-4 text-center">
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
