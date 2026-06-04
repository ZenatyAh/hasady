type CropSaleFieldsProps = {
  price: string;
  setPrice: (value: string) => void;
  saleMethod: 'FIXED' | 'AUCTION';
  setSaleMethod: (value: 'FIXED' | 'AUCTION') => void;
  errors: Record<string, string>;
};

export function CropSaleFields({
  price,
  setPrice,
  saleMethod,
  setSaleMethod,
  errors,
}: CropSaleFieldsProps) {
  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="crop-price" className="text-sm font-bold text-[#111111]">
          السعر المطلوب
        </label>
        <div
          className={`flex items-center rounded-xl border bg-white overflow-hidden transition focus-within:border-[#265C38] ${
            errors.price ? 'border-red-500' : 'border-[#e0e0e0]'
          }`}
        >
          <div className="bg-[#265C38] text-white flex items-center justify-center px-4 self-stretch font-bold text-sm">
            ﷼
          </div>
          <input
            id="crop-price"
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, ''))}
            placeholder="السعر الثابت أو أقل سعر للمزايدة"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? 'crop-price-error' : undefined}
            className="w-full bg-transparent p-3.5 text-sm text-[#333333] outline-none placeholder:text-[#cccccc]"
          />
        </div>
        {errors.price && (
          <p id="crop-price-error" className="text-xs text-red-500">
            {errors.price}
          </p>
        )}
      </div>

      <fieldset className="space-y-2 flex flex-col justify-center">
        <legend className="text-sm font-bold text-[#111111] block">طريقة البيع</legend>
        <div className="flex gap-6 items-center mt-1">
          <label className="flex items-center gap-2 cursor-pointer" htmlFor="crop-sale-fixed">
            <input
              id="crop-sale-fixed"
              type="radio"
              name="saleMethod"
              checked={saleMethod === 'FIXED'}
              onChange={() => setSaleMethod('FIXED')}
              className="accent-[#265C38] h-4 w-4"
            />
            <span className="text-xs font-bold text-[#333333]">سعر ثابت</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer" htmlFor="crop-sale-auction">
            <input
              id="crop-sale-auction"
              type="radio"
              name="saleMethod"
              checked={saleMethod === 'AUCTION'}
              onChange={() => setSaleMethod('AUCTION')}
              className="accent-[#265C38] h-4 w-4"
            />
            <span className="text-xs font-bold text-[#333333]">بيع مزاد</span>
          </label>
        </div>
      </fieldset>
    </>
  );
}
