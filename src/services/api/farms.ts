// src/services/api/farms.ts

import { apiGet, apiPost, apiPut, apiUpload } from '@/lib/api-client';
import { unwrapListItems } from '@/lib/api-list';

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

export async function getFarms(): Promise<Farm[]> {
  const data = await apiGet<unknown>('/farms');
  return unwrapListItems<Farm>(data);
}

export async function getFarmById(id: string): Promise<Farm | null> {
  return apiGet(`/farms/${id}`);
}

export async function createFarm(farmData: Omit<Farm, 'id' | 'status'>): Promise<Farm> {
  return apiPost('/farms', farmData);
}

export async function updateFarm(id: string, farmData: Partial<Farm>): Promise<Farm> {
  const payload = {
    name: farmData.name,
    displayName: farmData.name,
    managerName: farmData.managerName,
    contactPhone: farmData.contactNumber,
    locationText: farmData.location,
  };

  return apiPut(`/farms/${id}`, payload);
}

export async function uploadFarmMedia(id: string, files: File[]): Promise<Farm> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  return apiUpload(`/farms/${id}/media`, formData);
}
