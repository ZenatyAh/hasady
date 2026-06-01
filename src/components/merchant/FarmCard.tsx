// src/components/merchant/FarmCard.tsx

import React from 'react';
import Link from 'next/link';
import { Farm } from '@/services/api/farms';

interface FarmCardProps {
  farm: Farm;
}

export function FarmCard({ farm }: FarmCardProps) {
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
    <div className="rounded-[1.5rem] border border-[#f0ebde]/75 bg-white p-5 shadow-sm transition hover:shadow-md">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#111111]">{farm.name}</h3>
        {getStatusBadge(farm.status)}
      </div>

      {/* Details Box */}
      <div className="mt-4 rounded-2xl border border-dashed border-[#e0e0e0] bg-[#fdfcfa]/50 p-4 space-y-3">
        {/* Location */}
        <div className="flex items-start gap-2.5 text-right">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-[#265C38]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-xs text-[#666666] leading-relaxed">{farm.location}</span>
        </div>

        {/* Manager Name */}
        {farm.managerName && (
          <div className="flex items-center gap-2.5 text-right">
            <svg
              className="h-4 w-4 shrink-0 text-[#265C38]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-xs text-[#666666]">{farm.managerName}</span>
          </div>
        )}

        {/* Phone */}
        {farm.contactNumber && (
          <div className="flex items-center gap-2.5 text-right">
            <svg
              className="h-4 w-4 shrink-0 text-[#265C38]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs text-[#666666] font-medium" dir="ltr">
              {farm.contactNumber}
            </span>
          </div>
        )}
      </div>

      {/* Actions Row */}
      <div className="mt-4 flex items-center justify-between pt-2">
        <Link
          href={`/merchant/farms/${farm.id}/edit`}
          className="text-xs font-bold text-[#265C38] hover:underline"
        >
          تعديل
        </Link>
        <Link
          href={`/merchant/farms/${farm.id}`}
          className="text-xs font-bold text-[#265C38] hover:underline"
        >
          عرض التفاصيل
        </Link>
      </div>
    </div>
  );
}
