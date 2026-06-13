import type { Crop } from '@/services/api/crops';

type ProductMedia = {
  id?: string;
  url: string;
  mediaType?: string;
};

export type ApiProduct = {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  saleMethod: 'FIXED' | 'AUCTION';
  quantity: number | string;
  unit: string;
  fixedPrice?: number | string | null;
  auctionStartPrice?: number | string | null;
  currentBid?: number | string | null;
  deliveryMethod: string;
  driverPhone?: string | null;
  driverName?: string | null;
  farmId: string;
  categoryId?: string | null;
  media?: ProductMedia[];
  farm?: {
    id: string;
    name?: string;
    displayName?: string;
    managerName?: string;
    contactPhone?: string;
  } | null;
};

function toNumber(value: number | string | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapStatus(status: string): Crop['status'] {
  if (status === 'sold' || status === 'SOLD') return 'SOLD';
  return 'AVAILABLE';
}

function mapUnit(unit: string): string {
  const unitMap: Record<string, string> = {
    KG: 'كغم',
    TON: 'طن',
    BOX: 'صندوق',
    BUNCH: 'حزمة',
  };
  return unitMap[unit] ?? unit;
}

function mapDeliveryMethod(method: string): string {
  const deliveryMap: Record<string, string> = {
    FROM_FARM: 'من المزرعة',
    DELIVERY: 'توصيل',
    PICKUP: 'استلام',
  };
  return deliveryMap[method] ?? method;
}

export function productToCrop(product: ApiProduct): Crop {
  const price =
    product.saleMethod === 'AUCTION'
      ? toNumber(product.currentBid ?? product.auctionStartPrice)
      : toNumber(product.fixedPrice);

  const images =
    product.media && product.media.length > 0
      ? product.media.map((item) => item.url)
      : ['/images/placeholder-crop.png'];

  return {
    id: product.id,
    name: product.name,
    description: product.description ?? '',
    status: mapStatus(product.status),
    saleMethod: product.saleMethod,
    quantity: toNumber(product.quantity),
    quantityUnit: mapUnit(product.unit),
    price,
    deliveryMethod: mapDeliveryMethod(product.deliveryMethod),
    driverPhone: product.driverPhone ?? '',
    driverName: product.driverName ?? '',
    images,
    farmId: product.farmId,
    farmName: product.farm?.displayName ?? product.farm?.name ?? 'مزرعة',
    contact: product.farm?.contactPhone ?? '',
    managerName: product.farm?.managerName ?? '',
    categoryId: product.categoryId ?? undefined,
  };
}

export function cropToCreateProductDto(
  crop: Omit<Crop, 'id' | 'status'>,
  options?: { categoryId?: string; auctionDurationHours?: number }
) {
  const unitMap: Record<string, string> = {
    كغم: 'KG',
    طن: 'TON',
    صندوق: 'BOX',
    حزمة: 'BUNCH',
  };

  const deliveryMap: Record<string, string> = {
    'من المزرعة': 'FROM_FARM',
    توصيل: 'DELIVERY',
    استلام: 'PICKUP',
  };

  return {
    farmId: crop.farmId,
    categoryId: options?.categoryId,
    name: crop.name,
    description: crop.description,
    quantity: crop.quantity,
    unit: unitMap[crop.quantityUnit] ?? 'KG',
    saleMethod: crop.saleMethod,
    fixedPrice: crop.saleMethod === 'FIXED' ? crop.price : undefined,
    auctionStartPrice: crop.saleMethod === 'AUCTION' ? crop.price : undefined,
    auctionDurationHours:
      crop.saleMethod === 'AUCTION' ? (options?.auctionDurationHours ?? 24) : undefined,
    deliveryMethod: deliveryMap[crop.deliveryMethod] ?? 'FROM_FARM',
    driverName: crop.driverName || undefined,
    driverPhone: crop.driverPhone || undefined,
  };
}
