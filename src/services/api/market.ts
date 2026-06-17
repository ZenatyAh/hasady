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
 */
export async function browseMarket(filters: MarketFilters = {}): Promise<MarketBrowseResult> {
  const query = buildMarketQuery(filters);
  const data = await apiGet<MarketListResponse>(`/market${query}`, { public: true });
  return normalizeMarketList(data);
}

/**
 * GET /market/:id — public product detail.
 */
export async function getMarketProduct(id: string): Promise<Crop | null> {
  try {
    const data = await apiGet<ApiProduct | null>(`/market/${id}`, { public: true });
    if (!data) return null;
    return productToCrop(data);
  } catch {
    return null;
  }
}
