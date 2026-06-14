import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="absolute top-0 z-50 w-full px-6 py-4 sm:px-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/onboard4.svg"
            alt="شعار محاصيل"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
          <span className="text-2xl font-bold text-white drop-shadow-md">محاصيل</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="rounded-2xl px-4 py-2 font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/signup"
            className="rounded-2xl bg-white px-5 py-2 font-semibold text-[#265C38] shadow-lg transition hover:bg-[#f8fdf7]"
          >
            حساب جديد
          </Link>
        </div>
      </div>
    </header>
  );
}
