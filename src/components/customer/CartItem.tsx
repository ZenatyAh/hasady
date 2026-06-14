import React from 'react';
import Image from 'next/image';

interface CartItemProps {
  id: string;
  name: string;
  farmName: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  name,
  farmName,
  price,
  quantity,
  imageUrl,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-border-light mb-4">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 bg-surface-green rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-base font-bold text-foreground">{name}</h3>
          <span className="text-xs text-text-muted">{farmName}</span>
          <span className="text-sm font-extrabold text-primary mt-1">{price} ريال</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <button
          onClick={() => onRemove(id)}
          className="text-red-500 hover:text-red-600 text-xs font-bold"
        >
          إزالة
        </button>
        <div className="flex items-center gap-3 bg-surface-green px-3 py-1.5 rounded-xl">
          <button
            onClick={() => onIncrease(id)}
            className="text-primary font-bold text-lg hover:text-primary-hover w-6 flex items-center justify-center"
          >
            +
          </button>
          <span className="text-sm font-bold text-foreground w-4 text-center">{quantity}</span>
          <button
            onClick={() => onDecrease(id)}
            className="text-primary font-bold text-lg hover:text-primary-hover w-6 flex items-center justify-center disabled:opacity-50"
            disabled={quantity <= 1}
          >
            -
          </button>
        </div>
      </div>
    </div>
  );
}
