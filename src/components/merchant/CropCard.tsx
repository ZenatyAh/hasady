// src/components/merchant/CropCard.tsx

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Crop } from '@/services/api/crops';

interface CropCardProps {
  crop: Crop;
  showEdit?: boolean;
  onDelete?: (id: string) => void;
  onReOffer?: (id: string) => void;
}

export function CropCard({ crop, showEdit = false, onDelete, onReOffer }: CropCardProps) {
  const [imageIndex, setImageIndex] = useState(0);

  const images =
    crop.images && crop.images.length > 0 ? crop.images : ['/images/placeholder-crop.png'];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="overflow-hidden rounded-[2.5rem] border border-[#f0ebde]/75 bg-white shadow-sm transition hover:shadow-md flex flex-col"
      dir="rtl"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full bg-[#f4f7f5] flex items-center justify-center overflow-hidden">
        <Image
          src={images[imageIndex]}
          alt={crop.name}
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />

        {/* Image Slider Controls (Only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50 z-10 cursor-pointer"
              aria-label="الصورة السابقة"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white transition hover:bg-black/50 z-10 cursor-pointer"
              aria-label="الصورة التالية"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Trash delete button on top-left of the image (Visible only for AVAILABLE crops under showEdit) */}
        {showEdit && crop.status === 'AVAILABLE' && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(crop.id)}
            className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#d32f2f] text-white hover:bg-[#b71c1c] transition shadow-md z-10 cursor-pointer"
            aria-label="حذف المحصول"
          >
            <svg
              className="h-4.5 w-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Details Section */}
      <div className="p-6 text-right flex-1 flex flex-col justify-between">
        <div>
          {/* Header Title with Settings Gear Icon on the Left */}
          <div className="flex items-center justify-between gap-4 mb-1">
            <h3 className="text-base font-bold text-[#265C38]">{crop.name}</h3>

            {showEdit && crop.status === 'AVAILABLE' && (
              <Link
                href={`/merchant/crops/${crop.id}/edit`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#265C38] text-white hover:bg-[#1f4f2c] transition shadow-sm shrink-0"
                aria-label="تعديل المحصول"
              >
                <svg
                  className="h-4.5 w-4.5"
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
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Link>
            )}
          </div>

          <p className="text-xs leading-relaxed text-[#888888]">{crop.description}</p>

          {/* 3-Column Details Grid */}
          <div className="mt-4 grid grid-cols-3 gap-y-3 gap-x-2 border-t border-[#f0ebde]/45 pt-4 text-[11px] sm:text-xs">
            {/* Row 1 Right */}
            <div className="space-y-0.5">
              <span className="block font-semibold text-gray-400">طريقة البيع</span>
              <span className="font-bold text-[#333333]">
                {crop.saleMethod === 'AUCTION' ? 'مزاد' : 'سعر ثابت'}
              </span>
            </div>
            {/* Row 1 Middle */}
            <div className="space-y-0.5">
              <span className="block font-semibold text-gray-400">المزرعة</span>
              <span className="font-bold text-[#333333] truncate block" title={crop.farmName}>
                {crop.farmName}
              </span>
            </div>
            {/* Row 1 Left */}
            <div className="space-y-0.5">
              <span className="block font-semibold text-gray-400">الكمية</span>
              <span className="font-bold text-[#333333]">
                {crop.quantity} {crop.quantityUnit}
              </span>
            </div>

            {/* Row 2 Right */}
            <div className="space-y-0.5">
              <span className="block font-semibold text-gray-400">وسيلة التسليم</span>
              <span className="font-bold text-[#333333]">{crop.deliveryMethod}</span>
            </div>
            {/* Row 2 Middle */}
            <div className="space-y-0.5">
              <span className="block font-semibold text-gray-400">التواصل</span>
              <span className="font-bold text-[#333333] font-mono" dir="ltr">
                {crop.contact}
              </span>
            </div>
            {/* Row 2 Left */}
            <div className="space-y-0.5">
              <span className="block font-semibold text-gray-400">اسم المسؤول</span>
              <span className="font-bold text-[#333333]">{crop.managerName}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div>
          {crop.status === 'SOLD' ? (
            <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#f0ebde]/45 pt-4">
              {showEdit && onReOffer ? (
                <button
                  type="button"
                  onClick={() => onReOffer(crop.id)}
                  className="rounded-xl bg-[#265C38] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1f4f2c] cursor-pointer"
                >
                  إعادة طرح المحصول
                </button>
              ) : (
                <span className="rounded-lg bg-[#e8f1eb] px-2.5 py-1 text-xs font-bold text-[#265C38]">
                  تم البيع
                </span>
              )}

              <div className="rounded-full bg-[#265C38] px-4 py-2 text-xs font-bold text-white shadow-md shadow-[#265C38]/10 shrink-0">
                {crop.price} ريال سعودي
              </div>
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-center border-t border-[#f0ebde]/45 pt-4">
              <div className="rounded-full bg-[#265C38] px-8 py-2.5 text-xs font-bold text-white shadow-md shadow-[#265C38]/10 text-center">
                {crop.price} ريال سعودي
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
