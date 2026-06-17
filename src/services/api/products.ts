import { apiDelete, apiGet, apiPatch, apiPost, apiUpload, buildQuery } from '@/lib/api-client';
import {
  productSchema,
  productsListSchema,
  type CreateProductPayload,
  type Product,
  type UpdateProductPayload,
} from '@/lib/api-contracts/products';

function normalizeProductList(data: unknown): Product[] {
  const parsed = productsListSchema.parse(data);
  if (Array.isArray(parsed)) return parsed;
  return parsed.items;
}

/** GET /products — list own products */
export async function getProducts(status?: string): Promise<Product[]> {
  const query = buildQuery({ status });
  const data = await apiGet(`/products${query}`, { schema: productsListSchema });
  return normalizeProductList(data);
}

/** GET /products/:id — merchant product detail */
export async function getProductById(id: string): Promise<Product> {
  return apiGet(`/products/${id}`, { schema: productSchema });
}

/** POST /products — create listing */
export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  return apiPost('/products', payload, { schema: productSchema });
}

/** PATCH /products/:id — update listing */
export async function updateProduct(id: string, payload: UpdateProductPayload): Promise<Product> {
  return apiPatch(`/products/${id}`, payload, { schema: productSchema });
}

/** DELETE /products/:id — soft-delete */
export async function deleteProduct(id: string): Promise<void> {
  await apiDelete(`/products/${id}`);
}

/** PATCH /products/:id/relist */
export async function relistProduct(id: string): Promise<Product> {
  return apiPatch(`/products/${id}/relist`, {}, { schema: productSchema });
}

/**
 * PATCH /products/:id/media — upload media (multipart/form-data).
 * Field name per API: files[] (max 10). Content-Type is set by the browser.
 */
export async function uploadProductMedia(id: string, files: File[]): Promise<Product> {
  const formData = new FormData();
  files.forEach((file) => formData.append('files[]', file));

  return apiUpload(`/products/${id}/media`, formData, { schema: productSchema });
}

/** DELETE /products/:id/media/:mediaId */
export async function deleteProductMedia(id: string, mediaId: string): Promise<void> {
  await apiDelete(`/products/${id}/media/${mediaId}`);
}

export type { Product, CreateProductPayload, UpdateProductPayload };
