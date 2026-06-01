// src/app/merchant/crops/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { getCrops, deleteCrop, relistCrop, Crop } from '@/services/api/crops';
import { PageHeader } from '@/components/merchant/PageHeader';
import { CropCard } from '@/components/merchant/CropCard';

export default function CropsListPage() {
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Tab State: 'AVAILABLE' = محاصيل معروضة للبيع, 'SOLD' = محاصيل مباعة
  const [activeTab, setActiveTab] = useState<'AVAILABLE' | 'SOLD'>('AVAILABLE');

  // Deletion Modal State
  const [cropToDelete, setCropToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!isReady || !token) return;

    getCrops(token)
      .then((data) => {
        setCrops(data);
      })
      .catch((err) => {
        console.error('Failed to load crops:', err);
        setError('حدث خطأ أثناء تحميل قائمة المحاصيل');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, token]);

  const handleDeleteClick = (id: string) => {
    setCropToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!cropToDelete || !token) return;
    try {
      setDeleteLoading(true);
      await deleteCrop(cropToDelete, token);
      // Remove from state
      setCrops((prev) => prev.filter((c) => c.id !== cropToDelete));
      setCropToDelete(null);
    } catch (err) {
      console.error('Failed to delete crop:', err);
      alert('حدث خطأ أثناء حذف المحصول');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleReOffer = async (id: string) => {
    if (!token) return;
    try {
      setLoading(true);
      await relistCrop(id, token);
      // Refresh crops list
      const data = await getCrops(token);
      setCrops(data);
      // Move to AVAILABLE tab so user can see it
      setActiveTab('AVAILABLE');
    } catch (err) {
      console.error('Failed to re-offer crop:', err);
      alert('حدث خطأ أثناء إعادة طرح المحصول');
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) {
    return null;
  }

  // Filter crops based on active tab
  const filteredCrops = crops.filter((c) => c.status === activeTab);

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6 relative" dir="rtl">
      {/* Responsive Container */}
      <div className="max-w-7xl mx-auto flex flex-col space-y-6">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden">
          <PageHeader title="إدارة المحاصيل" backHref="/merchant" />
        </div>

        {/* Section Title & Desktop Add Button Row */}
        <div className="flex items-center justify-between mt-2 md:mt-4 mb-2">
          <h2 className="text-xl font-bold text-[#265C38]">إدارة المحاصيل</h2>
          <Link href="/merchant/crops/add" className="hidden md:block">
            <button className="rounded-2xl bg-[#265C38] px-5 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#1f4f2c] transition duration-200 cursor-pointer">
              إضافة محصول جديد +
            </button>
          </Link>
        </div>

        {/* Tab Switcher - Match visual style of the mockup */}
        <div className="w-full max-w-md mx-auto bg-[#eae7df]/40 p-1.5 rounded-[2rem] border border-[#f0ebde]/40 flex shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTab('AVAILABLE')}
            className={`flex-1 py-3 text-center text-sm font-bold rounded-[1.75rem] transition duration-200 cursor-pointer ${
              activeTab === 'AVAILABLE'
                ? 'bg-white text-[#265C38] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            محاصيل معروضة للبيع
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SOLD')}
            className={`flex-1 py-3 text-center text-sm font-bold rounded-[1.75rem] transition duration-200 cursor-pointer ${
              activeTab === 'SOLD'
                ? 'bg-white text-[#265C38] shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            محاصيل مباعة
          </button>
        </div>

        {/* Main Content */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-[#888888]">جاري تحميل المحاصيل...</span>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-100 bg-red-50/50 p-6 text-center text-sm text-red-600 my-8">
            {error}
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#e0e0e0] bg-white p-12 text-center flex flex-col items-center justify-center my-8 space-y-4">
            <svg
              className="h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z"
              />
            </svg>
            <span className="text-sm text-[#888888]">
              {activeTab === 'AVAILABLE'
                ? 'لا توجد محاصيل معروضة للبيع حالياً'
                : 'لا توجد محاصيل مباعة حالياً'}
            </span>
            {activeTab === 'AVAILABLE' && (
              <Link href="/merchant/crops/add">
                <button className="rounded-xl bg-[#265C38] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1f4f2c] cursor-pointer">
                  أضف محصولك الأول
                </button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => (
              <CropCard
                key={crop.id}
                crop={crop}
                showEdit={true}
                onDelete={handleDeleteClick}
                onReOffer={handleReOffer}
              />
            ))}
          </div>
        )}

        {/* Mobile Floating Action Button (FAB) - Hidden on Desktop */}
        <Link
          href="/merchant/crops/add"
          className="md:hidden fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#265C38] text-white shadow-xl hover:bg-[#1f4f2c] transition duration-200 cursor-pointer"
          aria-label="إضافة محصول جديد"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {cropToDelete && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
          dir="rtl"
        >
          <div className="bg-[#fdfcfa] rounded-[2.5rem] border border-[#f0ebde]/45 shadow-xl w-full max-w-sm overflow-hidden p-6 text-center space-y-6 animate-in fade-in zoom-in duration-200">
            {/* Warning Icon or Title */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#265C38]">تأكيد حذف المحصول</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                هل أنت متأكد من حذف هذا المحصول؟ يرجى التأكد من صحة جميع البيانات قبل المتابعة.
              </p>
            </div>

            {/* Actions Grid */}
            <div className="flex gap-4">
              {/* Delete Button (Left) */}
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="flex-1 py-3.5 bg-[#265C38] hover:bg-[#1f4f2c] text-white font-bold rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'جاري الحذف...' : 'حذف'}
              </button>

              {/* Cancel Button (Right) */}
              <button
                type="button"
                onClick={() => setCropToDelete(null)}
                disabled={deleteLoading}
                className="flex-1 py-3.5 bg-[#fbebe8] hover:bg-[#f7d6d0] text-[#d32f2f] font-bold rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
