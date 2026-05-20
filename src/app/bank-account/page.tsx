import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AuthLogo } from '@/components/ui/AuthLogo';

// ─── Illustration SVG ─────────────────────────────────────────────────────────

function BankIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Background blob */}
      <div className="absolute h-56 w-56 rounded-full bg-[#e8f1eb] opacity-60" />

      <svg
        width="220"
        height="200"
        viewBox="0 0 220 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Phone / card background */}
        <rect x="55" y="30" width="80" height="130" rx="12" fill="#265C38" />
        <rect x="62" y="50" width="66" height="42" rx="6" fill="white" opacity="0.15" />

        {/* Card chip */}
        <rect x="68" y="57" width="14" height="10" rx="2" fill="white" opacity="0.5" />

        {/* Card lines */}
        <rect x="68" y="76" width="40" height="4" rx="2" fill="white" opacity="0.4" />
        <rect x="68" y="84" width="28" height="4" rx="2" fill="white" opacity="0.3" />

        {/* PAY button on phone */}
        <rect x="68" y="102" width="54" height="22" rx="6" fill="#4ade80" />
        <text
          x="95"
          y="117"
          fill="white"
          fontSize="10"
          fontFamily="sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          PAY
        </text>

        {/* Person silhouette */}
        <circle cx="148" cy="60" r="18" fill="#265C38" />
        <path d="M128 130 C128 100 168 100 168 130 L168 160 L128 160 Z" fill="#265C38" />

        {/* Arm holding phone */}
        <path d="M128 110 L100 120" stroke="#265C38" strokeWidth="8" strokeLinecap="round" />

        {/* Dollar coins */}
        <circle cx="170" cy="90" r="14" fill="#4ade80" />
        <text
          x="170"
          y="95"
          fill="white"
          fontSize="12"
          fontFamily="sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          $
        </text>

        <circle cx="190" cy="130" r="12" fill="#86efac" />
        <text
          x="190"
          y="135"
          fill="white"
          fontSize="11"
          fontFamily="sans-serif"
          fontWeight="bold"
          textAnchor="middle"
        >
          $
        </text>

        {/* Check mark badge */}
        <circle cx="62" cy="48" r="10" fill="#4ade80" />
        <path
          d="M57 48 L60 52 L68 44"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Stack of cards/bills at bottom */}
        <rect x="50" y="155" width="50" height="8" rx="2" fill="#d1fae5" />
        <rect x="53" y="150" width="44" height="8" rx="2" fill="#a7f3d0" />
        <rect x="56" y="145" width="38" height="8" rx="2" fill="#6ee7b7" />
      </svg>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BankAccountLandingPage() {
  return (
    <div
      dir="rtl"
      className="flex min-h-screen flex-col items-center justify-between bg-[#fdfcfa] px-6 py-12"
    >
      {/* Top spacer */}
      <div />

      {/* Main content */}
      <div className="flex w-full max-w-sm flex-col items-center space-y-8 text-center">
        <AuthLogo />
        {/* Illustration */}
        <BankIllustration />

        {/* Text */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-[#111111]">أضف حسابك البنكي الآن</h1>
          <p className="text-sm leading-relaxed text-[#888888]">
            لتتمكن من استلام أرباحك بسهولة لدخل، إضافة الحساب البنكي الآن يمكنك أيضاً تخطي هذه
            الخطوة وإضافته لاحقاً عند طلب السحب
          </p>
        </div>

        {/* Actions */}
        <div className="w-full space-y-4">
          <Link href="/bank-account/add" className="block">
            <Button className="w-full py-4 text-base">إضافة حساب الآن</Button>
          </Link>

          <Link
            href="/welcome"
            className="block text-center text-sm font-medium text-[#888888] transition hover:text-[#265C38]"
          >
            تخطي إضافة الحساب
          </Link>
        </div>
      </div>

      {/* Bottom spacer */}
      <div />
    </div>
  );
}
