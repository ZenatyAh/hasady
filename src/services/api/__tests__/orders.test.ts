import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { placeOrder } from '@/services/api/orders';
import { useAuthStore } from '@/lib/store';

const API_URL = 'https://mahaseel-production.up.railway.app/api/v1';

describe('orders service', () => {
  const previousUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_URL;
    useAuthStore.getState().setAuthSession(
      { accessToken: 'mock-token', refreshToken: 'mock-refresh' },
      {
        id: '1',
        name: 'Test',
        email: 'test@test.com',
        phone: '',
        role: 'BUYER',
      }
    );

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            id: 'ord-1',
            productId: 'prod-1',
            saleMethod: 'FIXED',
            offeredPrice: 1200,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            product: { name: 'محصول', description: '', media: [] },
            buyer: { id: 'b-1', fullName: 'مشتري', phone: '' },
          },
        }),
      })
    );
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = previousUrl;
    useAuthStore.getState().clearAuthSession();
    vi.unstubAllGlobals();
  });

  it('placeOrder returns a mapped purchase order', async () => {
    const order = await placeOrder({
      productId: 'prod-1',
      offeredPrice: 1200,
      quantity: 2,
      notes: 'طلب اختبار',
    });

    expect(order.id).toBeTruthy();
    expect(order.offeredPrice).toBe(1200);
  });
});
