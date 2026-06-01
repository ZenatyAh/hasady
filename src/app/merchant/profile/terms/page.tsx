// src/app/merchant/profile/terms/page.tsx

'use client';

import React from 'react';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function TermsAndConditionsPage() {
  const { isReady } = useAuthGuard();

  if (!isReady) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="الشروط والأحكام" backHref="/merchant/profile" />

        <div className="bg-[#fdfcfa] p-6 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6 text-right">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#265C38]">اتفاقية الاستخدام لموقع محاصيل</h2>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              مرحباً بكم في منصة محاصيل. يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام المنصة.
              بدخولك واستخدامك للمنصة، فإنك توافق على الالتزام بجميع الشروط الواردة أدناه:
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {/* Term 1 */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">1. شروط الحساب والتسجيل</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                يجب على التاجر تقديم معلومات صحيحة ودقيقة وكاملة عند إنشاء الحساب الشخصي وتفاصيل
                الحساب البنكي، والالتزام بتحديثها بشكل دوري لضمان تحويل المبالغ المالية بطريقة
                سليمة.
              </p>
            </div>

            {/* Term 2 */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">2. المعاملات المالية والسحب</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                تخضع عمليات سحب الأرباح للمراجعة والتدقيق والتحقق من المبيعات. يحق للمنصة تجميد أو
                إرجاء المعاملات المعلقة في حال وجود اشتباه في مصداقية الطلب أو مخالفة للسياسات
                العامة.
              </p>
            </div>

            {/* Term 3 */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">3. جودة وعرض المحاصيل</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                يتحمل التاجر المسؤولية القانونية والأخلاقية الكاملة عن جودة المنتجات المعروضة
                ومطابقتها التامة للوصف المكتوب والصور المرفقة في المتجر.
              </p>
            </div>

            {/* Term 4 */}
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-gray-800">4. التعديلات والإلغاء</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                تحتفظ المنصة بالحق الكامل في تعديل هذه الشروط والأحكام أو تعليق الخدمات في أي وقت
                تراه مناسباً دون إشعار مسبق.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
