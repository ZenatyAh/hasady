import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { AuthLogo } from '@/components/ui/AuthLogo';

const termsSections = [
  {
    title: 'استخدام الخدمة',
    text: 'تستخدم منصة محاصيل لإدارة حسابك وتجربة التسجيل والتحقق وإضافة الحساب البنكي. يجب إدخال بيانات صحيحة وحديثة عند استخدام النماذج.',
  },
  {
    title: 'الخصوصية',
    text: 'تتعامل المنصة مع بياناتك الأساسية مثل الاسم ورقم الهاتف وبيانات الحساب البنكي باعتبارها معلومات خاصة لا تستخدم إلا لتقديم الخدمة وتحسين التجربة.',
  },
  {
    title: 'أمان الحساب',
    text: 'أنت مسؤول عن الحفاظ على سرية كلمة المرور ورمز التحقق. لا تشارك هذه البيانات مع أي طرف آخر.',
  },
  {
    title: 'التحديثات',
    text: 'قد يتم تحديث هذه السياسة عند إضافة ميزات جديدة أو ربط التطبيق بخدمات خلفية فعلية.',
  },
];

export default function TermsPage() {
  return (
    <main
      dir="rtl"
      className="flex min-h-screen flex-col items-center bg-[#fdfcfa] px-6 pt-8 pb-10 text-[#111111]"
    >
      <div className="w-full max-w-2xl space-y-8">
        <AuthLogo />

        <header className="space-y-3 text-center">
          <h1 className="text-2xl font-bold">سياسة الاستخدام والخصوصية</h1>
          <p className="text-sm leading-7 text-[#666666]">
            هذه نسخة أولية مخصصة لتوضيح شروط الاستخدام الأساسية داخل التطبيق.
          </p>
        </header>

        <section className="space-y-4">
          {termsSections.map((section) => (
            <article
              key={section.title}
              className="rounded-xl border border-[#e0e0e0] bg-white p-4"
            >
              <h2 className="text-base font-bold text-[#265C38]">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-[#555555]">{section.text}</p>
            </article>
          ))}
        </section>

        <Link href="/login" className="block">
          <Button className="w-full">العودة لتسجيل الدخول</Button>
        </Link>
      </div>
    </main>
  );
}
