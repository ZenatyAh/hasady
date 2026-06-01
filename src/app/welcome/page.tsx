'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useGuestGuard } from '@/lib/use-guest-guard';

const slides = [
  {
    title: 'نمّ أعمالك بثقة',
    text: 'خطط لموسمك وتابع نمو مزرعتك من مكان واحد مع تجربة واضحة وسريعة.',
    image: '/images/onboard4.svg',
  },
  {
    title: 'تابع أرضك ومعداتك',
    text: 'راقب تفاصيل مزرعتك اليومية وجهّز أعمالك القادمة بخطوات واضحة.',
    image: '/images/onboard5.svg',
  },
  {
    title: 'ابدأ موسماً أكثر تنظيماً',
    text: 'اجمع التخطيط والمتابعة والبيع في تجربة واحدة تساعدك على اتخاذ القرار.',
    image: '/images/onboard6.svg',
  },
];

export default function WelcomePage() {
  const { isReady } = useGuestGuard();
  const [index, setIndex] = useState(0);
  const router = useRouter();

  if (!isReady) {
    return null;
  }

  function next() {
    setIndex((prevIndex) => {
      if (prevIndex < slides.length - 1) {
        return prevIndex + 1;
      }

      router.push('/login');
      return prevIndex;
    });
  }

  function skip() {
    router.push('/login');
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#265C38] text-white">
      <header className="flex items-center justify-end px-6 py-5 sm:px-10">
        <Button
          variant="ghost"
          size="md"
          className="max-w-[140px] border border-white/20 text-white/90"
          onClick={skip}
        >
          تخطي
        </Button>
      </header>

      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 pb-12 sm:px-10">
        <Card className="w-full max-w-5xl !bg-[#fffaf0] px-4 py-6 ring-[#f0dfbd] sm:px-8 sm:py-10">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div className="flex items-center justify-center rounded-[1.75rem] bg-[#f7f3e7] p-6 shadow-inner shadow-[#1f331b]/10 sm:p-8">
              <Image
                src={slides[index].image}
                alt={slides[index].title}
                width={520}
                height={320}
                className="welcome-illustration h-full w-full max-h-[300px] object-contain"
                priority={index === 0}
              />
            </div>

            <div className="space-y-6 text-[#19361f]">
              <div className="space-y-3">
                <h1 className="text-3xl font-semibold sm:text-4xl">{slides[index].title}</h1>
                <p className="max-w-xl text-base leading-8 text-[#4e6c57] sm:text-lg">
                  {slides[index].text}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <div
                  className="h-2.5 w-full overflow-hidden rounded-full bg-[#d6edd9]"
                  aria-label={`تقدم الشرائح ${index + 1} من ${slides.length}`}
                >
                  <div
                    className="h-full rounded-full bg-[#265C38] transition-[width] duration-500 ease-out"
                    style={{ width: `${((index + 1) / slides.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Button onClick={next} size="lg">
                  {index < slides.length - 1 ? 'التالي' : 'ابدأ الآن'}
                </Button>

                {index === slides.length - 1 ? (
                  <Link
                    href="/signup"
                    className="block text-center text-sm font-semibold text-[#265C38] transition hover:text-[#19361f]"
                  >
                    إنشاء حساب جديد
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
