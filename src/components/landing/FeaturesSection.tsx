import Image from 'next/image';

const features = [
  {
    title: 'تخطيط الموسم',
    description: 'خطط لموسمك وتابع نمو مزرعتك من مكان واحد مع تجربة واضحة وسريعة.',
    icon: '/images/onboard4.svg',
  },
  {
    title: 'متابعة المعدات',
    description: 'راقب تفاصيل مزرعتك اليومية وجهّز أعمالك القادمة بخطوات واضحة.',
    icon: '/images/onboard5.svg',
  },
  {
    title: 'بيع المحاصيل',
    description: 'بيع محاصيلك بكل سهولة ويسر عبر المزادات أو الأسعار الثابتة بطرق موثوقة.',
    icon: '/images/onboard6.svg',
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-[#fffaf0] py-24 px-6 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#19361f] sm:text-4xl">لماذا تختار محاصيل؟</h2>
          <p className="mt-4 text-lg text-[#4e6c57] max-w-2xl mx-auto">
            نوفر لك كل ما تحتاجه لإدارة مزرعتك بكفاءة عالية وزيادة أرباحك.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-8 bg-white rounded-3xl shadow-xl shadow-[#19361f]/5 border border-[#f0dfbd]/50 hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-[#f7f3e7] p-4 shadow-inner shadow-[#1f331b]/10">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>
              <h3 className="mb-3 text-xl font-bold text-[#19361f]">{feature.title}</h3>
              <p className="text-[#4e6c57] leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
