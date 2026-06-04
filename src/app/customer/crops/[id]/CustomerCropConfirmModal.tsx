import type { Crop } from '@/services/api/crops';

type CustomerCropConfirmModalProps = {
  crop: Crop;
  isAuction: boolean;
  bidAmount: string;
  isSubmitting: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function CustomerCropConfirmModal({
  crop,
  isAuction,
  bidAmount,
  isSubmitting,
  onConfirm,
  onClose,
}: CustomerCropConfirmModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn"
      dir="rtl"
    >
      <div className="bg-white rounded-[2.5rem] border border-[#f0ebde] max-w-sm w-full p-6 text-center space-y-6 shadow-2xl">
        <span className="text-4xl block">✨</span>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-[#111111]">
            {isAuction ? 'تأكيد تقديم السوم' : 'تأكيد الشراء الفوري'}
          </h3>
          <p className="text-xs text-[#888888] leading-relaxed">
            {isAuction
              ? `هل أنت متأكد من تقديم سومك بقيمة ${bidAmount} ريال على محصول ${crop.name}؟`
              : `هل أنت متأكد من رغبتك في شراء محصول ${crop.name} بقيمة ${crop.price} ريال؟`}
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الإرسال...' : 'تأكيد'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-3.5 rounded-xl transition cursor-pointer"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
