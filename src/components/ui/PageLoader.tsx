'use client';

import React from 'react';

export function PageLoader({ label = 'جاري التحميل...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-4">
      <div className="h-10 w-10 border-4 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
      <span className="text-sm text-gray-500 font-bold">{label}</span>
    </div>
  );
}
