import type { Farm } from '@/services/api/farms';

type CropDetailsFieldsProps = {
  farmId: string;
  setFarmId: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  quantityUnit: string;
  setQuantityUnit: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  farms: Farm[];
  loadingFarms: boolean;
  isEdit: boolean;
  errors: Record<string, string>;
};

const fieldClass =
  'w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38]';
const selectClass =
  'w-full appearance-none rounded-xl border bg-white p-3.5 pl-10 text-sm text-[#333333] outline-none transition focus:border-[#265C38]';

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="text-xs text-red-500">
      {error}
    </p>
  );
}

function SelectArrow() {
  return (
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
  );
}

export function CropDetailsFields({
  farmId,
  setFarmId,
  category,
  setCategory,
  name,
  setName,
  quantityUnit,
  setQuantityUnit,
  quantity,
  setQuantity,
  description,
  setDescription,
  farms,
  loadingFarms,
  isEdit,
  errors,
}: CropDetailsFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="crop-farm" className="text-sm font-bold text-[#111111]">
          تحديد المزرعة
        </label>
        <div className="relative">
          <select
            id="crop-farm"
            value={farmId}
            onChange={(e) => setFarmId(e.target.value)}
            disabled={loadingFarms || isEdit}
            aria-invalid={Boolean(errors.farmId)}
            aria-describedby={errors.farmId ? 'crop-farm-error' : undefined}
            className={`${selectClass} ${errors.farmId ? 'border-red-500' : 'border-[#e0e0e0]'}`}
          >
            {loadingFarms ? (
              <option value="">جاري تحميل المزارع...</option>
            ) : farms.length === 0 ? (
              <option value="">لا توجد مزارع موثقة (يرجى توثيق مزرعة أولاً)</option>
            ) : (
              farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name} (المعرف: {farm.id})
                </option>
              ))
            )}
          </select>
          <SelectArrow />
        </div>
        <ErrorText id="crop-farm-error" error={errors.farmId} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="crop-category" className="text-sm font-bold text-[#111111]">
          تحديد صنف المحصول
        </label>
        <div className="relative">
          <select
            id="crop-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? 'crop-category-error' : undefined}
            className={`${selectClass} ${errors.category ? 'border-red-500' : 'border-[#e0e0e0]'}`}
          >
            <option value="">اختر من قائمة الأصناف</option>
            <option value="خضار">خضروات</option>
            <option value="فواكه">فواكه</option>
            <option value="حبوب">حبوب وغلال</option>
            <option value="تمور">تمور</option>
            <option value="أخرى">أخرى</option>
          </select>
          <SelectArrow />
        </div>
        <ErrorText id="crop-category-error" error={errors.category} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="crop-name" className="text-sm font-bold text-[#111111]">
          إسم المحصول
        </label>
        <input
          id="crop-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسم المحصول كما يظهر للمشترين"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'crop-name-error' : undefined}
          className={`${fieldClass} ${errors.name ? 'border-red-500' : 'border-[#e0e0e0]'}`}
        />
        <ErrorText id="crop-name-error" error={errors.name} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="crop-quantity-unit" className="text-sm font-bold text-[#111111]">
          وحدة قياس الكمية
        </label>
        <div className="relative">
          <select
            id="crop-quantity-unit"
            value={quantityUnit}
            onChange={(e) => setQuantityUnit(e.target.value)}
            aria-invalid={Boolean(errors.quantityUnit)}
            aria-describedby={errors.quantityUnit ? 'crop-quantity-unit-error' : undefined}
            className={`${selectClass} ${errors.quantityUnit ? 'border-red-500' : 'border-[#e0e0e0]'}`}
          >
            <option value="">اختر وحدة قياس تناسب نوع المحصول</option>
            <option value="كغم">كيلوجرام (كغم)</option>
            <option value="طن">طن</option>
            <option value="صندوق">صندوق</option>
            <option value="سلة">سلة</option>
          </select>
          <SelectArrow />
        </div>
        <ErrorText id="crop-quantity-unit-error" error={errors.quantityUnit} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="crop-quantity" className="text-sm font-bold text-[#111111]">
          كمية المنتج
        </label>
        <input
          id="crop-quantity"
          type="text"
          inputMode="numeric"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value.replace(/\D/g, ''))}
          placeholder="يرجى كتابة عدد صحيح فقط (بدون رموز أو حروف)"
          aria-invalid={Boolean(errors.quantity)}
          aria-describedby={errors.quantity ? 'crop-quantity-error' : undefined}
          className={`${fieldClass} ${errors.quantity ? 'border-red-500' : 'border-[#e0e0e0]'}`}
        />
        <ErrorText id="crop-quantity-error" error={errors.quantity} />
      </div>

      <div className="space-y-1.5 md:col-span-2">
        <label htmlFor="crop-description" className="text-sm font-bold text-[#111111]">
          وصف المحصول
        </label>
        <textarea
          id="crop-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="أضف وصفاً واضحاً وموجزاً يوضح تفاصيل المنتج للمشترين"
          rows={3}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={errors.description ? 'crop-description-error' : undefined}
          className={`w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38] resize-none ${
            errors.description ? 'border-red-500' : 'border-[#e0e0e0]'
          }`}
        />
        <ErrorText id="crop-description-error" error={errors.description} />
      </div>
    </>
  );
}
