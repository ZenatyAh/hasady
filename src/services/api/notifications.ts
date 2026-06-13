import { apiGet, apiPatch, buildQuery } from '@/lib/api-client';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  titleAr?: string | null;
  bodyAr?: string | null;
  type?: string;
  isRead: boolean;
  createdAt: string;
}

type PaginatedNotifications = {
  items: NotificationItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
};

function normalizeNotifications(
  data: PaginatedNotifications | NotificationItem[]
): NotificationItem[] {
  if (Array.isArray(data)) return data;
  return data.items ?? [];
}

export async function getNotifications(
  page = 1,
  limit = 20,
  token?: string | null
): Promise<NotificationItem[]> {
  const data = await apiGet<PaginatedNotifications | NotificationItem[]>(
    `/notifications${buildQuery({ page, limit })}`,
    () =>
      Promise.resolve([
        {
          id: 'not-1',
          title: 'تم قبول طلب الشراء',
          body: 'يرجى إتمام الدفع لتأكيد الطلب',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
      ]),
    { token }
  );

  return normalizeNotifications(data).map((item) => ({
    ...item,
    title: item.titleAr ?? item.title,
    body: item.bodyAr ?? item.body,
  }));
}

export async function getUnreadNotifications(
  limit = 50,
  token?: string | null
): Promise<NotificationItem[]> {
  const data = await apiGet<NotificationItem[]>(
    `/notifications/unread${buildQuery({ limit })}`,
    () => Promise.resolve([]),
    { token }
  );
  return data.map((item) => ({
    ...item,
    title: item.titleAr ?? item.title,
    body: item.bodyAr ?? item.body,
  }));
}

export async function getUnreadCount(token?: string | null): Promise<number> {
  const data = await apiGet<{ count: number } | number>(
    '/notifications/unread/count',
    () => Promise.resolve({ count: 0 }),
    { token }
  );
  return typeof data === 'number' ? data : data.count;
}

export async function markNotificationRead(id: string, token?: string | null): Promise<void> {
  await apiPatch(`/notifications/${id}/read`, {}, () => Promise.resolve({}), { token });
}

export async function markAllNotificationsRead(token?: string | null): Promise<void> {
  await apiPatch('/notifications/read-all', {}, () => Promise.resolve({}), { token });
}

export function subscribeNotifications(
  token: string,
  onMessage: (payload: unknown) => void,
  onError?: () => void
): () => void {
  const base = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
  if (!base) return () => undefined;

  let cancelled = false;

  const poll = async () => {
    if (cancelled) return;
    try {
      const count = await getUnreadCount(token);
      onMessage({ count });
    } catch {
      onError?.();
    }
  };

  void poll();
  const pollTimer = setInterval(poll, 30_000);

  return () => {
    cancelled = true;
    if (pollTimer) clearInterval(pollTimer);
  };
}
