import { apiGet, apiPatch, apiPost, buildQuery } from '@/lib/api-client';
import { unwrapListItems } from '@/lib/api-list';

export interface Rating {
  id: string;
  orderId: string;
  score: number;
  comment?: string | null;
  createdAt?: string;
  reviewer?: { id: string; fullName?: string | null };
  reviewed?: { id: string; fullName?: string | null };
}

export async function createRating(payload: {
  orderId: string;
  score: number;
  comment?: string;
}): Promise<Rating> {
  return apiPost('/ratings', payload);
}

export async function getReceivedRatings(page = 1, limit = 20): Promise<Rating[]> {
  const data = await apiGet<unknown>(`/ratings/me${buildQuery({ page, limit })}`);
  return unwrapListItems<Rating>(data);
}

export async function getGivenRatings(page = 1, limit = 20): Promise<Rating[]> {
  const data = await apiGet<unknown>(`/ratings/given${buildQuery({ page, limit })}`);
  return unwrapListItems<Rating>(data);
}

export async function updateRating(
  id: string,
  payload: { score?: number; comment?: string }
): Promise<Rating> {
  return apiPatch(`/ratings/${id}`, payload);
}
