import { apiGet, apiPatch, apiPost, buildQuery } from '@/lib/api-client';

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
  return apiGet(`/ratings/me${buildQuery({ page, limit })}`);
}

export async function getGivenRatings(page = 1, limit = 20): Promise<Rating[]> {
  return apiGet(`/ratings/given${buildQuery({ page, limit })}`);
}

export async function updateRating(
  id: string,
  payload: { score?: number; comment?: string }
): Promise<Rating> {
  return apiPatch(`/ratings/${id}`, payload);
}
