import { describe, expect, it } from 'vitest';
import { productToCrop } from '@/lib/mappers/product';

describe('productToCrop', () => {
  it('maps lowercase backend saleMethod and unit values', () => {
    const crop = productToCrop({
      id: 'prod-1',
      name: 'خيار بلدي',
      description: 'طازج',
      status: 'active',
      saleMethod: 'auction',
      quantity: 50,
      unit: 'kg',
      auctionStartPrice: 800,
      currentBid: 950,
      deliveryMethod: 'from_farm',
      farmId: 'farm-1',
      media: [{ url: '/images/cucumber.png' }],
      farm: { id: 'farm-1', displayName: 'مزرعة الخير' },
    });

    expect(crop.saleMethod).toBe('AUCTION');
    expect(crop.quantityUnit).toBe('كغم');
    expect(crop.price).toBe(950);
    expect(crop.status).toBe('AVAILABLE');
  });
});
