// src/app/merchant/crops/[id]/edit/page.tsx

'use client';

import React, { use, useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { getCropById, updateCrop, Crop } from '@/services/api/crops';
import { PageHeader } from '@/components/merchant/PageHeader';
import { CropForm } from '@/components/merchant/CropForm';

interface EditCropPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCropPage({ params }: EditCropPageProps) {
  const { id } = use(params);
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isReady || !token || !id) return;

    getCropById(id, token)
      .then((data) => {
        if (!data) {
          setError('المحصول المطلوب غير موجود');
        } else {
          setCrop(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load crop details:', err);
        setError('حدث خطأ أثناء تحميل بيانات المحصول');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, token, id]);

  const handleSubmit = async (cropData: Omit<Crop, 'id' | 'status'>) => {
    if (!id) return;
    await updateCrop(id, cropData, token);
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      {/* Centered responsive container */}
      <div className="max-w-3xl mx-auto w-full flex flex-col space-y-6">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden">
          <PageHeader title="تعديل المحصول" backHref="/merchant/crops" />
        </div>

        {/* Desktop Title Header (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#265C38]">تعديل بيانات المحصول</h2>
        </div>

        {/* Form area inside responsive card */}
        <div className="bg-[#fdfcfa] p-5 sm:p-8 md:p-10 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-20">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
              <span className="text-sm font-medium text-[#888888]">جاري تحميل البيانات...</span>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center text-sm text-red-600 my-8">
              {error}
            </div>
          ) : crop ? (
            <CropForm mode="edit" initialData={crop} onSubmit={handleSubmit} />
          ) : null}
        </div>
      </div>
    </main>
  );
}
