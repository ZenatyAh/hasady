import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AuthLogo } from '@/components/ui/AuthLogo';

// ─── SVG Icons ───────────────────────────────────────────────────────────────

function PartyPopperIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5.8 11.3 2 22l10.7-3.79" />
      <path d="M4 3h.01" />
      <path d="M22 8h.01" />
      <path d="M15 2h.01" />
      <path d="M22 20h.01" />
      <path d="m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12v0c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10" />
      <path d="m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11v0c-.11.7-.72 1.22-1.43 1.22H17" />
      <path d="m11 2 .33.82c.34.86-.2 1.82-1.11 1.98v0C9.52 4.91 9 5.52 9 6.23V7" />
      <path d="M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResetSuccessPage() {
  return (
    <div dir="rtl" className="flex min-h-screen flex-col items-center bg-[#fdfcfa] px-6 pt-8 pb-10">
      <div className="flex w-full max-w-sm flex-col items-center space-y-8 text-center">
        <AuthLogo />

        {/* ── Icon & Text ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center space-y-4">
          <div className="mb-2">
            <PartyPopperIcon className="h-24 w-24 text-[#265C38]" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111]">تمت العملية!</h1>
          <p className="text-sm leading-relaxed text-[#888888]">
            لقد تم تغيير كلمة مرور حسابك بنجاح ، يمكنك الان العودة وتسجيل الدخول من جديد!
          </p>
        </div>

        {/* ── Action ───────────────────────────────────────────────────────── */}
        <div className="w-full space-y-4">
          <Link href="/login" className="block">
            <Button className="w-full py-4 text-base">تسجيل دخول</Button>
          </Link>

          <div className="pt-2">
            <Link
              href="/terms"
              className="text-xs font-medium text-[#111111] transition hover:text-[#265C38] hover:underline"
            >
              تصفح سياسات الاستخدام والخصوصية
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
