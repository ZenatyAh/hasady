// src/components/merchant/FarmForm.tsx

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { agentLog } from '@/lib/agent-debug';
import { Farm } from '@/services/api/farms';
import { FarmConfirmModal } from './FarmConfirmModal';

interface FarmFormProps {
  initialData?: Farm;
  onSubmit: (data: Omit<Farm, 'id' | 'status'>) => Promise<void> | void;
  mode: 'create' | 'edit';
}

export function FarmForm({ initialData, onSubmit, mode }: FarmFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields State
  const [name, setName] = useState(initialData?.name || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [contactNumber, setContactNumber] = useState(initialData?.contactNumber || '');
  const [managerName, setManagerName] = useState(initialData?.managerName || '');
  const [fileName, setFileName] = useState(
    initialData?.agriculturalRegisterUrl
      ? initialData.agriculturalRegisterUrl.split('/').pop() || 'register.pdf'
      : ''
  );
  const [fileSize, setFileSize] = useState(
    initialData?.agriculturalRegisterUrl ? 'مرفق مسبقاً' : ''
  );

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle mock geolocation selection
  const handleSelectLocation = () => {
    setLocation('القصيم - عنيزة، المملكة العربية السعودية');
    if (errors.location) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.location;
        return next;
      });
    }
  };

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Format file size
      const sizeMb = file.size / (1024 * 1024);
      setFileSize(sizeMb > 0.1 ? `${sizeMb.toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`);
      if (errors.file) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.file;
          return next;
        });
      }
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validate fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'إسم المزرعة مطلوب';
    if (!location.trim()) newErrors.location = 'تحديد الموقع الجغرافي مطلوب';
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'رقم تواصل المزرعة مطلوب';
    } else if (!/^05\d{8}$/.test(contactNumber)) {
      newErrors.contactNumber = 'يجب أن يكون رقم الهاتف مكون من 10 أرقام ويبدأ بـ 05';
    }
    if (!managerName.trim()) newErrors.managerName = 'اسم مسؤول المزرعة مطلوب';
    if (!fileName) newErrors.file = 'وثيقة السجل الزراعي مطلوبة';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        name,
        location,
        contactNumber,
        managerName,
        agriculturalRegisterUrl: fileName ? `/files/${fileName}` : '',
        area: initialData?.area || '50 دونم', // Preserved or defaulted
      };
      await onSubmit(payload);
      // #region agent log
      agentLog(
        'FarmForm.tsx:submit',
        'farm_create_success',
        { name: payload.name, location: payload.location },
        'D'
      );
      // #endregion
      setIsModalOpen(false);
      router.push('/merchant/farms');
    } catch (err) {
      console.error(err);
      setErrors({ general: 'حدث خطأ أثناء حفظ بيانات المزرعة' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="w-full text-right" dir="rtl">
      {/* Description Header */}
      <div className="mb-6 mt-2">
        <h2 className="text-lg font-bold text-[#265C38]">
          {isEdit ? 'هل تغيّرت معلومات مزرعتك؟' : 'إضافة مزرعة جديدة'}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-[#888888]">
          {isEdit
            ? 'قم بالتعديل بسهولة للحفاظ على تحديث بياناتك أمام المشترين في السوق'
            : 'أضف تفاصيل مزرعتك لعرض محاصيلك والوصول إلى المشترين بسهولة عبر السوق'}
        </p>
      </div>

      {/* Form Fields */}
      <form onSubmit={handleOpenConfirm} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {/* Farm Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">إسم المزرعة</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الإسم التعريفي للمزرعة"
              className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] ${
                errors.name ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Geolocation */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">تعيين الموقع الجغرافي</label>
            <div
              className={`relative flex items-center justify-between rounded-xl border bg-white pl-1.5 pr-3.5 py-1.5 outline-none transition focus-within:border-[#265C38] ${
                errors.location ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            >
              {/* Read-only Text */}
              <span
                className={`text-sm flex-1 truncate ${location ? 'text-[#333333]' : 'text-[#cccccc]'}`}
              >
                {location || 'تعيين الموقع الجغرافي على الخريطة'}
              </span>

              {/* Map Action Button */}
              <button
                type="button"
                onClick={handleSelectLocation}
                className="rounded-lg bg-[#265C38] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f4f2c] focus:outline-none cursor-pointer"
              >
                حدد موقع مزرعتك
              </button>
            </div>
            {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
          </div>

          {/* Contact Number */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">رقم تواصل المزرعة</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="رقم التواصل مسؤول المزرعة"
              className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] ${
                errors.contactNumber ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            />
            {errors.contactNumber && <p className="text-xs text-red-500">{errors.contactNumber}</p>}
          </div>

          {/* Manager Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">اسم مسؤول المزرعة</label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              placeholder="اسم جهة الاتصال (اسم مسؤول المزرعة)"
              className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] ${
                errors.managerName ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            />
            {errors.managerName && <p className="text-xs text-red-500">{errors.managerName}</p>}
          </div>
        </div>

        {/* Agricultural Register File Upload */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-[#111111]">السجل الزراعي</label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            className="hidden"
          />

          <div
            onClick={triggerFileBrowser}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition hover:bg-[#faf8f5]/60 ${
              errors.file ? 'border-red-500 bg-red-50/20' : 'border-[#e0e0e0] bg-[#fdfcfa]/50'
            }`}
          >
            {fileName ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-[#e8f1eb] text-[#265C38]">
                  {/* File Doc Icon */}
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-[#111111] max-w-[180px] truncate">
                    {fileName}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                  >
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{fileSize}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2.5">
                <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-[#e8f1eb] text-[#265C38]">
                  {/* Upload Icon */}
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <span className="text-xs font-medium text-[#888888]">
                  {isEdit ? 'رفع سجل زراعي جديد' : 'رفع الملف'}
                </span>
              </div>
            )}
          </div>
          {errors.file && <p className="text-xs text-red-500">{errors.file}</p>}
        </div>

        {errors.general && (
          <div className="rounded-xl bg-red-50 p-3.5 text-center text-xs text-red-600">
            {errors.general}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#265C38] py-4 text-sm font-bold text-white shadow-lg shadow-[#163f24]/20 transition hover:bg-[#1f4f2c] focus:outline-none focus:ring-4 focus:ring-[#97cda6]"
          >
            {isEdit ? 'تعديل المزرعة' : 'إضافة مزرعة'}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <FarmConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        mode={mode}
        loading={isSubmitting}
      />
    </div>
  );
}
