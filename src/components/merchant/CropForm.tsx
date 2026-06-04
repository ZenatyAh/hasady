// src/components/merchant/CropForm.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFarms, type Farm } from '@/services/api/farms';
import { type Crop } from '@/services/api/crops';
import { CropConfirmModal } from './CropConfirmModal';
import { CropDeliveryFields } from './CropDeliveryFields';
import { CropDetailsFields } from './CropDetailsFields';
import { CropMediaUpload } from './CropMediaUpload';
import { CropSaleFields } from './CropSaleFields';

interface CropFormProps {
  initialData?: Crop;
  onSubmit: (data: Omit<Crop, 'id' | 'status'>) => Promise<void> | void;
  mode: 'create' | 'edit';
}

export function CropForm({ initialData, onSubmit, mode }: CropFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [farmId, setFarmId] = useState(initialData?.farmId || '');
  const [category, setCategory] = useState(initialData ? 'خضار' : '');
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [quantityUnit, setQuantityUnit] = useState(initialData?.quantityUnit || '');
  const [quantity, setQuantity] = useState(initialData ? String(initialData.quantity) : '');
  const [saleMethod, setSaleMethod] = useState<'FIXED' | 'AUCTION'>(
    initialData?.saleMethod || 'FIXED'
  );
  const [price, setPrice] = useState(initialData ? String(initialData.price) : '');
  const [deliveryMethod, setDeliveryMethod] = useState(initialData?.deliveryMethod || '');
  const [driverPhone, setDriverPhone] = useState(initialData?.driverPhone || '');
  const [driverName, setDriverName] = useState(initialData?.driverName || '');
  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || []);
  const [imageNames, setImageNames] = useState<string[]>(
    initialData?.images?.map((img) => img.split('/').pop() || 'image.png') || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getFarms()
      .then((data) => {
        if (!isMounted) return;
        const approved = data.filter((farm) => farm.status === 'APPROVED');
        setFarms(approved);
        if (approved.length > 0 && !farmId) {
          setFarmId(approved[0].id);
        }
      })
      .catch(() => {
        if (isMounted) setErrors({ general: 'تعذر تحميل قائمة المزارع' });
      })
      .finally(() => {
        if (isMounted) setLoadingFarms(false);
      });

    return () => {
      isMounted = false;
    };
  }, [farmId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const newNames: string[] = [];
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newNames.push(files[i].name);
      const idx = (uploadedImages.length + i) % 2;
      newUrls.push(idx === 0 ? '/images/crops/cucumber.png' : '/images/crops/tomato.png');
    }

    setImageNames((prev) => [...prev, ...newNames]);
    setUploadedImages((prev) => [...prev, ...newUrls]);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.images;
      return next;
    });
  };

  const handleClearImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageNames((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!farmId) newErrors.farmId = 'يرجى اختيار المزرعة';
    if (!category) newErrors.category = 'يرجى اختيار صنف المحصول';
    if (!name.trim()) newErrors.name = 'إسم المحصول مطلوب';
    if (!description.trim()) newErrors.description = 'وصف المحصول مطلوب';
    if (!quantityUnit) newErrors.quantityUnit = 'يرجى اختيار وحدة قياس الكمية';
    if (!quantity.trim() || Number(quantity) <= 0) newErrors.quantity = 'يرجى إدخال كمية صحيحة';
    if (uploadedImages.length === 0) newErrors.images = 'يجب رفع صورة واحدة على الأقل للمنتج';
    if (!price.trim() || Number(price) <= 0) newErrors.price = 'يرجى إدخال سعر صحيح أكبر من الصفر';
    if (!deliveryMethod) newErrors.deliveryMethod = 'يرجى تحديد طريقة الاستلام';
    if (!driverPhone.trim()) {
      newErrors.driverPhone = 'رقم هاتف السائق مطلوب';
    } else if (!/^05\d{8}$/.test(driverPhone)) {
      newErrors.driverPhone = 'رقم هاتف السائق غير صحيح، يجب أن يبدأ بـ 05 ويتكون من 10 أرقام';
    }
    if (!driverName.trim()) newErrors.driverName = 'اسم السائق مطلوب';

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
      const selectedFarm = farms.find((farm) => farm.id === farmId);
      await onSubmit({
        name,
        description,
        saleMethod,
        quantity: Number(quantity),
        quantityUnit,
        price: Number(price),
        deliveryMethod,
        driverPhone,
        driverName,
        images: uploadedImages,
        farmId,
        farmName: selectedFarm?.name || 'مزرعة الخيرات النجدية',
        contact: selectedFarm?.contactNumber || '0501234567',
        managerName: selectedFarm?.managerName || 'عبدالعزيز السبيعي',
      });
      setIsModalOpen(false);
      router.push('/merchant/crops');
    } catch {
      setErrors({ general: 'حدث خطأ أثناء حفظ بيانات المحصول' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = mode === 'edit';

  return (
    <div className="w-full text-right" dir="rtl">
      <div className="mb-6 mt-2">
        <h2 className="text-lg font-bold text-[#265C38]">
          {isEdit ? 'تعديل المحصول' : 'إضافة محصول جديد'}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-[#888888]">
          {isEdit
            ? 'قم بتعديل تفاصيل المحصول للحفاظ على تحديث بياناتك أمام المشترين في السوق'
            : 'أدخل تفاصيل المحصول لتتمكن من عرضه في السوق والوصول إلى المهتمين مباشرة'}
        </p>
      </div>

      <form onSubmit={handleOpenConfirm} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          <CropDetailsFields
            farmId={farmId}
            setFarmId={setFarmId}
            category={category}
            setCategory={setCategory}
            name={name}
            setName={setName}
            quantityUnit={quantityUnit}
            setQuantityUnit={setQuantityUnit}
            quantity={quantity}
            setQuantity={setQuantity}
            description={description}
            setDescription={setDescription}
            farms={farms}
            loadingFarms={loadingFarms}
            isEdit={isEdit}
            errors={errors}
          />
          <CropSaleFields
            price={price}
            setPrice={setPrice}
            saleMethod={saleMethod}
            setSaleMethod={setSaleMethod}
            errors={errors}
          />
          <CropDeliveryFields
            deliveryMethod={deliveryMethod}
            setDeliveryMethod={setDeliveryMethod}
            driverPhone={driverPhone}
            setDriverPhone={setDriverPhone}
            driverName={driverName}
            setDriverName={setDriverName}
            errors={errors}
          />
          <CropMediaUpload
            fileInputRef={fileInputRef}
            imageNames={imageNames}
            errors={errors}
            onFileChange={handleFileChange}
            onClearImage={handleClearImage}
          />
        </div>

        {errors.general && (
          <div className="rounded-xl bg-red-50 p-3.5 text-center text-xs text-red-600">
            {errors.general}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#265C38] py-4 text-sm font-bold text-white shadow-lg shadow-[#163f24]/20 transition hover:bg-[#1f4f2c] focus:outline-none focus:ring-4 focus:ring-[#97cda6] cursor-pointer"
          >
            {isEdit ? 'تعديل المحصول' : 'إضافة المحصول'}
          </button>
        </div>
      </form>

      <CropConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSubmit}
        mode={mode}
        loading={isSubmitting}
      />
    </div>
  );
}
