// src/app/customer/crops/[id]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCropById, Crop } from '@/services/api/crops';
import { useAuthStore } from '@/lib/store';
import { PurchaseOrder } from '@/services/api/orders';

export default function CustomerCropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);

  // Form states
  const [bidAmount, setBidAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadCrop() {
      try {
        setLoading(true);
        const data = await getCropById(id, token);
        setCrop(data);
        if (data) {
          // Set initial bid amount as current price + 100
          setBidAmount(String(data.price + 100));
        }
      } catch (err) {
        console.error('Failed to load crop details:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadCrop();
    }
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="h-10 w-10 border-4 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
        <span className="text-sm text-gray-500 font-bold">جاري تحميل تفاصيل المحصول...</span>
      </div>
    );
  }

  if (!crop) {
    return (
      <div className="text-center py-20 space-y-4">
        <span className="text-4xl">⚠️</span>
        <h2 className="text-lg font-bold text-[#111111]">المحصول غير موجود</h2>
        <p className="text-sm text-gray-500">
          لم نتمكن من العثور على المحصول المطلوب، قد يكون تم حذفه من قبل المزارع.
        </p>
        <Link href="/customer">
          <button className="bg-[#265C38] text-white font-bold px-6 py-2.5 rounded-xl mt-4">
            العودة للرئيسية
          </button>
        </Link>
      </div>
    );
  }

  const isAuction = crop.saleMethod === 'AUCTION';
  const isSold = crop.status === 'SOLD';
  const images = crop.images && crop.images.length > 0 ? crop.images : ['/images/placeholder-crop.png'];

  const handleActionClick = () => {
    setErrorMessage('');
    if (isAuction) {
      const bidVal = parseFloat(bidAmount);
      if (isNaN(bidVal) || bidVal <= crop.price) {
        setErrorMessage(`يجب أن تكون قيمة السوم أعلى من السعر الحالي (${crop.price} ريال)`);
        return;
      }
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      // Simulate placing order/bid in sessionStorage purchase list
      const storedOrdersRaw = sessionStorage.getItem('hasady-purchase-orders');
      let ordersList: PurchaseOrder[] = [];
      if (storedOrdersRaw) {
        try {
          ordersList = JSON.parse(storedOrdersRaw);
        } catch {
          ordersList = [];
        }
      }

      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

      const newOrder: PurchaseOrder = {
        id: `ord-${Date.now()}`,
        type: isAuction ? 'auction' : 'fixed',
        cropName: crop.name,
        description: crop.description,
        buyerName: user?.name || 'مشتري محاصيل',
        buyerPhone: user?.phone || '+966500000000',
        buyerRating: 4.8,
        buyerId: user?.id || '2308920932093',
        offeredPrice: isAuction ? parseFloat(bidAmount) : crop.price,
        currency: 'ريال سعودي',
        status: 'PENDING',
        createdAt: formattedDate,
        image: images[0],
      };

      // Append to the list and save
      ordersList = [newOrder, ...ordersList];
      sessionStorage.setItem('hasady-purchase-orders', JSON.stringify(ordersList));

      // If it's a bid, we also simulate updating the crop's highest price in sessionStorage crops
      if (isAuction) {
        const storedCropsRaw = sessionStorage.getItem('hasady-crops');
        if (storedCropsRaw) {
          try {
            const cropsList: Crop[] = JSON.parse(storedCropsRaw);
            const cropIdx = cropsList.findIndex((c) => c.id === crop.id);
            if (cropIdx !== -1) {
              cropsList[cropIdx].price = parseFloat(bidAmount);
              sessionStorage.setItem('hasady-crops', JSON.stringify(cropsList));
              setCrop(cropsList[cropIdx]);
            }
          } catch (e) {
            console.error(e);
          }
        }
      }

      // Close modal and route to my orders page
      setShowConfirmModal(false);
      router.push('/customer/orders');
    } catch (err) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء إتمام العملية، يرجى المحاولة مجدداً');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/customer" className="inline-flex items-center gap-2 text-sm font-bold text-[#265C38] hover:underline self-start">
        <span>← العودة لقائمة المحاصيل</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Middle Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery Card */}
          <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-6 shadow-sm space-y-4">
            <div className="relative h-64 md:h-96 bg-[#f4f7f5] rounded-3xl overflow-hidden flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={images[imageIndex]} alt={crop.name} className="w-full h-full object-cover" />
              
              {/* Image Tags */}
              <span className="absolute top-4 right-4 bg-[#265C38] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-sm">
                {isAuction ? '⚖️ مزاد علني' : '🏷️ سعر ثابت'}
              </span>

              {isSold && (
                <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                  <span className="bg-[#d32f2f] text-white text-base font-extrabold px-6 py-2.5 rounded-xl">
                    تم البيع بالكامل
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail dots */}
            {images.length > 1 && (
              <div className="flex justify-center gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setImageIndex(idx)}
                    className={`h-2.5 rounded-full transition ${
                      imageIndex === idx ? 'w-6 bg-[#265C38]' : 'w-2.5 bg-[#f0ebde]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description & Specs Card */}
          <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 shadow-sm space-y-6 text-right">
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-[#111111]">{crop.name}</h1>
              <p className="text-sm leading-relaxed text-[#666666]">{crop.description}</p>
            </div>

            <div className="border-t border-[#f0ebde]/45 pt-6 space-y-4">
              <h3 className="text-base font-bold text-[#265C38]">معلومات المحصول والتوصيل</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
                <div className="space-y-1">
                  <span className="block text-gray-400 font-semibold text-xs">طريقة البيع</span>
                  <span className="font-bold text-[#333333]">{isAuction ? 'بيع بالمزاد' : 'شراء فوري سعر ثابت'}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-gray-400 font-semibold text-xs">الكمية الإجمالية</span>
                  <span className="font-bold text-[#333333]">{crop.quantity} {crop.quantityUnit}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-gray-400 font-semibold text-xs">طريقة الشحن</span>
                  <span className="font-bold text-[#333333]">{crop.deliveryMethod}</span>
                </div>
              </div>
            </div>

            {/* Farm & Driver card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#f0ebde]/45 pt-6">
              {/* Farm Details */}
              <div className="bg-[#faf8f5] border border-[#f0ebde]/45 rounded-3xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-[#265C38] flex items-center gap-2">
                  <span>🏡</span>
                  <span>تفاصيل المزرعة والمنتج</span>
                </h4>
                <div className="text-xs space-y-2 text-[#444444]">
                  <div><span className="text-gray-400 font-semibold">المزرعة:</span> <span className="font-bold">{crop.farmName}</span></div>
                  <div><span className="text-gray-400 font-semibold">اسم المدير المسؤول:</span> <span className="font-bold">{crop.managerName}</span></div>
                  <div><span className="text-gray-400 font-semibold">رقم التواصل:</span> <span className="font-bold font-mono" dir="ltr">{crop.contact}</span></div>
                </div>
              </div>

              {/* Driver Details */}
              <div className="bg-[#faf8f5] border border-[#f0ebde]/45 rounded-3xl p-5 space-y-3">
                <h4 className="text-sm font-bold text-[#265C38] flex items-center gap-2">
                  <span>🚚</span>
                  <span>بيانات التوصيل والسائق</span>
                </h4>
                <div className="text-xs space-y-2 text-[#444444]">
                  <div><span className="text-gray-400 font-semibold">السائق:</span> <span className="font-bold">{crop.driverName || 'سائق معتمد'}</span></div>
                  <div><span className="text-gray-400 font-semibold">رقم الجوال:</span> <span className="font-bold font-mono" dir="ltr">{crop.driverPhone || '0590000000'}</span></div>
                  <div><span className="text-gray-400 font-semibold">الحالة:</span> <span className="font-bold text-[#265C38]">جاهز للتوصيل فوراً</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Action Form Card */}
        <div className="space-y-6">
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

            {/* Inputs based on type */}
            {!isSold && (
              <div className="space-y-4 pt-4 border-t border-[#f0ebde]/45">
                {isAuction ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#333333] block">أدخل قيمة عرضك المزايد:</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full bg-[#faf8f5] text-[#111111] font-bold text-center py-3 rounded-2xl border border-[#f0ebde] outline-none"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#888888]">ريال</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#888888] leading-relaxed">
                    الشراء الفوري يضمن لك الحصول على المحصول مباشرة بالسعر المحدد من المزارع.
                  </p>
                )}

                {errorMessage && (
                  <div className="bg-red-50 text-red-600 rounded-xl p-3 text-xs font-bold">
                    {errorMessage}
                  </div>
                )}

                <button
                  onClick={handleActionClick}
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
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn" dir="rtl">
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
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold py-3.5 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'تأكيد'}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-3.5 rounded-xl transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
