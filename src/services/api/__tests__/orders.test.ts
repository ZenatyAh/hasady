import { describe, expect, it } from 'vitest';
import { placeOrder } from '@/services/api/orders';

describe('orders service (mock mode)', () => {
  it('placeOrder creates a pending purchase order', async () => {
    const previous = process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    const order = await placeOrder(
      {
        productId: 'prod-1',
        offeredPrice: 1200,
        quantity: 2,
        notes: 'طلب اختبار',
      },
      'mock-token'
    );

    expect(order.id).toBeTruthy();
    expect(order.status).toBe('PENDING');
    expect(order.offeredPrice).toBe(1200);

    process.env.NEXT_PUBLIC_API_URL = previous;
  });
});
