'use client';

import React from 'react';

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ title = 'حدث خطأ', message, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center space-y-3">
      <h3 className="text-sm font-bold text-red-700">{title}</h3>
      <p className="text-xs text-red-600">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-bold text-[#265C38] hover:underline cursor-pointer"
        >
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
