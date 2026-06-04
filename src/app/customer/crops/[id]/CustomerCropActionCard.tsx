import type { Crop } from '@/services/api/crops';

type CustomerCropActionCardProps = {
  crop: Crop;
  isAuction: boolean;
  isSold: boolean;
  bidAmount: string;
  setBidAmount: (value: string) => void;
  errorMessage: string;
  onActionClick: () => void;
};

export function CustomerCropActionCard({
  crop,
  isAuction,
  isSold,
  bidAmount,
  setBidAmount,
  errorMessage,
  onActionClick,
}: CustomerCropActionCardProps) {
  return (
    <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-6 shadow-sm space-y-6 sticky top-24 text-right">
      <div>
        <span className="text-xs font-semibold text-gray-400 block mb-1">
          {isAuction ? 'أعلى عرض حالي' : 'السعر الإجمالي'}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-[#265C38]">{crop.price}</span>
          <span className="text-sm font-bold text-[#265C38]">ريال سعودي</span>
        </div>
      </div>

      {!isSold && (
        <div className="space-y-4 pt-4 border-t border-[#f0ebde]/45">
          {isAuction ? (
            <div className="space-y-2">
              <label htmlFor="crop-bid-amount" className="text-xs font-bold text-[#333333] block">
                أدخل قيمة عرضك المزايد:
              </label>
              <div className="relative">
                <input
                  id="crop-bid-amount"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  aria-invalid={Boolean(errorMessage)}
                  aria-describedby={errorMessage ? 'crop-bid-error' : undefined}
                  className="w-full bg-[#faf8f5] text-[#111111] font-bold text-center py-3 rounded-2xl border border-[#f0ebde] outline-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#888888]">
                  ريال
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#888888] leading-relaxed">
              الشراء الفوري يضمن لك الحصول على المحصول مباشرة بالسعر المحدد من المزارع.
            </p>
          )}

          {errorMessage && (
            <div
              id="crop-bid-error"
              className="bg-red-50 text-red-600 rounded-xl p-3 text-xs font-bold"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="button"
            onClick={onActionClick}
            className="w-full bg-[#265C38] hover:bg-[#1f4f2c] text-white text-sm font-bold py-4 rounded-2xl shadow-md shadow-[#265C38]/10 transition cursor-pointer"
          >
            {isAuction ? '⚖️ تقديم عرض سوم جديد' : '💳 شراء فوري الآن'}
          </button>
        </div>
      )}

      {isSold && (
        <div className="bg-red-50 text-red-600 rounded-2xl p-4 text-center text-xs font-bold">
          عذراً، هذا المحصول تم بيعه بالفعل ولم يعد متاحاً للشراء أو المزايدة.
        </div>
      )}
    </div>
  );
}
