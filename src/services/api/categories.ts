import { apiGet, buildQuery } from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  iconUrl?: string | null;
  isActive?: boolean;
}

export async function getCategories(
  filters: { parentId?: string; isActive?: boolean } = {}
): Promise<Category[]> {
  const data = await apiGet<Category[] | { items: Category[] }>(
    `/categories${buildQuery(filters)}`
  );

  return Array.isArray(data) ? data : (data.items ?? []);
}
