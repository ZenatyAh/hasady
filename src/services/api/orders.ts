// src/services/api/orders.ts

import { apiGet, apiPut } from '@/lib/api-client';

const MOCK_DELAY_MS = 600;

function mockDelay<T>(fn: () => T | Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, MOCK_DELAY_MS);
  });
}

export interface PurchaseOrder {
  id: string;
  type: 'fixed' | 'auction';
  cropName: string;
  description: string;
  buyerName: string;
  buyerPhone: string;
  buyerRating: number;
  buyerId: string;
  offeredPrice: number;
  currency: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  image: string;
}

const DEFAULT_ORDERS: PurchaseOrder[] = [
  {
    id: 'ord-1',
    type: 'fixed',
    cropName: 'خيار بلدي',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    buyerName: 'محمد علي إسماعيل',
    buyerPhone: '+966528787283',
    buyerRating: 4,
    buyerId: '2308920932093',
    offeredPrice: 4900,
    currency: 'ريال سعودي',
    status: 'PENDING',
    createdAt: '14-09-2025',
    image: '/images/onboard4.svg',
  },
  {
    id: 'ord-2',
    type: 'fixed',
    cropName: 'خيار بلدي',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    buyerName: 'أحمد محمود العلي',
    buyerPhone: '+966504938274',
    buyerRating: 5,
    buyerId: '2308920932094',
    offeredPrice: 4850,
    currency: 'ريال سعودي',
    status: 'PENDING',
    createdAt: '14-09-2025',
    image: '/images/onboard4.svg',
  },
  {
    id: 'ord-3',
    type: 'fixed',
    cropName: 'خيار بلدي',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    buyerName: 'خالد يوسف الفهد',
    buyerPhone: '+966551827364',
    buyerRating: 4,
    buyerId: '2308920932095',
    offeredPrice: 5000,
    currency: 'ريال سعودي',
    status: 'PENDING',
    createdAt: '14-09-2025',
    image: '/images/onboard4.svg',
  },
  {
    id: 'ord-4',
    type: 'auction',
    cropName: 'خيار بلدي (مزاد)',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    buyerName: 'صالح عبد الله البشري',
    buyerPhone: '+966567283940',
    buyerRating: 4.5,
    buyerId: '2308920932096',
    offeredPrice: 5100,
    currency: 'ريال سعودي',
    status: 'PENDING',
    createdAt: '14-09-2025',
    image: '/images/onboard4.svg',
  },
  {
    id: 'ord-5',
    type: 'auction',
    cropName: 'خيار بلدي (مزاد)',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    buyerName: 'علي حسن العتيبي',
    buyerPhone: '+966509876543',
    buyerRating: 3.5,
    buyerId: '2308920932097',
    offeredPrice: 4700,
    currency: 'ريال سعودي',
    status: 'PENDING',
    createdAt: '14-09-2025',
    image: '/images/onboard4.svg',
  },
];

function getStoredOrders(): PurchaseOrder[] {
  if (typeof window === 'undefined') return DEFAULT_ORDERS;
  const stored = sessionStorage.getItem('hasady-purchase-orders');
  if (stored) {
    try {
      return JSON.parse(stored) as PurchaseOrder[];
    } catch {
      return DEFAULT_ORDERS;
    }
  }
  sessionStorage.setItem('hasady-purchase-orders', JSON.stringify(DEFAULT_ORDERS));
  return DEFAULT_ORDERS;
}

function saveStoredOrders(orders: PurchaseOrder[]): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('hasady-purchase-orders', JSON.stringify(orders));
  }
}

export async function getIncomingOrders(token?: string | null): Promise<PurchaseOrder[]> {
  return apiGet(
    '/orders/incoming',
    () =>
      mockDelay(() => {
        return getStoredOrders();
      }),
    { token }
  );
}

export async function getOrderDetail(
  id: string,
  token?: string | null
): Promise<PurchaseOrder | null> {
  return apiGet(
    `/orders/${id}`,
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        return orders.find((o) => o.id === id) || null;
      }),
    { token }
  );
}

export async function acceptOrder(id: string, token?: string | null): Promise<PurchaseOrder> {
  return apiPut(
    `/orders/${id}/accept`,
    {},
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        const index = orders.findIndex((o) => o.id === id);
        if (index === -1) {
          throw new Error('الطلب غير موجود في النظام');
        }
        orders[index] = { ...orders[index], status: 'ACCEPTED' };
        saveStoredOrders(orders);
        return orders[index];
      }),
    { token }
  );
}

export async function rejectOrder(id: string, token?: string | null): Promise<PurchaseOrder> {
  return apiPut(
    `/orders/${id}/reject`,
    {},
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        const index = orders.findIndex((o) => o.id === id);
        if (index === -1) {
          throw new Error('الطلب غير موجود في النظام');
        }
        orders[index] = { ...orders[index], status: 'REJECTED' };
        saveStoredOrders(orders);
        return orders[index];
      }),
    { token }
  );
}
