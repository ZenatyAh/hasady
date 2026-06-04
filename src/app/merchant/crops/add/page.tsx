// src/app/merchant/crops/add/page.tsx

'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { createCrop, Crop } from '@/services/api/crops';
import { PageHeader } from '@/components/merchant/PageHeader';
import { CropForm } from '@/components/merchant/CropForm';

function AddCropPageContent() {
  const searchParams = useSearchParams();
  const queryFarmId = searchParams.get('farmId');
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!isReady) return;
  }, [isReady, queryFarmId, token]);

  const handleSubmit = async (cropData: Omit<Crop, 'id' | 'status'>) => {
    await createCrop(cropData, token);
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
          <PageHeader title="إضافة محصول" backHref="/merchant/crops" />
        </div>

        {/* Desktop Title Header (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#265C38]">إضافة محصول جديد</h2>
        </div>

        {/* Reusable Form inside Responsive Card */}
        <div className="bg-[#fdfcfa] p-5 sm:p-8 md:p-10 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
          <CropForm mode="create" onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}

export default function AddCropPage() {
  return (
    <Suspense fallback={null}>
      <AddCropPageContent />
    </Suspense>
  );
}
