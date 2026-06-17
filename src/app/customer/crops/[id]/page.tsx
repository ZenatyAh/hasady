// src/app/customer/crops/[id]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getMarketProduct } from '@/services/api/market';
import { placeOrder } from '@/services/api/orders';
import { placeBid } from '@/services/api/auctions';
import type { Crop } from '@/services/api/crops';
import { CustomerCropActionCard } from './CustomerCropActionCard';
import { CustomerCropConfirmModal } from './CustomerCropConfirmModal';
import { CustomerCropGallery } from './CustomerCropGallery';

export default function CustomerCropDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [crop, setCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadCrop() {
      try {
        setLoading(true);
        const data = await getMarketProduct(id);
        setCrop(data);
        if (data) setBidAmount(String(data.price + 100));
      } catch {
        setErrorMessage('تعذر تحميل تفاصيل المحصول');
      } finally {
        setLoading(false);
      }
    }

    if (id) loadCrop();
  }, [id]);

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
          <button
            type="button"
            className="bg-[#265C38] text-white font-bold px-6 py-2.5 rounded-xl mt-4"
          >
            العودة للرئيسية
          </button>
        </Link>
      </div>
    );
  }

  const isAuction = crop.saleMethod === 'AUCTION';
  const isSold = crop.status === 'SOLD';
  const images =
    crop.images && crop.images.length > 0 ? crop.images : ['/images/placeholder-crop.png'];

  const handleActionClick = () => {
    setErrorMessage('');
    if (isAuction) {
      const bidVal = parseFloat(bidAmount);
      if (Number.isNaN(bidVal) || bidVal <= crop.price) {
        setErrorMessage(`يجب أن تكون قيمة السوم أعلى من السعر الحالي (${crop.price} ريال)`);
        return;
      }
    }
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!crop) return;

    try {
      setIsSubmitting(true);

      if (isAuction) {
        await placeBid({ productId: crop.id, amount: parseFloat(bidAmount) });
      } else {
        await placeOrder({
          productId: crop.id,
          offeredPrice: crop.price,
          quantity: crop.quantity,
        });
      }

      setShowConfirmModal(false);
      router.push('/customer/orders');
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'حدث خطأ أثناء إتمام العملية، يرجى المحاولة مجدداً'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link
        href="/customer"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#265C38] hover:underline self-start"
      >
        <span>← العودة لقائمة المحاصيل</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <CustomerCropGallery
            crop={crop}
            images={images}
            imageIndex={imageIndex}
            setImageIndex={setImageIndex}
            isAuction={isAuction}
            isSold={isSold}
          />
          <CropInformation crop={crop} isAuction={isAuction} />
        </div>

        <div className="space-y-6">
          <CustomerCropActionCard
            crop={crop}
            isAuction={isAuction}
            isSold={isSold}
            bidAmount={bidAmount}
            setBidAmount={setBidAmount}
            errorMessage={errorMessage}
            onActionClick={handleActionClick}
          />
        </div>
      </div>

      {showConfirmModal && (
        <CustomerCropConfirmModal
          crop={crop}
          isAuction={isAuction}
          bidAmount={bidAmount}
          isSubmitting={isSubmitting}
          onConfirm={handleConfirmSubmit}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}

function CropInformation({ crop, isAuction }: { crop: Crop; isAuction: boolean }) {
  return (
    <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-8 shadow-sm space-y-6 text-right">
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-[#111111]">{crop.name}</h1>
        <p className="text-sm leading-relaxed text-[#666666]">{crop.description}</p>
      </div>

      <div className="border-t border-[#f0ebde]/45 pt-6 space-y-4">
        <h3 className="text-base font-bold text-[#265C38]">معلومات المحصول والتوصيل</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm">
          <InfoItem label="طريقة البيع" value={isAuction ? 'بيع بالمزاد' : 'شراء فوري سعر ثابت'} />
          <InfoItem label="الكمية الإجمالية" value={`${crop.quantity} ${crop.quantityUnit}`} />
          <InfoItem label="طريقة الشحن" value={crop.deliveryMethod} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#f0ebde]/45 pt-6">
        <ContactCard
          icon="🏡"
          title="تفاصيل المزرعة والمنتج"
          rows={[
            ['المزرعة:', crop.farmName],
            ['اسم المدير المسؤول:', crop.managerName],
            ['رقم التواصل:', crop.contact],
          ]}
        />
        <ContactCard
          icon="🚚"
          title="بيانات التوصيل والسائق"
          rows={[
            ['السائق:', crop.driverName || 'سائق معتمد'],
            ['رقم الجوال:', crop.driverPhone || '0590000000'],
            ['الحالة:', 'جاهز للتوصيل فوراً'],
          ]}
        />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <span className="block text-gray-400 font-semibold text-xs">{label}</span>
      <span className="font-bold text-[#333333]">{value}</span>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  rows,
}: {
  icon: string;
  title: string;
  rows: [string, string][];
}) {
  return (
    <div className="bg-[#faf8f5] border border-[#f0ebde]/45 rounded-3xl p-5 space-y-3">
      <h4 className="text-sm font-bold text-[#265C38] flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h4>
      <div className="text-xs space-y-2 text-[#444444]">
        {rows.map(([label, value]) => (
          <div key={label}>
            <span className="text-gray-400 font-semibold">{label}</span>{' '}
            <span className="font-bold" dir={label.includes('رقم') ? 'ltr' : 'rtl'}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
