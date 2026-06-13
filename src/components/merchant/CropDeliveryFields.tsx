type CropDeliveryFieldsProps = {
  deliveryMethod: string;
  setDeliveryMethod: (value: string) => void;
  driverPhone: string;
  setDriverPhone: (value: string) => void;
  driverName: string;
  setDriverName: (value: string) => void;
  errors: Record<string, string>;
};

const fieldClass =
  'w-full rounded-xl border bg-white p-3.5 text-sm text-[#333333] outline-none transition placeholder:text-[#cccccc] focus:border-[#265C38]';

function ErrorText({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={id} className="text-xs text-red-500">
      {error}
    </p>
  );
}

export function CropDeliveryFields({
  deliveryMethod,
  setDeliveryMethod,
  driverPhone,
  setDriverPhone,
  driverName,
  setDriverName,
  errors,
}: CropDeliveryFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="crop-delivery-method" className="text-sm font-bold text-[#111111]">
          تحديد طريقة الإستلام
        </label>
        <div className="relative">
          <select
            id="crop-delivery-method"
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
            aria-invalid={Boolean(errors.deliveryMethod)}
            aria-describedby={errors.deliveryMethod ? 'crop-delivery-method-error' : undefined}
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
        <ErrorText id="crop-delivery-method-error" error={errors.deliveryMethod} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="crop-driver-phone" className="text-sm font-bold text-[#111111]">
          رقم هاتف السائق
        </label>
        <input
          id="crop-driver-phone"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={driverPhone}
          onChange={(e) => setDriverPhone(e.target.value.replace(/\D/g, ''))}
          placeholder="رقم التواصل السائق"
          aria-invalid={Boolean(errors.driverPhone)}
          aria-describedby={errors.driverPhone ? 'crop-driver-phone-error' : undefined}
          className={`${fieldClass} ${errors.driverPhone ? 'border-red-500' : 'border-[#e0e0e0]'}`}
        />
        <ErrorText id="crop-driver-phone-error" error={errors.driverPhone} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="crop-driver-name" className="text-sm font-bold text-[#111111]">
          اسم السائق
        </label>
        <input
          id="crop-driver-name"
          type="text"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          placeholder="اسم جهة الاتصال (السائق)"
          aria-invalid={Boolean(errors.driverName)}
          aria-describedby={errors.driverName ? 'crop-driver-name-error' : undefined}
          className={`${fieldClass} ${errors.driverName ? 'border-red-500' : 'border-[#e0e0e0]'}`}
        />
        <ErrorText id="crop-driver-name-error" error={errors.driverName} />
      </div>
    </>
  );
}
