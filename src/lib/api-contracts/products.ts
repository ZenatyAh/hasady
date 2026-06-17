import { z } from 'zod';

export const productMediaSchema = z.object({
  id: z.string(),
  url: z.string(),
  mediaType: z.string().optional(),
  sortOrder: z.number().optional(),
});

export type ProductMedia = z.infer<typeof productMediaSchema>;

export const productStatusSchema = z.enum([
  'active',
  'sold',
  'expired',
  'inactive',
  'pending',
  'ACTIVE',
  'SOLD',
  'EXPIRED',
  'INACTIVE',
  'PENDING',
]);

export const saleMethodSchema = z.enum(['FIXED', 'AUCTION', 'fixed', 'auction']);

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.string(),
  saleMethod: saleMethodSchema,
  quantity: z.union([z.number(), z.string()]),
  unit: z.string(),
  fixedPrice: z.union([z.number(), z.string()]).nullable().optional(),
  auctionStartPrice: z.union([z.number(), z.string()]).nullable().optional(),
  currentBid: z.union([z.number(), z.string()]).nullable().optional(),
  auctionEndsAt: z.string().nullable().optional(),
  deliveryMethod: z.string(),
  driverPhone: z.string().nullable().optional(),
  driverName: z.string().nullable().optional(),
  farmId: z.string(),
  categoryId: z.string().nullable().optional(),
  media: z.array(productMediaSchema).optional(),
  farm: z
    .object({
      id: z.string(),
      name: z.string().optional(),
      displayName: z.string().optional(),
      managerName: z.string().optional(),
      contactPhone: z.string().optional(),
    })
    .nullable()
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;

export const productsListSchema = z.union([
  z.array(productSchema),
  z.object({
    items: z.array(productSchema),
    meta: z
      .object({
        total: z.number(),
        page: z.number(),
        limit: z.number(),
        totalPages: z.number().optional(),
        hasNextPage: z.boolean().optional(),
        hasPreviousPage: z.boolean().optional(),
      })
      .optional(),
  }),
]);

export type CreateProductPayload = {
  farmId: string;
  categoryId?: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  saleMethod: 'FIXED' | 'AUCTION';
  fixedPrice?: number;
  auctionStartPrice?: number;
  auctionDurationHours?: number;
  deliveryMethod: string;
  driverName?: string;
  driverPhone?: string;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;
