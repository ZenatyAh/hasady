import { apiGet, apiPatch, buildQuery } from '@/lib/api-client';
import { getAccessToken } from '@/lib/store';
import {
  notificationSchema,
  notificationsListSchema,
  notificationStreamEventSchema,
  unreadCountSchema,
  type Notification,
  type NotificationStreamEvent,
  type PaginatedNotifications,
} from '@/lib/api-contracts/notifications';

function getApiBase(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
}

function localizeNotification(item: Notification): Notification {
  return {
    ...item,
    title: item.titleAr ?? item.title,
    body: item.bodyAr ?? item.body,
  };
}

function normalizeNotificationsList(data: unknown): PaginatedNotifications {
  const parsed = notificationsListSchema.parse(data);

  if (Array.isArray(parsed)) {
    return { items: parsed.map(localizeNotification) };
  }

  return {
    items: parsed.items.map(localizeNotification),
    meta: parsed.meta,
  };
}

/** GET /notifications — paginated list */
export async function getNotificationsPaginated(
  page = 1,
  limit = 20
): Promise<PaginatedNotifications> {
  const data = await apiGet(`/notifications${buildQuery({ page, limit })}`, {
    schema: notificationsListSchema,
  });
  return normalizeNotificationsList(data);
}

/** GET /notifications — returns items only (convenience) */
export async function getNotifications(page = 1, limit = 20): Promise<Notification[]> {
  const result = await getNotificationsPaginated(page, limit);
  return result.items;
}

/** GET /notifications/unread */
export async function getUnreadNotifications(limit = 50): Promise<Notification[]> {
  const data = await apiGet(`/notifications/unread${buildQuery({ limit })}`, {
    schema: notificationsListSchema,
  });
  return normalizeNotificationsList(data).items;
}

/** GET /notifications/unread/count */
export async function getUnreadCount(): Promise<number> {
  const data = await apiGet('/notifications/unread/count', { schema: unreadCountSchema });
  return typeof data === 'number' ? data : data.count;
}

/** PATCH /notifications/:id/read */
export async function markNotificationRead(id: string): Promise<Notification> {
  return apiPatch(`/notifications/${id}/read`, {}, { schema: notificationSchema });
}

/** PATCH /notifications/read-all */
export async function markAllNotificationsRead(): Promise<void> {
  await apiPatch('/notifications/read-all', {});
}

/**
 * GET /notifications/stream — SSE live notification stream.
 * Uses native EventSource with withCredentials. JWT is passed as a query
 * parameter because EventSource cannot send Authorization headers.
 */
export function connectNotificationStream(
  onEvent: (event: NotificationStreamEvent) => void,
  onError?: (error: Event) => void
): () => void {
  const base = getApiBase();
  if (!base || typeof window === 'undefined' || typeof EventSource === 'undefined') {
    return () => undefined;
  }

  const token = getAccessToken();
  const url = new URL(`${base}/notifications/stream`);
  if (token) {
    url.searchParams.set('token', token);
  }

  const eventSource = new EventSource(url.toString(), { withCredentials: true });

  eventSource.onmessage = (messageEvent) => {
    try {
      const parsed = notificationStreamEventSchema.parse(JSON.parse(messageEvent.data));
      onEvent(parsed);
    } catch {
      // Ignore malformed SSE payloads
    }
  };

  eventSource.onerror = (errorEvent) => {
    onError?.(errorEvent);
  };

  return () => {
    eventSource.close();
  };
}

export type { Notification, NotificationStreamEvent, PaginatedNotifications };
