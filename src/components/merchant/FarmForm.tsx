// src/components/merchant/FarmForm.tsx

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { type Farm } from '@/services/api/farms';
import { FarmConfirmModal } from './FarmConfirmModal';
import { FarmDetailsFields } from './FarmDetailsFields';
import { FarmRegisterUpload } from './FarmRegisterUpload';

interface FarmFormProps {
  initialData?: Farm;
  onSubmit: (data: Omit<Farm, 'id' | 'status'>) => Promise<void> | void;
  mode: 'create' | 'edit';
}

export function FarmForm({ initialData, onSubmit, mode }: FarmFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectLocation = () => {
    setLocation('القصيم - عنيزة، المملكة العربية السعودية');
    setErrors((prev) => {
      const next = { ...prev };
      delete next.location;
      return next;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const sizeMb = file.size / (1024 * 1024);
    setFileSize(sizeMb > 0.1 ? `${sizeMb.toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
    if (validateForm()) setIsModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        location,
        contactNumber,
        managerName,
        agriculturalRegisterUrl: fileName ? `/files/${fileName}` : '',
        area: initialData?.area || '50 دونم',
      });
      setIsModalOpen(false);
      router.push('/merchant/farms');
    } catch {
      setErrors({ general: 'حدث خطأ أثناء حفظ بيانات المزرعة' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="w-full text-right" dir="rtl">
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

      <form onSubmit={handleOpenConfirm} className="space-y-5">
        <FarmDetailsFields
          name={name}
          setName={setName}
          location={location}
          onSelectLocation={handleSelectLocation}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          managerName={managerName}
          setManagerName={setManagerName}
          errors={errors}
        />
        <FarmRegisterUpload
          fileInputRef={fileInputRef}
          fileName={fileName}
          fileSize={fileSize}
          isEdit={isEdit}
          errors={errors}
          onFileChange={handleFileChange}
          onClearFile={handleClearFile}
        />

        {errors.general && (
          <div className="rounded-xl bg-red-50 p-3.5 text-center text-xs text-red-600">
            {errors.general}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#265C38] py-4 text-sm font-bold text-white shadow-lg shadow-[#163f24]/20 transition hover:bg-[#1f4f2c] focus:outline-none focus:ring-4 focus:ring-[#97cda6]"
          >
            {isEdit ? 'تعديل المزرعة' : 'إضافة مزرعة'}
          </button>
        </div>
      </form>

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
