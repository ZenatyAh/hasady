// src/app/merchant/farms/add/page.tsx

'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { createFarm, Farm } from '@/services/api/farms';
import { PageHeader } from '@/components/merchant/PageHeader';
import { FarmForm } from '@/components/merchant/FarmForm';

export default function AddFarmPage() {
  const { isReady } = useAuthGuard();

  const handleSubmit = async (farmData: Omit<Farm, 'id' | 'status'>) => {
    return createFarm(farmData);
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
          <PageHeader title="إضافة مزرعة" backHref="/merchant/farms" />
        </div>

        {/* Desktop Title Header (Hidden on Mobile) */}
        <div className="hidden md:flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-[#265C38]">تسجيل مزرعة جديدة</h2>
        </div>

        {/* Reusable Form inside Responsive Card */}
        <div className="bg-[#fdfcfa] p-5 sm:p-8 md:p-10 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
          <FarmForm mode="create" onSubmit={handleSubmit} />
        </div>
      </div>
    </main>
  );
}
