import type { PurchaseOrder } from '@/services/api/orders';
import type { Order } from '@/lib/api-contracts/orders';

function toNumber(value: number | string | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapOrderStatus(status: string): PurchaseOrder['status'] {
  if (status === 'ACCEPTED' || status === 'AWAITING_PAYMENT' || status === 'COMPLETED') {
    return 'ACCEPTED';
  }
  if (status === 'REJECTED' || status === 'CANCELLED' || status === 'REFUNDED') {
    return 'REJECTED';
  }
  return 'PENDING';
}

export function orderToPurchaseOrder(order: Order): PurchaseOrder {
  const product = order.product;
  const image =
    product?.media && product.media.length > 0
      ? product.media[0].url
      : '/images/placeholder-crop.png';

  return {
    id: order.id,
    type: order.saleMethod === 'AUCTION' ? 'auction' : 'fixed',
    cropName: product?.name ?? 'محصول',
    description: product?.description ?? '',
    buyerName: order.buyer?.fullName ?? 'مشتري',
    buyerPhone: order.buyer?.phone ?? '',
    buyerRating: toNumber(order.buyer?.ratingAvg, 0),
    buyerId: order.buyer?.id ?? '',
    offeredPrice: toNumber(order.offeredPrice),
    currency: 'ريال سعودي',
    status: mapOrderStatus(order.status),
    backendStatus: order.status,
    createdAt: new Date(order.createdAt).toLocaleDateString('ar-SA'),
    image,
    productId: order.productId,
    rejectionReason: order.rejectionReason ?? undefined,
    deliveryStatus: order.deliveryStatus ?? undefined,
  };
}

/** @deprecated Use Order from api-contracts/orders */
export type ApiOrder = Order;
