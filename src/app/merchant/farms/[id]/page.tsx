// src/app/merchant/farms/[id]/page.tsx

'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { getFarmById, Farm } from '@/services/api/farms';
import { getCropsByFarm, Crop } from '@/services/api/crops';
import { PageHeader } from '@/components/merchant/PageHeader';
import { CropCard } from '@/components/merchant/CropCard';

interface FarmDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function FarmDetailPage({ params }: FarmDetailPageProps) {
  const { id } = use(params);
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [farm, setFarm] = useState<Farm | null>(null);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isReady || !token || !id) return;

    const loadData = async () => {
      try {
        const farmData = await getFarmById(id, token);
        if (!farmData) {
          setError('المزرعة المطلوبة غير موجودة');
          setLoading(false);
          return;
        }
        setFarm(farmData);

        // Fetch crops if the farm is approved
        if (farmData.status === 'APPROVED') {
          const cropsData = await getCropsByFarm(id, token);
          setCrops(cropsData);
        }
      } catch (err) {
        console.error('Failed to load farm details:', err);
        setError('حدث خطأ أثناء تحميل بيانات المزرعة');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isReady, token, id]);

  if (!isReady) {
    return null;
  }

  const getStatusBadge = (status: Farm['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="rounded-lg bg-[#e8f1eb] px-3 py-1.5 text-xs font-bold text-[#265C38]">
            المزرعة موثقة
          </span>
        );
      case 'PENDING':
        return (
          <span className="rounded-lg bg-[#f3e5f5] px-3 py-1.5 text-xs font-bold text-[#9c27b0]">
            قيد المراجعة
          </span>
        );
      case 'REJECTED':
        return (
          <span className="rounded-lg bg-[#ffebee] px-3 py-1.5 text-xs font-bold text-[#d32f2f]">
            مرفوضة
          </span>
        );
      case 'SUSPENDED':
        return (
          <span className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
            موقوفة
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      {/* Responsive Container */}
      <div className="max-w-7xl mx-auto flex flex-col space-y-6">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden">
          <PageHeader title="تفاصيل المزرعة" backHref="/merchant/farms" />
        </div>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-[#888888]">جاري تحميل البيانات...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center text-sm text-red-600 my-8">
            {error}
          </div>
        ) : farm ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2 md:pt-6">
            {/* Right Column: Basic Info Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="hidden lg:block text-right">
                <h2 className="text-lg font-bold text-[#265C38]">معلومات المزرعة</h2>
              </div>

              <div className="relative rounded-[2rem] border border-[#f0ebde]/75 bg-white p-6 shadow-md">
                {/* Settings Gear Box top-left */}
                <Link
                  href={`/merchant/farms/${farm.id}/edit`}
                  className="absolute left-6 top-6 flex h-9 w-9 items-center justify-center rounded-xl bg-[#265C38] text-white hover:bg-[#1f4f2c] transition"
                  aria-label="تعديل المزرعة"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </Link>

                {/* Data fields */}
                <div className="space-y-4 text-right">
                  {/* Farm Name */}
                  <div className="space-y-0.5 mt-2">
                    <span className="text-[10px] font-bold text-gray-400">اسم المزرعة</span>
                    <p className="text-base font-extrabold text-[#111111]">{farm.name}</p>
                  </div>

                  {/* Location */}
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400">الموقع الجغرافي</span>
                    <p className="text-sm font-bold text-[#111111]">{farm.location}</p>
                  </div>

                  {/* Contact */}
                  {farm.contactNumber && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400">رقم تواصل المزرعة</span>
                      <p className="text-sm font-bold text-[#111111] font-mono" dir="ltr">
                        {farm.contactNumber}
                      </p>
                    </div>
                  )}

                  {/* Manager Name */}
                  {farm.managerName && (
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-gray-400">إسم مسؤول المزرعة</span>
                      <p className="text-sm font-bold text-[#111111]">{farm.managerName}</p>
                    </div>
                  )}

                  {/* Agricultural Register Doc */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-gray-400 block">السجل الزراعي</span>
                    <a
                      href={farm.agriculturalRegisterUrl || '#'}
                      download
                      className="inline-flex items-center gap-2 rounded-xl bg-[#265C38] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#1f4f2c] transition cursor-pointer"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      تنزيل السجل الزراعي
                    </a>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="mt-6 flex justify-end">{getStatusBadge(farm.status)}</div>
              </div>

              {/* Rejection Details Mobile (Hidden on Desktop) */}
              {farm.status === 'REJECTED' && (
                <div className="space-y-3 pt-2 text-right lg:hidden">
                  <h2 className="text-base font-bold text-red-600">سبب الرفض</h2>
                  <div className="rounded-[1.5rem] bg-red-50/50 border border-red-100 p-5">
                    <p className="text-xs text-red-600 leading-relaxed font-semibold">
                      {farm.rejectionReason || 'لم يتم تحديد سبب الرفض.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Left Column: Conditional Content based on Status */}
            <div className="lg:col-span-8 space-y-6">
              {farm.status === 'REJECTED' ? (
                /* Rejection guidance card for Desktop */
                <div className="rounded-[2rem] border border-red-100 bg-red-50/20 p-8 text-center flex flex-col items-center justify-center space-y-4 min-h-[350px]">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                    <svg
                      className="h-7 w-7"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-red-700">تم رفض توثيق المزرعة</h3>
                  <div className="bg-white rounded-2xl p-5 border border-red-100/50 max-w-lg shadow-sm">
                    <span className="text-[10px] text-gray-400 font-bold block mb-1">
                      تفاصيل سبب الرفض من الإدارة
                    </span>
                    <p className="text-xs text-red-600 font-bold leading-relaxed">
                      {farm.rejectionReason || 'السجل الزراعي المرفق غير واضح أو قد انتهت صلاحيته.'}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 max-w-md leading-relaxed pt-2">
                    يرجى مراجعة وتحديث مستندات المزرعة وبياناتها وإعادة إرسالها للتوثيق من خلال
                    الضغط على زر تعديل المزرعة.
                  </p>
                  <Link href={`/merchant/farms/${farm.id}/edit`}>
                    <button className="rounded-xl bg-[#265C38] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#1f4f2c] cursor-pointer">
                      تعديل بيانات المزرعة وتحديث الملف
                    </button>
                  </Link>
                </div>
              ) : (
                /* Crops List Grid */
                <div className="space-y-4 text-right">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#265C38]">محاصيل المزرعة</h2>
                    <Link
                      href={`/merchant/crops/add?farmId=${farm.id}`}
                      className="hidden md:block"
                    >
                      <button className="rounded-xl bg-[#265C38] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1f4f2c] cursor-pointer">
                        إضافة محصول جديد +
                      </button>
                    </Link>
                  </div>

                  {crops.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-[#e0e0e0] bg-white p-12 text-center text-sm text-gray-400">
                      لا توجد محاصيل مضافة لهذه المزرعة حالياً.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {crops.map((crop) => (
                        <CropCard key={crop.id} crop={crop} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
