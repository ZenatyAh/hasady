import Image from 'next/image';
import type { Crop } from '@/services/api/crops';

type CustomerCropGalleryProps = {
  crop: Crop;
  images: string[];
  imageIndex: number;
  setImageIndex: (index: number) => void;
  isAuction: boolean;
  isSold: boolean;
};

export function CustomerCropGallery({
  crop,
  images,
  imageIndex,
  setImageIndex,
  isAuction,
  isSold,
}: CustomerCropGalleryProps) {
  return (
    <div className="bg-white border border-[#f0ebde]/75 rounded-[2.5rem] p-6 shadow-sm space-y-4">
      <div className="relative h-64 md:h-96 bg-[#f4f7f5] rounded-3xl overflow-hidden flex items-center justify-center">
        <Image
          src={images[imageIndex]}
          alt={crop.name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 66vw, 100vw"
        />
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

      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => setImageIndex(idx)}
              aria-label={`عرض صورة ${idx + 1}`}
              className={`h-2.5 rounded-full transition ${imageIndex === idx ? 'w-6 bg-[#265C38]' : 'w-2.5 bg-[#f0ebde]'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
