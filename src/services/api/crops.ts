// src/services/api/crops.ts — UI-facing merchant product helpers (delegates to products API)

import { cropToCreateProductDto, productToCrop } from '@/lib/mappers/product';
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/lib/api-contracts/products';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  relistProduct,
  uploadProductMedia as uploadProductMediaApi,
  deleteProductMedia as deleteProductMediaApi,
} from '@/services/api/products';

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

function productToCropSafe(product: Product): Crop {
  return productToCrop(product);
}

export async function getCrops(status?: string): Promise<Crop[]> {
  const products = await getProducts(status);
  return products.map(productToCropSafe);
}

export async function getCropsByFarm(farmId: string): Promise<Crop[]> {
  const products = await getProducts();
  return products.filter((p) => p.farmId === farmId).map(productToCropSafe);
}

export async function getCropById(id: string): Promise<Crop | null> {
  try {
    const product = await getProductById(id);
    return productToCropSafe(product);
  } catch {
    return null;
  }
}

export async function createCrop(cropData: Omit<Crop, 'id' | 'status'>): Promise<Crop> {
  const payload = cropToCreateProductDto(cropData, {
    categoryId: cropData.categoryId,
  }) as CreateProductPayload;
  const product = await createProduct(payload);
  return productToCropSafe(product);
}

export async function updateCrop(id: string, cropData: Partial<Crop>): Promise<Crop> {
  const payload: UpdateProductPayload = cropData.farmName
    ? (cropToCreateProductDto(cropData as Omit<Crop, 'id' | 'status'>, {
        categoryId: cropData.categoryId,
      }) as UpdateProductPayload)
    : cropData;
  const product = await updateProduct(id, payload);
  return productToCropSafe(product);
}

export async function deleteCrop(id: string): Promise<{ success: boolean }> {
  await deleteProduct(id);
  return { success: true };
}

export async function relistCrop(id: string): Promise<Crop> {
  const product = await relistProduct(id);
  return productToCropSafe(product);
}

export async function uploadProductMediaForCrop(id: string, files: File[]): Promise<Crop> {
  const product = await uploadProductMediaApi(id, files);
  return productToCropSafe(product);
}

/** @deprecated Use uploadProductMediaForCrop */
export const uploadProductMedia = uploadProductMediaForCrop;

export async function deleteProductMediaForCrop(id: string, mediaId: string): Promise<void> {
  await deleteProductMediaApi(id, mediaId);
}

/** @deprecated Use deleteProductMediaForCrop */
export { deleteProductMediaForCrop as deleteProductMedia };
