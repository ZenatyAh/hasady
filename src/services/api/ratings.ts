import { apiGet, apiPatch, apiPost } from '@/lib/api-client';
import { buildQuery } from '@/lib/api-client';

export interface Rating {
  id: string;
  orderId: string;
  score: number;
  comment?: string | null;
  createdAt?: string;
  reviewer?: { id: string; fullName?: string | null };
  reviewed?: { id: string; fullName?: string | null };
}

export async function createRating(
  payload: { orderId: string; score: number; comment?: string },
  token?: string | null
): Promise<Rating> {
  return apiPost(
    '/ratings',
    payload,
    () =>
      Promise.resolve({
        id: `rating-${Date.now()}`,
        orderId: payload.orderId,
        score: payload.score,
        comment: payload.comment ?? null,
        createdAt: new Date().toISOString(),
      }),
    { token }
  );
}

export async function getReceivedRatings(
  page = 1,
  limit = 20,
  token?: string | null
): Promise<Rating[]> {
  return apiGet(`/ratings/me${buildQuery({ page, limit })}`, () => Promise.resolve([]), { token });
}

export async function getGivenRatings(
  page = 1,
  limit = 20,
  token?: string | null
): Promise<Rating[]> {
  return apiGet(`/ratings/given${buildQuery({ page, limit })}`, () => Promise.resolve([]), {
    token,
  });
}

export async function updateRating(
  id: string,
  payload: { score?: number; comment?: string },
  token?: string | null
): Promise<Rating> {
  return apiPatch(
    `/ratings/${id}`,
    payload,
    () =>
      Promise.resolve({
        id,
        orderId: 'ord-1',
        score: payload.score ?? 5,
        comment: payload.comment ?? null,
      }),
    { token }
  );
}
