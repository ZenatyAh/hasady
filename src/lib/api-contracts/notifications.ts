import { z } from 'zod';
import { paginatedItemsSchema } from '@/lib/api-contracts/common';

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  titleAr: z.string().nullable().optional(),
  bodyAr: z.string().nullable().optional(),
  type: z.string().optional(),
  isRead: z.boolean(),
  createdAt: z.string(),
});

export type Notification = z.infer<typeof notificationSchema>;

export const notificationsListSchema = z.union([
  z.array(notificationSchema),
  paginatedItemsSchema(notificationSchema),
]);

export type NotificationsListResponse = z.infer<typeof notificationsListSchema>;

export const unreadCountSchema = z.union([z.number(), z.object({ count: z.number() })]);

export type UnreadCountResponse = z.infer<typeof unreadCountSchema>;

/** Payload pushed over GET /notifications/stream (SSE) */
export const notificationStreamEventSchema = z.object({
  count: z.number().optional(),
  title: z.string().optional(),
  body: z.string().optional(),
  titleAr: z.string().nullable().optional(),
  bodyAr: z.string().nullable().optional(),
  type: z.string().optional(),
});

export type NotificationStreamEvent = z.infer<typeof notificationStreamEventSchema>;

export type PaginatedNotifications = {
  items: Notification[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
};
