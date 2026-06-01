// src/components/merchant/CropForm.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { agentLog } from '@/lib/agent-debug';
import { getFarms, Farm } from '@/services/api/farms';
import { Crop } from '@/services/api/crops';
import { CropConfirmModal } from './CropConfirmModal';

interface CropFormProps {
  initialData?: Crop;
  onSubmit: (data: Omit<Crop, 'id' | 'status'>) => Promise<void> | void;
  mode: 'create' | 'edit';
}

export function CropForm({ initialData, onSubmit, mode }: CropFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Farms list for dropdown selection
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(true);

  // Form Fields State
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

  // UI States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load farms list
  useEffect(() => {
    getFarms()
      .then((data) => {
        // Only allow listing crops for approved farms
        const approved = data.filter((f) => f.status === 'APPROVED');
        // #region agent log
        agentLog(
          'CropForm.tsx:loadFarms',
          'farms_loaded',
          {
            totalFarms: data.length,
            approvedCount: approved.length,
            currentFarmId: farmId || null,
            willAutoSelect: approved.length > 0 && !farmId,
          },
          'C'
        );
        // #endregion
        setFarms(approved);
        if (approved.length > 0 && !farmId) {
          setFarmId(approved[0].id);
        }
      })
      .catch((err) => {
        console.error('Failed to load farms:', err);
      })
      .finally(() => {
        setLoadingFarms(false);
      });
  }, [farmId]);

  // Handle image files change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newNames: string[] = [];
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        newNames.push(files[i].name);
        // Mock a local object URL or random crop images for mockup purposes
        // Since we want realistic pictures, let's alternate mock images
        const idx = (uploadedImages.length + i) % 2;
        const mockImg = idx === 0 ? '/images/crops/cucumber.png' : '/images/crops/tomato.png';
        newUrls.push(mockImg);
      }

      setImageNames((prev) => [...prev, ...newNames]);
      setUploadedImages((prev) => [...prev, ...newUrls]);

      if (errors.images) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.images;
          return next;
        });
      }
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const handleClearImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setImageNames((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!farmId) newErrors.farmId = 'يرجى اختيار المزرعة';
    if (!category) newErrors.category = 'يرجى اختيار صنف المحصول';
    if (!name.trim()) newErrors.name = 'إسم المحصول مطلوب';
    if (!description.trim()) newErrors.description = 'وصف المحصول مطلوب';
    if (!quantityUnit) newErrors.quantityUnit = 'يرجى اختيار وحدة قياس الكمية';
    if (!quantity.trim() || isNaN(Number(quantity))) {
      newErrors.quantity = 'يرجى إدخال كمية صحيحة';
    }
    if (uploadedImages.length === 0) {
      newErrors.images = 'يجب رفع صورة واحدة على الأقل للمنتج';
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = 'يرجى إدخال سعر صحيح أكبر من الصفر';
    }
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
    if (validateForm()) {
      setIsModalOpen(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedFarm = farms.find((f) => f.id === farmId);
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
    } catch (err) {
      console.error(err);
      setErrors({ general: 'حدث خطأ أثناء حفظ بيانات المحصول' });
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
          {/* Select Farm */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">تحديد المزرعة</label>
            <div className="relative">
              <select
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                disabled={loadingFarms || isEdit}
                className={`w-full appearance-none rounded-xl border bg-white p-3.5 pl-10 text-sm text-[#333333] outline-none transition focus:border-[#265C38] ${
                  errors.farmId ? 'border-red-500' : 'border-[#e0e0e0]'
                }`}
              >
                {loadingFarms ? (
                  <option value="">جاري تحميل المزارع...</option>
                ) : farms.length === 0 ? (
                  <option value="">لا توجد مزارع موثقة (يرجى توثيق مزرعة أولاً)</option>
                ) : (
                  farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} (المعرف: {f.id})
                    </option>
                  ))
                )}
              </select>
              {/* Custom Arrow */}
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.farmId && <p className="text-xs text-red-500">{errors.farmId}</p>}
          </div>

          {/* Select Crop Category */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">تحديد صنف المحصول</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full appearance-none rounded-xl border bg-white p-3.5 pl-10 text-sm text-[#333333] outline-none transition focus:border-[#265C38] ${
                  errors.category ? 'border-red-500' : 'border-[#e0e0e0]'
                }`}
              >
                <option value="">اختر من قائمة الأصناف</option>
                <option value="خضار">خضروات</option>
                <option value="فواكه">فواكه</option>
                <option value="حبوب">حبوب وغلال</option>
                <option value="تمور">تمور</option>
                <option value="أخرى">أخرى</option>
              </select>
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
          </div>

          {/* Crop Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">إسم المحصول</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسم المحصول كما يظهر للمشترين"
              className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] ${
                errors.name ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* Quantity Unit */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">وحدة قياس الكمية</label>
            <div className="relative">
              <select
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
                className={`w-full appearance-none rounded-xl border bg-white p-3.5 pl-10 text-sm text-[#333333] outline-none transition focus:border-[#265C38] ${
                  errors.quantityUnit ? 'border-red-500' : 'border-[#e0e0e0]'
                }`}
              >
                <option value="">اختر وحدة قياس تناسب نوع المحصول</option>
                <option value="كغم">كيلوجرام (كغم)</option>
                <option value="طن">طن</option>
                <option value="صندوق">صندوق</option>
                <option value="سلة">سلة</option>
              </select>
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.quantityUnit && <p className="text-xs text-red-500">{errors.quantityUnit}</p>}
          </div>

          {/* Product Quantity */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">كمية المنتج</label>
            <input
              type="text"
              inputMode="numeric"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ''))}
              placeholder="يرجى كتابة عدد صحيح فقط (بدون رموز أو حروف)"
              className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] ${
                errors.quantity ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            />
            {errors.quantity && <p className="text-xs text-red-500">{errors.quantity}</p>}
          </div>

          {/* Requested Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">السعر المطلوب</label>
            <div
              className={`flex items-center rounded-xl border bg-white overflow-hidden transition focus-within:border-[#265C38] ${
                errors.price ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            >
              {/* Currency Suffix Prefix (Left side in RTL box) */}
              <div className="bg-[#265C38] text-white flex items-center justify-center px-4 self-stretch font-bold text-sm">
                ﷼
              </div>

              {/* Input field */}
              <input
                type="text"
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
                placeholder="السعر الثابت أو أقل سعر للمزايدة"
                className="w-full bg-transparent p-3.5 text-sm text-[#333333] outline-none placeholder:text-[#cccccc]"
              />
            </div>
            {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
          </div>

          {/* Sale Method (Fixed / Auction) */}
          <div className="space-y-2 flex flex-col justify-center">
            <label className="text-sm font-bold text-[#111111] block">طريقة البيع</label>
            <div className="flex gap-6 items-center mt-1">
              {/* Fixed Price */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="saleMethod"
                  checked={saleMethod === 'FIXED'}
                  onChange={() => setSaleMethod('FIXED')}
                  className="accent-[#265C38] h-4 w-4"
                />
                <span className="text-xs font-bold text-[#333333]">سعر ثابت</span>
              </label>

              {/* Auction */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="saleMethod"
                  checked={saleMethod === 'AUCTION'}
                  onChange={() => setSaleMethod('AUCTION')}
                  className="accent-[#265C38] h-4 w-4"
                />
                <span className="text-xs font-bold text-[#333333]">بيع مزاد</span>
              </label>
            </div>
          </div>

          {/* Select Receipt Method */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">تحديد طريقة الإستلام</label>
            <div className="relative">
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className={`w-full appearance-none rounded-xl border bg-white p-3.5 pl-10 text-sm text-[#333333] outline-none transition focus:border-[#265C38] ${
                  errors.deliveryMethod ? 'border-red-500' : 'border-[#e0e0e0]'
                }`}
              >
                <option value="">قم باختيار طريقة التسليم المناسبة</option>
                <option value="من المزرعة">من المزرعة</option>
                <option value="توصيل لباب المزرعة">توصيل لباب المزرعة</option>
                <option value="توصيل للتاجر">توصيل للتاجر</option>
              </select>
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.deliveryMethod && (
              <p className="text-xs text-red-500">{errors.deliveryMethod}</p>
            )}
          </div>

          {/* Driver Contact */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">رقم هاتف السائق</label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={driverPhone}
              onChange={(e) => setDriverPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="رقم التواصل السائق"
              className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] ${
                errors.driverPhone ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            />
            {errors.driverPhone && <p className="text-xs text-red-500">{errors.driverPhone}</p>}
          </div>

          {/* Driver Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-[#111111]">اسم السائق</label>
            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="اسم جهة الاتصال (السائق)"
              className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] ${
                errors.driverName ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            />
            {errors.driverName && <p className="text-xs text-red-500">{errors.driverName}</p>}
          </div>

          {/* Crop Description - Full Width */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-bold text-[#111111]">وصف المحصول</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="أضف وصفاً واضحاً وموجزاً يوضح تفاصيل المنتج للمشترين"
              rows={3}
              className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] resize-none ${
                errors.description ? 'border-red-500' : 'border-[#e0e0e0]'
              }`}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* Media Upload - Full Width */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-bold text-[#111111]">صور وفيديو المنتج</label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*,video/*"
              className="hidden"
            />

            <div
              onClick={triggerFileBrowser}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center transition hover:bg-[#faf8f5]/60 ${
                errors.images ? 'border-red-500 bg-red-50/20' : 'border-[#e0e0e0] bg-[#fdfcfa]/50'
              }`}
            >
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
                <span className="text-xs font-bold text-[#888888]">رفع صور للمنتج</span>
                <span className="text-[10px] text-gray-400">
                  ملاحظة: يجب رفع صورة واحدة على الأقل للمنتج
                </span>
              </div>
            </div>

            {/* Render uploaded image files list */}
            {imageNames.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {imageNames.map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs text-[#333333]"
                  >
                    <span className="max-w-[120px] truncate">{name}</span>
                    <button
                      type="button"
                      onClick={(e) => handleClearImage(idx, e)}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                    >
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {errors.images && <p className="text-xs text-red-500">{errors.images}</p>}
          </div>
        </div>

        {errors.general && (
          <div className="rounded-xl bg-red-50 p-3.5 text-center text-xs text-red-600">
            {errors.general}
          </div>
        )}

        {/* Submit button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-2xl bg-[#265C38] py-4 text-sm font-bold text-white shadow-lg shadow-[#163f24]/20 transition hover:bg-[#1f4f2c] focus:outline-none focus:ring-4 focus:ring-[#97cda6] cursor-pointer"
          >
            {isEdit ? 'تعديل المحصول' : 'إضافة المحصول'}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
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
