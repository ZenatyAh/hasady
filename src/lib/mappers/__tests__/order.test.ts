import { describe, expect, it } from 'vitest';
import { orderToPurchaseOrder } from '@/lib/mappers/order';

describe('orderToPurchaseOrder', () => {
  it('maps API order to purchase order UI model', () => {
    const mapped = orderToPurchaseOrder({
      id: 'ord-1',
      productId: 'prod-1',
      saleMethod: 'FIXED',
      offeredPrice: '1500',
      status: 'AWAITING_PAYMENT',
      createdAt: '2026-06-01T10:00:00.000Z',
      product: {
        id: 'prod-1',
        name: 'طماطم شيري',
        description: 'طازجة',
        status: 'AVAILABLE',
        saleMethod: 'FIXED',
        quantity: 100,
        unit: 'كجم',
        deliveryMethod: 'DELIVERY',
        farmId: 'farm-1',
        media: [{ id: 'm-1', url: '/images/tomato.png', mediaType: 'IMAGE' }],
      },
      buyer: {
        id: 'buyer-1',
        fullName: 'مشتري',
        phone: '0599999999',
        ratingAvg: 4.5,
      },
    });

    expect(mapped.id).toBe('ord-1');
    expect(mapped.type).toBe('fixed');
    expect(mapped.cropName).toBe('طماطم شيري');
    expect(mapped.status).toBe('ACCEPTED');
    expect(mapped.offeredPrice).toBe(1500);
    expect(mapped.buyerName).toBe('مشتري');
    expect(mapped.image).toBe('/images/tomato.png');
  });

  it('maps auction orders and rejected status', () => {
    const mapped = orderToPurchaseOrder({
      id: 'ord-2',
      productId: 'prod-2',
      saleMethod: 'AUCTION',
      offeredPrice: 900,
      status: 'REJECTED',
      createdAt: '2026-06-02T10:00:00.000Z',
      rejectionReason: 'غير متوفر',
    });

    expect(mapped.type).toBe('auction');
    expect(mapped.status).toBe('REJECTED');
    expect(mapped.rejectionReason).toBe('غير متوفر');
  });
});
