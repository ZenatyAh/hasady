// src/services/api/crops.ts

import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api-client';

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

export async function getCrops(token?: string | null): Promise<Crop[]> {
  return apiGet(
    '/products',
    () =>
      mockDelay(() => {
        return getStoredCrops();
      }),
    { token }
  );
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
  return apiGet(
    `/products/${id}`,
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        return crops.find((c) => c.id === id) || null;
      }),
    { token }
  );
}

export async function createCrop(
  cropData: Omit<Crop, 'id' | 'status'>,
  token?: string | null
): Promise<Crop> {
  return apiPost(
    '/products',
    cropData,
    () =>
      mockDelay(() => {
        const crops = getStoredCrops();
        const newCrop: Crop = {
          ...cropData,
          id: `crop-${Date.now()}`,
          status: 'AVAILABLE', // Defaults to available for sale
        };
        const updated = [...crops, newCrop];
        saveStoredCrops(updated);
        return newCrop;
      }),
    { token }
  );
}

export async function updateCrop(
  id: string,
  cropData: Partial<Crop>,
  token?: string | null
): Promise<Crop> {
  return apiPatch(
    `/products/${id}`,
    cropData,
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
  return apiPatch(
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
}
