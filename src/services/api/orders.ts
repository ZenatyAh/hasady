// src/services/api/orders.ts

import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api-client';
import {
  orderSchema,
  ordersListSchema,
  placeOrderPayloadSchema,
  rejectOrderPayloadSchema,
  updateOrderStatusPayloadSchema,
  type Order,
  type PlaceOrderPayload,
  type RejectOrderPayload,
  type UpdateOrderStatusPayload,
} from '@/lib/api-contracts/orders';
import { orderToPurchaseOrder } from '@/lib/mappers/order';

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

function normalizeOrdersList(data: unknown): Order[] {
  const parsed = ordersListSchema.parse(data);
  if (Array.isArray(parsed)) return parsed;
  if ('items' in parsed && Array.isArray(parsed.items)) return parsed.items;
  if ('data' in parsed && Array.isArray(parsed.data)) return parsed.data;
  return [];
}

function toPurchaseOrder(data: Order): PurchaseOrder {
  return orderToPurchaseOrder(data);
}

// ─── BUYER routes ───────────────────────────────────────────────────────────

/** POST /orders — place a fixed-price purchase request */
export async function placeOrder(payload: PlaceOrderPayload): Promise<PurchaseOrder> {
  const body = placeOrderPayloadSchema.parse(payload);
  const data = await apiPost('/orders', body, { schema: orderSchema });
  return toPurchaseOrder(data);
}

/** GET /orders/my */
export async function getMyOrders(): Promise<PurchaseOrder[]> {
  const data = await apiGet('/orders/my', { schema: ordersListSchema });
  return normalizeOrdersList(data).map(toPurchaseOrder);
}

/** DELETE /orders/:id/cancel */
export async function cancelOrder(id: string): Promise<PurchaseOrder> {
  const data = await apiDelete(`/orders/${id}/cancel`, { schema: orderSchema });
  return toPurchaseOrder(data);
}

/** PUT /orders/:id/confirm — confirm delivery completion */
export async function confirmDelivery(id: string): Promise<PurchaseOrder> {
  const data = await apiPut(`/orders/${id}/confirm`, {}, { schema: orderSchema });
  return toPurchaseOrder(data);
}

// ─── MERCHANT routes ────────────────────────────────────────────────────────

/** GET /orders/incoming */
export async function getIncomingOrders(): Promise<PurchaseOrder[]> {
  const data = await apiGet('/orders/incoming', { schema: ordersListSchema });
  return normalizeOrdersList(data).map(toPurchaseOrder);
}

/** PUT /orders/:id/accept */
export async function acceptOrder(id: string): Promise<PurchaseOrder> {
  const data = await apiPut(`/orders/${id}/accept`, {}, { schema: orderSchema });
  return toPurchaseOrder(data);
}

/** PUT /orders/:id/reject */
export async function rejectOrder(id: string, payload: RejectOrderPayload): Promise<PurchaseOrder> {
  const body = rejectOrderPayloadSchema.parse(payload);
  const data = await apiPut(`/orders/${id}/reject`, body, { schema: orderSchema });
  return toPurchaseOrder(data);
}

/** PUT /orders/:id/status */
export async function updateOrderStatus(
  id: string,
  payload: UpdateOrderStatusPayload
): Promise<PurchaseOrder> {
  const body = updateOrderStatusPayloadSchema.parse(payload);
  const data = await apiPut(`/orders/${id}/status`, body, { schema: orderSchema });
  return toPurchaseOrder(data);
}

// ─── Shared ─────────────────────────────────────────────────────────────────

/** GET /orders/:id */
export async function getOrderDetail(id: string): Promise<PurchaseOrder | null> {
  try {
    const data = await apiGet(`/orders/${id}`, { schema: orderSchema });
    return toPurchaseOrder(data);
  } catch {
    return null;
  }
}

/** GET /orders/:id — raw API order (for advanced use) */
export async function getOrderById(id: string): Promise<Order> {
  return apiGet(`/orders/${id}`, { schema: orderSchema });
}

export type { Order, PlaceOrderPayload, RejectOrderPayload, UpdateOrderStatusPayload };
