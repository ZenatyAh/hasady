// src/components/merchant/CropConfirmModal.tsx

import React from 'react';

interface CropConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  mode: 'create' | 'edit';
  loading?: boolean;
}

export function CropConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  mode,
  loading = false,
}: CropConfirmModalProps) {
  if (!isOpen) return null;

  const isEdit = mode === 'edit';
  const title = isEdit ? 'تأكيد تعديل المحصول' : 'تأكيد إضافة المحصول';
  const description = isEdit
    ? 'هل أنت متأكد من تعديل هذا المحصول؟ تأكد من صحة جميع البيانات قبل المتابعة.'
    : 'هل أنت متأكد من إضافة هذا المحصول؟ تأكد من صحة جميع البيانات قبل المتابعة.';
  const confirmText = isEdit ? 'تعديل' : 'إضافة';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-[#fdfcfa] p-6 shadow-xl border border-[#f0ebde]/45 text-center space-y-6 animate-in fade-in zoom-in duration-200">
        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#265C38]">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>

        {/* Buttons Row */}
        <div className="flex gap-4">
          {/* Confirm Button (Left) */}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3.5 bg-[#265C38] hover:bg-[#1f4f2c] text-white font-bold rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
          >
            {loading ? 'جاري الحفظ...' : confirmText}
          </button>

          {/* Cancel Button (Right) */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3.5 bg-[#fbebe8] hover:bg-[#f7d6d0] text-[#d32f2f] font-bold rounded-2xl transition duration-150 cursor-pointer disabled:opacity-50"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
