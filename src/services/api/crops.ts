// src/services/api/crops.ts

import { apiDelete, apiGet, apiPatch, apiPost, apiUpload, buildQuery } from '@/lib/api-client';
import { cropToCreateProductDto, productToCrop, type ApiProduct } from '@/lib/mappers/product';

const MOCK_DELAY_MS = 1000;

function mockDelay<T>(fn: () => T | Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, MOCK_DELAY_MS);
  });
}

export interface Crop {
  id: string;
  name: string;
  description: string;
  status: 'SOLD' | 'AVAILABLE';
  saleMethod: 'FIXED' | 'AUCTION';
  quantity: number;
  quantityUnit: string;
  price: number;
  deliveryMethod: string;
  driverPhone: string;
  driverName: string;
  images: string[];
  farmId: string;
  farmName: string;
  contact: string;
  managerName: string;
  categoryId?: string;
}

const DEFAULT_CROPS: Crop[] = [
  {
    id: 'crop-1',
    name: 'خيار بلدي',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    status: 'SOLD',
    saleMethod: 'AUCTION',
    quantity: 400,
    quantityUnit: 'كغم',
    price: 5000,
    deliveryMethod: 'من المزرعة',
    driverPhone: '0599001234',
    driverName: 'عبد الله السبيعي',
    images: ['/images/crops/cucumber.png'],
    farmId: 'farm-1',
    farmName: 'مزرعة الخيرات النجدية',
    contact: '0501234567',
    managerName: 'عبدالعزيز السبيعي',
  },
  {
    id: 'crop-2',
    name: 'طماطم شيري',
    description: 'طماطم كرزية حلوة المذاق، مقطوفة طازجة ومعبأة بعناية فائقة',
    status: 'AVAILABLE',
    saleMethod: 'FIXED',
    quantity: 250,
    quantityUnit: 'صندوق',
    price: 3500,
    deliveryMethod: 'توصيل لباب المزرعة',
    driverPhone: '0599887766',
    driverName: 'سعيد الحارثي',
    images: ['/images/crops/tomato.png'],
    farmId: 'farm-1',
    farmName: 'مزرعة الخيرات النجدية',
    contact: '0501234567',
    managerName: 'عبدالعزيز السبيعي',
  },
];

function getStoredCrops(): Crop[] {
  if (typeof window === 'undefined') return DEFAULT_CROPS;
  const stored = sessionStorage.getItem('hasady-crops');
  if (stored) {
    try {
      return JSON.parse(stored) as Crop[];
    } catch {
      return DEFAULT_CROPS;
    }
  }
  sessionStorage.setItem('hasady-crops', JSON.stringify(DEFAULT_CROPS));
  return DEFAULT_CROPS;
}

function saveStoredCrops(crops: Crop[]): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('hasady-crops', JSON.stringify(crops));
  }
}

function mapProductList(data: ApiProduct[] | Crop[]): Crop[] {
  if (!Array.isArray(data)) return [];
  if (data.length > 0 && 'farmName' in (data[0] as Crop)) {
    return data as Crop[];
  }
  return (data as ApiProduct[]).map(productToCrop);
}

function mapProduct(data: ApiProduct | Crop | null): Crop | null {
  if (!data) return null;
  if ('farmName' in data) return data as Crop;
  return productToCrop(data as ApiProduct);
}

export async function getCrops(token?: string | null, status?: string): Promise<Crop[]> {
  const query = buildQuery({ status });
  const data = await apiGet(
    `/products${query}`,
    () =>
      mockDelay(() => {
        return getStoredCrops();
      }),
    { token }
  );
  return mapProductList(data as ApiProduct[] | Crop[]);
}

export async function getCropsByFarm(farmId: string, token?: string | null): Promise<Crop[]> {
  return apiGet(
    `/products?farmId=${farmId}`,
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        return crops.filter((c) => c.farmId === farmId);
      }),
    { token }
  );
}

export async function getCropById(id: string, token?: string | null): Promise<Crop | null> {
  const data = await apiGet(
    `/products/${id}`,
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        return crops.find((c) => c.id === id) || null;
      }),
    { token }
  );
  return mapProduct(data as ApiProduct | Crop | null);
}

export async function createCrop(
  cropData: Omit<Crop, 'id' | 'status'>,
  token?: string | null
): Promise<Crop> {
  const payload = cropToCreateProductDto(cropData, { categoryId: cropData.categoryId });
  const data = await apiPost(
    '/products',
    payload,
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        const newCrop: Crop = {
          ...cropData,
          id: `crop-${Date.now()}`,
          status: 'AVAILABLE',
        };
        const updated = [...crops, newCrop];
        saveStoredCrops(updated);
        return newCrop;
      }),
    { token }
  );
  return mapProduct(data as ApiProduct | Crop) as Crop;
}

export async function updateCrop(
  id: string,
  cropData: Partial<Crop>,
  token?: string | null
): Promise<Crop> {
  const payload = cropData.farmName
    ? cropToCreateProductDto(cropData as Omit<Crop, 'id' | 'status'>, {
        categoryId: cropData.categoryId,
      })
    : cropData;
  const data = await apiPatch(
    `/products/${id}`,
    payload,
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        const cropIdx = crops.findIndex((c) => c.id === id);
        if (cropIdx === -1) {
          throw new Error('المحصول غير موجود');
        }
        const updatedCrop = {
          ...crops[cropIdx],
          ...cropData,
        };
        const updated = [...crops];
        updated[cropIdx] = updatedCrop;
        saveStoredCrops(updated);
        return updatedCrop;
      }),
    { token }
  );
  return mapProduct(data as ApiProduct | Crop) as Crop;
}

export async function deleteCrop(id: string, token?: string | null): Promise<{ success: boolean }> {
  return apiDelete(
    `/products/${id}`,
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        const updated = crops.filter((c) => c.id !== id);
        saveStoredCrops(updated);
        return { success: true };
      }),
    { token }
  );
}

export async function relistCrop(id: string, token?: string | null): Promise<Crop> {
  const data = await apiPatch(
    `/products/${id}/relist`,
    {},
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        const cropIdx = crops.findIndex((c) => c.id === id);
        if (cropIdx === -1) {
          throw new Error('المحصول غير موجود');
        }
        const updatedCrop = {
          ...crops[cropIdx],
          status: 'AVAILABLE' as const,
        };
        const updated = [...crops];
        updated[cropIdx] = updatedCrop;
        saveStoredCrops(updated);
        return updatedCrop;
      }),
    { token }
  );
  return mapProduct(data as ApiProduct | Crop) as Crop;
}

export async function uploadProductMedia(
  id: string,
  files: File[],
  token?: string | null
): Promise<Crop> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const data = await apiUpload(
    `/products/${id}/media`,
    formData,
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        const crop = crops.find((item) => item.id === id);
        if (!crop) throw new Error('المحصول غير موجود');
        return crop;
      }),
    { token }
  );

  return mapProduct(data as ApiProduct | Crop) as Crop;
}

export async function deleteProductMedia(
  id: string,
  mediaId: string,
  token?: string | null
): Promise<void> {
  await apiDelete(`/products/${id}/media/${mediaId}`, () => mockDelay(() => ({ success: true })), {
    token,
  });
}
