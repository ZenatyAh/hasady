import { apiGet, buildQuery } from '@/lib/api-client';
import { productToCrop, type ApiProduct } from '@/lib/mappers/product';
import type { Crop } from '@/services/api/crops';

export type MarketFilters = {
  q?: string;
  categoryId?: string;
  saleMethod?: 'FIXED' | 'AUCTION';
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

export async function browseMarket(
  filters: MarketFilters = {},
  token?: string | null
): Promise<{ items: Crop[]; meta: MarketMeta }> {
  const query = buildQuery(filters);
  const data = await apiGet(
    `/market${query}`,
    async () => {
      const { getCrops } = await import('@/services/api/crops');
      const crops = await getCrops(token);
      return {
        items: crops.map((crop) => ({
          id: crop.id,
          name: crop.name,
          description: crop.description,
          status: crop.status === 'SOLD' ? 'sold' : 'active',
          saleMethod: crop.saleMethod,
          quantity: crop.quantity,
          unit: 'KG',
          fixedPrice: crop.saleMethod === 'FIXED' ? crop.price : null,
          auctionStartPrice: crop.saleMethod === 'AUCTION' ? crop.price : null,
          currentBid: crop.saleMethod === 'AUCTION' ? crop.price : null,
          deliveryMethod: 'FROM_FARM',
          driverPhone: crop.driverPhone,
          driverName: crop.driverName,
          farmId: crop.farmId,
          media: crop.images.map((url) => ({ url })),
          farm: {
            id: crop.farmId,
            displayName: crop.farmName,
            managerName: crop.managerName,
            contactPhone: crop.contact,
          },
        })),
        meta: {
          total: crops.length,
          page: 1,
          limit: 20,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    },
    { token }
  );

  return {
    items: data.items.map(productToCrop),
    meta: data.meta,
  };
}

export async function getMarketProduct(id: string, token?: string | null): Promise<Crop | null> {
  const data = await apiGet(
    `/market/${id}`,
    async () => {
      const { getCropById } = await import('@/services/api/crops');
      return getCropById(id, token);
    },
    { token }
  );

  if (!data) return null;
  return productToCrop(data as unknown as ApiProduct);
}
