// src/services/api/orders.ts

import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client';
import { orderToPurchaseOrder, type ApiOrder } from '@/lib/mappers/order';

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
  backendStatus?: string;
  createdAt: string;
  image: string;
  productId?: string;
  rejectionReason?: string;
  deliveryStatus?: string | null;
}

function isApiOrder(value: unknown): value is ApiOrder {
  return Boolean(value && typeof value === 'object' && 'saleMethod' in (value as ApiOrder));
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
    backendStatus: 'PENDING',
    createdAt: '14-09-2025',
    image: '/images/onboard4.svg',
    productId: 'crop-1',
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

function mapOrders(orders: ApiOrder[]): PurchaseOrder[] {
  return orders.map(orderToPurchaseOrder);
}

function mapOrder(order: ApiOrder): PurchaseOrder {
  return orderToPurchaseOrder(order);
}

function toPurchaseOrder(data: unknown): PurchaseOrder {
  if (data && typeof data === 'object' && 'cropName' in data) {
    return data as PurchaseOrder;
  }
  if (isApiOrder(data)) {
    return mapOrder(data);
  }
  throw new Error('استجابة الطلب غير صالحة');
}

function normalizeOrders(data: unknown): ApiOrder[] {
  if (!Array.isArray(data) || data.length === 0) return [];
  if (isApiOrder(data[0])) return data as ApiOrder[];
  return (data as PurchaseOrder[]).map(
    (order) =>
      ({
        id: order.id,
        productId: order.productId ?? order.id,
        saleMethod: order.type === 'auction' ? 'AUCTION' : 'FIXED',
        offeredPrice: order.offeredPrice,
        status: order.backendStatus ?? order.status,
        createdAt: order.createdAt,
        product: null,
        buyer: { id: order.buyerId, fullName: order.buyerName, phone: order.buyerPhone },
      }) as ApiOrder
  );
}

export async function getMyOrders(token?: string | null): Promise<PurchaseOrder[]> {
  const data = await apiGet('/orders/my', () => mockDelay(() => getStoredOrders()), { token });
  return mapOrders(normalizeOrders(data));
}

export async function getIncomingOrders(token?: string | null): Promise<PurchaseOrder[]> {
  const data = await apiGet('/orders/incoming', () => mockDelay(() => getStoredOrders()), {
    token,
  });
  return mapOrders(normalizeOrders(data));
}

export async function getOrderDetail(
  id: string,
  token?: string | null
): Promise<PurchaseOrder | null> {
  const data = await apiGet(
    `/orders/${id}`,
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        return orders.find((o) => o.id === id) ?? null;
      }),
    { token }
  );

  if (!data) return null;
  return toPurchaseOrder(data);
}

export async function placeOrder(
  payload: { productId: string; offeredPrice: number; quantity: number; notes?: string },
  token?: string | null
): Promise<PurchaseOrder> {
  const data = await apiPost(
    '/orders',
    payload,
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        const newOrder: PurchaseOrder = {
          id: `ord-${Date.now()}`,
          type: 'fixed',
          cropName: 'محصول جديد',
          description: payload.notes ?? '',
          buyerName: 'مشتري',
          buyerPhone: '',
          buyerRating: 0,
          buyerId: 'buyer-1',
          offeredPrice: payload.offeredPrice,
          currency: 'ريال سعودي',
          status: 'PENDING',
          backendStatus: 'PENDING',
          createdAt: new Date().toLocaleDateString('ar-SA'),
          image: '/images/placeholder-crop.png',
          productId: payload.productId,
        };
        saveStoredOrders([newOrder, ...orders]);
        return newOrder;
      }),
    { token }
  );

  return toPurchaseOrder(data);
}

export async function cancelOrder(id: string, token?: string | null): Promise<PurchaseOrder> {
  const data = await apiDelete(
    `/orders/${id}/cancel`,
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        const index = orders.findIndex((o) => o.id === id);
        if (index === -1) throw new Error('الطلب غير موجود');
        orders[index] = { ...orders[index], status: 'REJECTED', backendStatus: 'CANCELLED' };
        saveStoredOrders(orders);
        return orders[index];
      }),
    { token }
  );

  return toPurchaseOrder(data);
}

export async function confirmDelivery(id: string, token?: string | null): Promise<PurchaseOrder> {
  const data = await apiPut(
    `/orders/${id}/confirm`,
    {},
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        const index = orders.findIndex((o) => o.id === id);
        if (index === -1) throw new Error('الطلب غير موجود');
        orders[index] = { ...orders[index], status: 'ACCEPTED', backendStatus: 'COMPLETED' };
        saveStoredOrders(orders);
        return orders[index];
      }),
    { token }
  );

  return toPurchaseOrder(data);
}

export async function acceptOrder(id: string, token?: string | null): Promise<PurchaseOrder> {
  const data = await apiPut(
    `/orders/${id}/accept`,
    {},
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        const index = orders.findIndex((o) => o.id === id);
        if (index === -1) throw new Error('الطلب غير موجود');
        orders[index] = {
          ...orders[index],
          status: 'ACCEPTED',
          backendStatus: 'AWAITING_PAYMENT',
        };
        saveStoredOrders(orders);
        return orders[index];
      }),
    { token }
  );

  return toPurchaseOrder(data);
}

export async function rejectOrder(
  id: string,
  reason: string,
  token?: string | null
): Promise<PurchaseOrder> {
  const data = await apiPut(
    `/orders/${id}/reject`,
    { reason },
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        const index = orders.findIndex((o) => o.id === id);
        if (index === -1) throw new Error('الطلب غير موجود');
        orders[index] = {
          ...orders[index],
          status: 'REJECTED',
          backendStatus: 'REJECTED',
          rejectionReason: reason,
        };
        saveStoredOrders(orders);
        return orders[index];
      }),
    { token }
  );

  return toPurchaseOrder(data);
}

export async function updateOrderStatus(
  id: string,
  status: string,
  token?: string | null,
  reason?: string
): Promise<PurchaseOrder> {
  const data = await apiPut(
    `/orders/${id}/status`,
    { status, reason },
    () =>
      mockDelay(() => {
        const orders = getStoredOrders();
        const index = orders.findIndex((o) => o.id === id);
        if (index === -1) throw new Error('الطلب غير موجود');
        orders[index] = { ...orders[index], deliveryStatus: status };
        saveStoredOrders(orders);
        return orders[index];
      }),
    { token }
  );

  return toPurchaseOrder(data);
}
