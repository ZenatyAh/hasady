// src/components/merchant/FarmConfirmModal.tsx

import React from 'react';

interface FarmConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode: 'create' | 'edit';
  loading?: boolean;
}

export function FarmConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  mode,
  loading = false,
}: FarmConfirmModalProps) {
  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const title = isEdit ? 'تأكيد تعديل بيانات المزرعة' : 'تأكيد إضافة المزرعة';
  const description = isEdit
    ? 'هل أنت متأكد من تعديل بيانات هذه المزرعة؟ تأكد من صحة المعلومات قبل المتابعة.'
    : 'هل أنت متأكد من رغبتك في إضافة هذه المزرعة؟ يرجى التأكد من صحة جميع البيانات قبل المتابعة.';
  const confirmText = isEdit ? 'تعديل' : 'إضافة';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-[2rem] border-t-8 border-[#265C38] bg-white p-6 shadow-2xl transition-all">
        {/* Content */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-[#265C38]">{title}</h3>
          <p className="mt-3.5 text-sm leading-relaxed text-[#666666]">{description}</p>
        </div>

        {/* Buttons Row */}
        <div className="mt-6 flex gap-4">
          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-[1.25rem] bg-[#ffebee] py-3 text-sm font-bold text-[#d32f2f] transition hover:bg-[#ffd8d8] focus:outline-none"
          >
            إلغاء
          </button>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-[1.25rem] bg-[#265C38] py-3 text-sm font-bold text-white transition hover:bg-[#1f4f2c] focus:outline-none focus:ring-4 focus:ring-[#97cda6] disabled:opacity-50"
          >
            {loading ? 'جاري الحفظ...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
