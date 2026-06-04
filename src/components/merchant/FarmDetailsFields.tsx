type FarmDetailsFieldsProps = {
  name: string;
  setName: (value: string) => void;
  location: string;
  onSelectLocation: () => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  managerName: string;
  setManagerName: (value: string) => void;
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

export function FarmDetailsFields({
  name,
  setName,
  location,
  onSelectLocation,
  contactNumber,
  setContactNumber,
  managerName,
  setManagerName,
  errors,
}: FarmDetailsFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
      <div className="space-y-1.5">
        <label htmlFor="farm-name" className="text-sm font-bold text-[#111111]">
          إسم المزرعة
        </label>
        <input
          id="farm-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="الإسم التعريفي للمزرعة"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'farm-name-error' : undefined}
          className={`${fieldClass} ${errors.name ? 'border-red-500' : 'border-[#e0e0e0]'}`}
        />
        <ErrorText id="farm-name-error" error={errors.name} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="farm-location" className="text-sm font-bold text-[#111111]">
          تعيين الموقع الجغرافي
        </label>
        <div
          className={`relative flex items-center justify-between rounded-xl border bg-white pl-1.5 pr-3.5 py-1.5 outline-none transition focus-within:border-[#265C38] ${
            errors.location ? 'border-red-500' : 'border-[#e0e0e0]'
          }`}
        >
          <span
            id="farm-location"
            className={`text-sm flex-1 truncate ${location ? 'text-[#333333]' : 'text-[#cccccc]'}`}
          >
            {location || 'تعيين الموقع الجغرافي على الخريطة'}
          </span>
          <button
            type="button"
            onClick={onSelectLocation}
            aria-describedby={errors.location ? 'farm-location-error' : undefined}
            className="rounded-lg bg-[#265C38] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1f4f2c] focus:outline-none cursor-pointer"
          >
            حدد موقع مزرعتك
          </button>
        </div>
        <ErrorText id="farm-location-error" error={errors.location} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="farm-contact-number" className="text-sm font-bold text-[#111111]">
          رقم تواصل المزرعة
        </label>
        <input
          id="farm-contact-number"
          type="tel"
          inputMode="numeric"
          maxLength={10}
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="رقم التواصل مسؤول المزرعة"
          aria-invalid={Boolean(errors.contactNumber)}
          aria-describedby={errors.contactNumber ? 'farm-contact-number-error' : undefined}
          className={`${fieldClass} ${errors.contactNumber ? 'border-red-500' : 'border-[#e0e0e0]'}`}
        />
        <ErrorText id="farm-contact-number-error" error={errors.contactNumber} />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="farm-manager-name" className="text-sm font-bold text-[#111111]">
          اسم مسؤول المزرعة
        </label>
        <input
          id="farm-manager-name"
          type="text"
          value={managerName}
          onChange={(e) => setManagerName(e.target.value)}
          placeholder="اسم جهة الاتصال (اسم مسؤول المزرعة)"
          aria-invalid={Boolean(errors.managerName)}
          aria-describedby={errors.managerName ? 'farm-manager-name-error' : undefined}
          className={`${fieldClass} ${errors.managerName ? 'border-red-500' : 'border-[#e0e0e0]'}`}
        />
        <ErrorText id="farm-manager-name-error" error={errors.managerName} />
      </div>
    </div>
  );
}
