// src/app/customer/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCrops, Crop } from '@/services/api/crops';
import { useAuthStore } from '@/lib/store';

// ─── Categories List ─────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: '🌾' },
  { id: 'vegetables', name: 'خضار', icon: '🥦' },
  { id: 'fruits', name: 'فواكه', icon: '🍎' },
  { id: 'leafy', name: 'ورقيات', icon: '🥬' },
  { id: 'dates', name: 'تمور', icon: '🌴' },
];

export default function CustomerBrowsePage() {
  const token = useAuthStore((state) => state.token);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [saleMethodFilter, setSaleMethodFilter] = useState<'ALL' | 'FIXED' | 'AUCTION'>('ALL');

  useEffect(() => {
    async function loadCrops() {
      try {
        setLoading(true);
        const data = await getCrops(token);
        setCrops(data);
      } catch (err) {
        console.error('Failed to load crops:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCrops();
  }, [token]);

  // Filter logic
  const filteredCrops = crops.filter((crop) => {
    // 1. Availability (only show AVAILABLE for shopping, or let them view SOLD as well? Let's display both, but AVAILABLE first)
    // 2. Search query (crop name or farm name)
    const matchesSearch =
      crop.name.toLowerCase().includes(search.toLowerCase()) ||
      crop.farmName.toLowerCase().includes(search.toLowerCase());

    // 3. Category matching (simulate with name mapping for category filter)
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'vegetables') {
        matchesCategory = crop.name.includes('خيار') || crop.name.includes('طماطم') || crop.name.includes('بصل');
      } else if (selectedCategory === 'fruits') {
        matchesCategory = crop.name.includes('تفاح') || crop.name.includes('برتقال') || crop.name.includes('موز');
      } else if (selectedCategory === 'leafy') {
        matchesCategory = crop.name.includes('نعناع') || crop.name.includes('خس') || crop.name.includes('جرجير');
      } else if (selectedCategory === 'dates') {
        matchesCategory = crop.name.includes('تمر') || crop.name.includes('تمور');
      }
    }

    // 4. Sale method filter
    const matchesSaleMethod =
      saleMethodFilter === 'ALL' || crop.saleMethod === saleMethodFilter;

    return matchesSearch && matchesCategory && matchesSaleMethod;
  });

  return (
    <div className="space-y-8">
      {/* ── Welcome and Search Header ── */}
      <div className="bg-[#e8f1eb] rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm border border-[#265C38]/10">
        <div className="space-y-2 text-right md:max-w-md">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#265C38]">تسوق محاصيلك الطازجة</h1>
          <p className="text-sm text-[#4c6a56] leading-relaxed">
            تصفح المحاصيل المتاحة مباشرة من المزارع السعودية، اشترِ بسعر ثابت أو زايد للحصول على أفضل الصفقات!
          </p>
        </div>

        {/* Search Box */}
        <div className="w-full md:w-80 relative">
          <input
            type="text"
            placeholder="ابحث عن محصول أو اسم مزرعة..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white text-[#111111] pr-12 pl-4 py-3 rounded-2xl border border-[#f0ebde] focus:border-[#265C38] focus:ring-1 focus:ring-[#265C38] outline-none text-sm transition"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Categories Carousel Grid ── */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#111111]">التصنيفات الرئيسية</h2>
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border text-sm font-semibold transition shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#265C38] border-[#265C38] text-white shadow-sm shadow-[#265C38]/15'
                    : 'bg-white border-[#f0ebde] text-[#666666] hover:border-[#265C38] hover:text-[#265C38]'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Filters and Crop List ── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0ebde]/45 pb-4">
          <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
            <span>المحاصيل المتوفرة</span>
            <span className="bg-[#265C38]/10 text-[#265C38] text-xs px-2.5 py-1 rounded-full font-bold">
              {filteredCrops.length}
            </span>
          </h2>

          {/* Segmented Filter */}
          <div className="flex bg-[#f0ebde]/70 rounded-xl p-1 self-start sm:self-auto">
            {(['ALL', 'FIXED', 'AUCTION'] as const).map((method) => {
              const label = method === 'ALL' ? 'الكل' : method === 'FIXED' ? 'سعر ثابت' : 'مزاد علني';
              const isSelected = saleMethodFilter === method;
              return (
                <button
                  key={method}
                  onClick={() => setSaleMethodFilter(method)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-white text-[#265C38] shadow-sm'
                      : 'text-[#666666] hover:text-[#265C38]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="h-10 w-10 border-4 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
            <span className="text-sm text-gray-500 font-bold">جاري تحميل المحاصيل...</span>
          </div>
        ) : filteredCrops.length === 0 ? (
          <div className="bg-[#fdfcfa] rounded-3xl border border-dashed border-[#f0ebde] p-12 text-center max-w-md mx-auto space-y-3">
            <span className="text-4xl">🔎</span>
            <h3 className="text-lg font-bold text-[#111111]">لم نجد أي نتائج</h3>
            <p className="text-sm text-[#888888]">
              جرب تغيير كلمات البحث أو تصفح تصنيفاً آخر للعثور على المحصول المطلوب.
            </p>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map((crop) => {
              const isAuction = crop.saleMethod === 'AUCTION';
              const isSold = crop.status === 'SOLD';
              const imageUrl = crop.images && crop.images.length > 0 ? crop.images[0] : '/images/placeholder-crop.png';
              
              return (
                <div
                  key={crop.id}
                  className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between h-[25rem]"
                >
                  {/* Image and Tag */}
                  <div className="relative h-44 bg-[#f4f7f5] flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={crop.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const parent = (e.target as HTMLElement).parentElement;
                        if (parent) {
                          const placeholder = parent.querySelector('.svg-placeholder');
                          if (placeholder) placeholder.classList.remove('hidden');
                        }
                      }}
                    />
                    
                    {/* SVG Placeholder */}
                    <div className="svg-placeholder absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#e8f1eb] to-[#fcfdfd] text-[#265C38] hidden">
                      <span className="text-3xl">🌾</span>
                    </div>

                    {/* Method Tag */}
                    <span
                      className={`absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full text-white shadow-sm ${
                        isAuction ? 'bg-[#9c27b0]' : 'bg-[#265C38]'
                      }`}
                    >
                      {isAuction ? '⚖️ مزاد علني' : '🏷️ سعر ثابت'}
                    </span>

                    {/* Sold Tag */}
                    {isSold && (
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                        <span className="bg-[#d32f2f] text-white text-sm font-extrabold px-4 py-2 rounded-xl">
                          تم البيع بالكامل
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 text-right flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#111111] mb-1">{crop.name}</h3>
                      <p className="text-xs text-[#888888] line-clamp-2 leading-relaxed mb-4">
                        {crop.description}
                      </p>

                      {/* Info grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs border-t border-[#f0ebde]/45 pt-3">
                        <div>
                          <span className="block text-gray-400 font-semibold mb-0.5">المزرعة</span>
                          <span className="font-bold text-[#333333] truncate block">{crop.farmName}</span>
                        </div>
                        <div>
                          <span className="block text-gray-400 font-semibold mb-0.5">الكمية المتاحة</span>
                          <span className="font-bold text-[#333333]">
                            {crop.quantity} {crop.quantityUnit}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer price & action */}
                    <div className="flex items-center justify-between border-t border-[#f0ebde]/45 pt-4 mt-4">
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-gray-400 font-semibold">
                          {isAuction ? 'أعلى سوم / السعر' : 'السعر الإجمالي'}
                        </span>
                        <span className="text-sm font-extrabold text-[#265C38]">
                          {crop.price} <span className="text-xs font-bold">ريال</span>
                        </span>
                      </div>

                      <Link href={`/customer/crops/${crop.id}`}>
                        <button className="bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer">
                          {isAuction ? 'مزايدة وتفاصيل' : 'شراء وتفاصيل'}
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
