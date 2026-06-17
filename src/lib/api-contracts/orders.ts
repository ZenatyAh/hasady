import { z } from 'zod';
import { productSchema } from '@/lib/api-contracts/products';

export const orderStatusSchema = z.enum([
  'PENDING',
  'ACCEPTED',
  'REJECTED',
  'CANCELLED',
  'AWAITING_PAYMENT',
  'PAID',
  'IN_DELIVERY',
  'COMPLETED',
  'REFUNDED',
  'DISPUTED',
]);

export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const orderBuyerSchema = z.object({
  id: z.string(),
  fullName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  ratingAvg: z.union([z.number(), z.string()]).optional(),
});

export const orderSchema = z.object({
  id: z.string(),
  productId: z.string(),
  saleMethod: z.enum(['FIXED', 'AUCTION']),
  offeredPrice: z.union([z.number(), z.string()]),
  quantity: z.union([z.number(), z.string()]).optional(),
  finalPrice: z.union([z.number(), z.string()]).nullable().optional(),
  status: z.string(),
  notes: z.string().nullable().optional(),
  rejectionReason: z.string().nullable().optional(),
  deliveryStatus: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  product: productSchema.nullable().optional(),
  buyer: orderBuyerSchema.nullable().optional(),
});

export type Order = z.infer<typeof orderSchema>;

export const ordersListSchema = z.union([
  z.array(orderSchema),
  z.object({
    items: z.array(orderSchema),
    data: z.array(orderSchema).optional(),
    meta: z
      .object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
      })
      .optional(),
  }),
]);

/** BUYER — POST /orders */
export type PlaceOrderPayload = {
  productId: string;
  offeredPrice: number;
  quantity: number;
  notes?: string;
};

export const placeOrderPayloadSchema = z.object({
  productId: z.string(),
  offeredPrice: z.number().positive(),
  quantity: z.number().positive(),
  notes: z.string().optional(),
});

/** MERCHANT — PUT /orders/:id/reject */
export type RejectOrderPayload = {
  reason: string;
};

export const rejectOrderPayloadSchema = z.object({
  reason: z.string().min(1),
});

/** MERCHANT — PUT /orders/:id/status */
export type UpdateOrderStatusPayload = {
  status: string;
  reason?: string;
};

export const updateOrderStatusPayloadSchema = z.object({
  status: z.string().min(1),
  reason: z.string().optional(),
});

/** Role-scoped order action payloads */
export type BuyerOrderAction =
  | { action: 'place'; payload: PlaceOrderPayload }
  | { action: 'cancel'; orderId: string }
  | { action: 'confirm'; orderId: string };

export type MerchantOrderAction =
  | { action: 'accept'; orderId: string }
  | { action: 'reject'; orderId: string; payload: RejectOrderPayload }
  | { action: 'updateStatus'; orderId: string; payload: UpdateOrderStatusPayload };
