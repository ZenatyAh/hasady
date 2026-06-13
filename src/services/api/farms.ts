// src/services/api/farms.ts

import { apiGet, apiPost, apiPut, apiUpload } from '@/lib/api-client';

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

export interface Farm {
  id: string;
  name: string;
  location: string;
  area: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  managerName?: string;
  contactNumber?: string;
  agriculturalRegisterUrl?: string;
  rejectionReason?: string;
}

const DEFAULT_FARMS: Farm[] = [
  {
    id: 'farm-1',
    name: 'مزرعة الخيرات النجدية',
    location: 'القصيم - عنيزة، المملكة العربية السعودية',
    area: '50 دونم',
    status: 'APPROVED',
    managerName: 'عبدالعزيز السبيعي',
    contactNumber: '0501234567',
    agriculturalRegisterUrl: '/files/register-1.pdf',
  },
  {
    id: 'farm-2',
    name: 'مزرعة الخيرات النجدية',
    location: 'القصيم - عنيزة، المملكة العربية السعودية',
    area: '45 دونم',
    status: 'PENDING',
    managerName: 'عبدالعزيز السبيعي',
    contactNumber: '0501234567',
    agriculturalRegisterUrl: '/files/register-2.pdf',
  },
  {
    id: 'farm-3',
    name: 'مزرعة الخيرات النجدية',
    location: 'القصيم - عنيزة، المملكة العربية السعودية',
    area: '30 دونم',
    status: 'REJECTED',
    managerName: 'عبدالعزيز السبيعي',
    contactNumber: '0501234567',
    agriculturalRegisterUrl: '/files/register-3.pdf',
    rejectionReason:
      'تم رفض طلب إضافة المزرعة بسبب أن الوثيقة المرفقة لا تُعتبر وثيقة رسمية معتمدة. يرجى التأكد من رفع سجل زراعي صادر عن جهة رسمية وموثق بشكل واضح، حتى نتمكن من مراجعة الطلب وقبوله ضمن النظام.',
  },
];

function getStoredFarms(): Farm[] {
  if (typeof window === 'undefined') return DEFAULT_FARMS;
  const stored = sessionStorage.getItem('hasady-farms');
  if (stored) {
    try {
      return JSON.parse(stored) as Farm[];
    } catch {
      return DEFAULT_FARMS;
    }
  }
  sessionStorage.setItem('hasady-farms', JSON.stringify(DEFAULT_FARMS));
  return DEFAULT_FARMS;
}

function saveStoredFarms(farms: Farm[]): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('hasady-farms', JSON.stringify(farms));
  }
}

export async function getFarms(token?: string | null): Promise<Farm[]> {
  return apiGet(
    '/farms',
    () =>
      mockDelay(() => {
        return getStoredFarms();
      }),
    { token }
  );
}

export async function getFarmById(id: string, token?: string | null): Promise<Farm | null> {
  return apiGet(
    `/farms/${id}`,
    () =>
      mockDelay(() => {
        const farms = getStoredFarms();
        return farms.find((f) => f.id === id) || null;
      }),
    { token }
  );
}

export async function createFarm(
  farmData: Omit<Farm, 'id' | 'status'>,
  token?: string | null
): Promise<Farm> {
  return apiPost(
    '/farms',
    farmData,
    () =>
      mockDelay(() => {
        const farms = getStoredFarms();
        const newFarm: Farm = {
          ...farmData,
          id: `farm-${Date.now()}`,
          status: 'PENDING', // Submissions default to pending review
        };
        const updated = [...farms, newFarm];
        saveStoredFarms(updated);
        return newFarm;
      }),
    { token }
  );
}

export async function updateFarm(
  id: string,
  farmData: Partial<Farm>,
  token?: string | null
): Promise<Farm> {
  const payload = {
    name: farmData.name,
    displayName: farmData.name,
    managerName: farmData.managerName,
    contactPhone: farmData.contactNumber,
    locationText: farmData.location,
  };

  return apiPut(
    `/farms/${id}`,
    payload,
    () =>
      mockDelay(() => {
        const farms = getStoredFarms();
        const farmIdx = farms.findIndex((f) => f.id === id);
        if (farmIdx === -1) {
          throw new Error('المزرعة غير موجودة');
        }
        const updatedFarm = {
          ...farms[farmIdx],
          ...farmData,
          status: 'PENDING' as const,
        };
        const updated = [...farms];
        updated[farmIdx] = updatedFarm;
        saveStoredFarms(updated);
        return updatedFarm;
      }),
    { token }
  );
}

export async function uploadFarmMedia(
  id: string,
  files: File[],
  token?: string | null
): Promise<Farm> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return apiUpload(
    `/farms/${id}/media`,
    formData,
    () =>
      mockDelay(() => {
        const farms = getStoredFarms();
        const farm = farms.find((item) => item.id === id);
        if (!farm) throw new Error('المزرعة غير موجودة');
        return farm;
      }),
    { token }
  );
}
