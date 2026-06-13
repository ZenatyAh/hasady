import { apiGet, buildQuery } from '@/lib/api-client';
import { productToCrop, type ApiProduct } from '@/lib/mappers/product';
import type { Crop } from '@/services/api/crops';

/** Matches backend `SaleMethod` enum values. */
export type SaleMethod = 'fixed' | 'auction';

/** Matches backend `Unit` enum values. */
export type Unit = 'kg' | 'ton' | 'head' | 'box' | 'piece';

export type MarketFilters = {
  q?: string;
  categoryId?: string;
  saleMethod?: SaleMethod | 'FIXED' | 'AUCTION';
  priceMin?: number;
  priceMax?: number;
  location?: string;
  unit?: Unit;
  page?: number;
  limit?: number;
};

export type MarketMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type MarketBrowseResult = {
  items: Crop[];
  meta: MarketMeta;
};

const DEFAULT_MARKET_PAGE = 1;
const DEFAULT_MARKET_LIMIT = 20;

type MarketListResponse = {
  items: ApiProduct[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPreviousPage?: boolean;
  meta?: MarketMeta;
};

function normalizeSaleMethodFilter(
  saleMethod?: MarketFilters['saleMethod']
): SaleMethod | undefined {
  if (!saleMethod) return undefined;
  const upper = saleMethod.toUpperCase();
  if (upper === 'FIXED') return 'fixed';
  if (upper === 'AUCTION') return 'auction';
  return saleMethod as SaleMethod;
}

function buildMarketQuery(filters: MarketFilters = {}): string {
  return buildQuery({
    q: filters.q,
    categoryId: filters.categoryId,
    saleMethod: normalizeSaleMethodFilter(filters.saleMethod),
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    location: filters.location,
    unit: filters.unit,
    page: filters.page ?? DEFAULT_MARKET_PAGE,
    limit: filters.limit ?? DEFAULT_MARKET_LIMIT,
  });
}

function normalizeMarketMeta(data: MarketListResponse): MarketMeta {
  if (data.meta) {
    return data.meta;
  }

  const page = data.page ?? DEFAULT_MARKET_PAGE;
  const limit = data.limit ?? DEFAULT_MARKET_LIMIT;

  return {
    total: data.total ?? data.items.length,
    page,
    limit,
    totalPages: data.totalPages ?? 1,
    hasNextPage: data.hasNext ?? false,
    hasPreviousPage: data.hasPreviousPage ?? page > 1,
  };
}

function normalizeMarketList(data: MarketListResponse): MarketBrowseResult {
  return {
    items: data.items.map(productToCrop),
    meta: normalizeMarketMeta(data),
  };
}

/**
 * GET /market — public catalog browse.
 * Supports optional query filters; auth token is not required.
 */
export async function browseMarket(
  filters: MarketFilters = {},
  token?: string | null
): Promise<MarketBrowseResult> {
  const query = buildMarketQuery(filters);
  const data = await apiGet<MarketListResponse>(
    `/market${query}`,
    async () => {
      const { getCrops } = await import('@/services/api/crops');
      const crops = await getCrops(token);
      let filtered = [...crops];

      if (filters.q) {
        const q = filters.q.toLowerCase();
        filtered = filtered.filter(
          (crop) =>
            crop.name.toLowerCase().includes(q) ||
            crop.farmName.toLowerCase().includes(q) ||
            crop.description.toLowerCase().includes(q)
        );
      }

      if (filters.categoryId) {
        filtered = filtered.filter((crop) => crop.categoryId === filters.categoryId);
      }

      const saleMethod = normalizeSaleMethodFilter(filters.saleMethod);
      if (saleMethod) {
        const uiMethod = saleMethod === 'auction' ? 'AUCTION' : 'FIXED';
        filtered = filtered.filter((crop) => crop.saleMethod === uiMethod);
      }

      if (filters.priceMin !== undefined) {
        filtered = filtered.filter((crop) => crop.price >= filters.priceMin!);
      }

      if (filters.priceMax !== undefined) {
        filtered = filtered.filter((crop) => crop.price <= filters.priceMax!);
      }

      if (filters.location) {
        const location = filters.location.toLowerCase();
        filtered = filtered.filter((crop) => crop.farmName.toLowerCase().includes(location));
      }

      if (filters.unit) {
        const unitMap: Record<Unit, string> = {
          kg: 'كغم',
          ton: 'طن',
          head: 'رأس',
          box: 'صندوق',
          piece: 'قطعة',
        };
        const expectedUnit = unitMap[filters.unit];
        filtered = filtered.filter((crop) => crop.quantityUnit === expectedUnit);
      }

      const page = filters.page ?? DEFAULT_MARKET_PAGE;
      const limit = filters.limit ?? DEFAULT_MARKET_LIMIT;
      const start = (page - 1) * limit;
      const paged = filtered.slice(start, start + limit);

      return {
        items: paged.map((crop) => ({
          id: crop.id,
          name: crop.name,
          description: crop.description,
          status: crop.status === 'SOLD' ? 'sold' : 'active',
          saleMethod: crop.saleMethod === 'AUCTION' ? 'auction' : 'fixed',
          quantity: crop.quantity,
          unit: 'kg',
          fixedPrice: crop.saleMethod === 'FIXED' ? crop.price : null,
          auctionStartPrice: crop.saleMethod === 'AUCTION' ? crop.price : null,
          currentBid: crop.saleMethod === 'AUCTION' ? crop.price : null,
          deliveryMethod: 'from_farm',
          driverPhone: crop.driverPhone,
          driverName: crop.driverName,
          farmId: crop.farmId,
          categoryId: crop.categoryId ?? null,
          media: crop.images.map((url) => ({ url })),
          farm: {
            id: crop.farmId,
            displayName: crop.farmName,
            managerName: crop.managerName,
            contactPhone: crop.contact,
          },
        })),
        total: filtered.length,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
        hasNext: start + limit < filtered.length,
      };
    },
    { token }
  );

  return normalizeMarketList(data);
}

/**
 * GET /market/:id — public product detail.
 * Auth token is not required.
 */
export async function getMarketProduct(id: string, token?: string | null): Promise<Crop | null> {
  try {
    const data = await apiGet<ApiProduct | null>(
      `/market/${id}`,
      async () => {
        const { getCropById } = await import('@/services/api/crops');
        const crop = await getCropById(id, token);
        if (!crop) return null;

        return {
          id: crop.id,
          name: crop.name,
          description: crop.description,
          status: crop.status === 'SOLD' ? 'sold' : 'active',
          saleMethod: crop.saleMethod === 'AUCTION' ? 'auction' : 'fixed',
          quantity: crop.quantity,
          unit: 'kg',
          fixedPrice: crop.saleMethod === 'FIXED' ? crop.price : null,
          auctionStartPrice: crop.saleMethod === 'AUCTION' ? crop.price : null,
          currentBid: crop.saleMethod === 'AUCTION' ? crop.price : null,
          deliveryMethod: 'from_farm',
          driverPhone: crop.driverPhone,
          driverName: crop.driverName,
          farmId: crop.farmId,
          categoryId: crop.categoryId ?? null,
          media: crop.images.map((url) => ({ url })),
          farm: {
            id: crop.farmId,
            displayName: crop.farmName,
            managerName: crop.managerName,
            contactPhone: crop.contact,
          },
        };
      },
      { token }
    );

    if (!data) return null;
    return productToCrop(data);
  } catch {
    return null;
  }
}
