import { apiGet } from '@/lib/api-client';
import { buildQuery } from '@/lib/api-client';

export interface Category {
  id: string;
  name: string;
  slug?: string;
  parentId?: string | null;
  iconUrl?: string | null;
  isActive?: boolean;
}

export async function getCategories(
  filters: { parentId?: string; isActive?: boolean } = {},
  token?: string | null
): Promise<Category[]> {
  const data = await apiGet<Category[] | { items: Category[] }>(
    `/categories${buildQuery(filters)}`,
    () =>
      Promise.resolve([
        { id: 'all', name: 'الكل' },
        { id: 'vegetables', name: 'خضار' },
        { id: 'fruits', name: 'فواكه' },
      ]),
    { token }
  );

  return Array.isArray(data) ? data : (data.items ?? []);
}
