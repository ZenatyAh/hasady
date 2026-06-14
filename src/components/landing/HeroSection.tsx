import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden bg-[#265C38] px-6 pt-24 pb-12 sm:px-10">
      {/* Decorative blurred blob */}
      <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-[#34804c] opacity-50 blur-3xl"></div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div className="space-y-8 text-white z-10">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl drop-shadow-sm">
            منصة محاصيل الإلكترونية، طريقك نحو زراعة أذكى
          </h1>
          <p className="text-lg text-[#d6edd9] sm:text-xl max-w-xl leading-relaxed">
            تجمع محاصيل بين التخطيط والمتابعة والبيع في تجربة واحدة تساعدك على اتخاذ القرار وتنمية
            أعمالك الزراعية بكل ثقة.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/signup"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-[#265C38] shadow-xl shadow-[#163f24]/30 transition hover:bg-[#f8fdf7] hover:scale-105 active:scale-95"
            >
              ابدأ رحلتك الآن
            </Link>
            <Link
              href="/welcome"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-2xl border border-white/20 bg-transparent px-8 py-4 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              تعرف على المزيد
            </Link>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none z-10">
          <div className="relative aspect-square w-full">
            <Image
              src="/images/onboard6.svg"
              alt="محاصيل"
              fill
              className="welcome-illustration object-contain drop-shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
