import type { ZodType } from 'zod';
import { ApiError } from '@/lib/api-errors';
import { getAccessToken, useAuthStore } from '@/lib/store';

const DEFAULT_PRODUCTION_API_URL = 'https://mahaseel-production.up.railway.app/api/v1';

function getApiBase(): string {
  const fromEnv = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === 'production') return DEFAULT_PRODUCTION_API_URL;
  return '';
}

export { getApiBase };

export function getApiMode(): 'remote' | 'mock' {
  return getApiBase() ? 'remote' : 'mock';
}

function assertApiConfigured(): void {
  if (!getApiBase()) {
    throw new ApiError(
      'لم يتم ضبط NEXT_PUBLIC_API_URL. أضف عنوان الـ API في ملف .env.local (مثال: https://mahaseel-production.up.railway.app/api/v1)',
      0
    );
  }
}

type ApiErrorBody = {
  message?: string | string[];
  statusCode?: number;
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiRequestOptions<T> = {
  token?: string | null;
  schema?: ZodType<T>;
  skipAuthRedirect?: boolean;
  /** Skip Authorization header for public endpoints */
  public?: boolean;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string | string[];
  statusCode?: number;
};

export function buildQuery(
  params: Record<string, string | number | boolean | undefined | null>
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `?${query}` : '';
}

async function readJson(res: Response): Promise<unknown> {
  return res.json().catch(() => ({}));
}

function normalizeMessage(message: string | string[] | undefined, fallback: string): string {
  if (!message) return fallback;
  return Array.isArray(message) ? message.join('، ') : message;
}

function parseResponse<T>(data: unknown, schema?: ZodType<T>): T {
  if (schema) {
    return schema.parse(data);
  }
  return data as T;
}

function unwrapEnvelope<T>(payload: unknown): T {
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    (payload as ApiEnvelope<T>).success === true &&
    'data' in payload
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
}

function handleUnauthorized(skipAuthRedirect?: boolean) {
  if (typeof window === 'undefined' || skipAuthRedirect) return;
  const { pathname } = window.location;
  if (pathname.startsWith('/login') || pathname.startsWith('/signup')) return;
  window.dispatchEvent(new CustomEvent('mahaseel:unauthorized'));
}

function resolveAuthToken(options?: ApiRequestOptions<unknown>): string | null {
  if (options?.public) return null;
  if (options?.token) return options.token;
  return getAccessToken();
}

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

async function apiRequest<T>({
  method,
  endpoint,
  body,
  options,
}: {
  method: HttpMethod;
  endpoint: string;
  body?: unknown;
  options?: ApiRequestOptions<T>;
}): Promise<T> {
  assertApiConfigured();

  const performFetch = async (tokenOverride?: string): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (body !== undefined && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
    const token = tokenOverride ?? resolveAuthToken(options);
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return fetch(`${getApiBase()}${endpoint}`, {
      method,
      headers,
      body: body === undefined ? undefined : body instanceof FormData ? body : JSON.stringify(body),
    });
  };

  let res = await performFetch();
  let payload = await readJson(res);

  // Silent refresh flow (skip for public routes and the refresh endpoint itself)
  if (res.status === 401 && !options?.public && !endpoint.includes('/auth/refresh')) {
    const authState = useAuthStore.getState();
    const refreshToken = authState.refreshToken;

    if (refreshToken) {
      if (isRefreshing) {
        try {
          const newToken = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          res = await performFetch(newToken);
          payload = await readJson(res);
        } catch (err) {
          handleUnauthorized(options?.skipAuthRedirect);
          throw err;
        }
      } else {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${getApiBase()}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshRes.ok) throw new Error('Refresh failed');

          const refreshPayload = await readJson(refreshRes);
          const unwrappedRefresh = unwrapEnvelope<{ accessToken: string; refreshToken?: string }>(
            refreshPayload
          );

          if (unwrappedRefresh?.accessToken) {
            authState.setAuthSession(
              {
                accessToken: unwrappedRefresh.accessToken,
                refreshToken: unwrappedRefresh.refreshToken || refreshToken,
              },
              authState.user!
            );

            processQueue(null, unwrappedRefresh.accessToken);
            res = await performFetch(unwrappedRefresh.accessToken);
            payload = await readJson(res);
          } else {
            throw new Error('Invalid token structure');
          }
        } catch (err) {
          processQueue(err, null);
          authState.clearAuthSession();
          handleUnauthorized(options?.skipAuthRedirect);
          throw new ApiError('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً', 401);
        } finally {
          isRefreshing = false;
        }
      }
    } else {
      handleUnauthorized(options?.skipAuthRedirect);
    }
  }

  if (!res.ok) {
    const errorBody = payload as ApiErrorBody;
    if (res.status === 401) {
      handleUnauthorized(options?.skipAuthRedirect);
    }
    throw new ApiError(
      normalizeMessage(errorBody.message, 'حدث خطأ في الاتصال بالخادم'),
      errorBody.statusCode ?? res.status
    );
  }

  const unwrapped = unwrapEnvelope<T>(payload);
  return parseResponse(unwrapped, options?.schema);
}

export function apiPost<T>(
  endpoint: string,
  body: unknown,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'POST', endpoint, body, options });
}

export function apiGet<T>(endpoint: string, options?: ApiRequestOptions<T>): Promise<T> {
  return apiRequest({ method: 'GET', endpoint, options });
}

export function apiPut<T>(
  endpoint: string,
  body: unknown,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'PUT', endpoint, body, options });
}

export function apiPatch<T>(
  endpoint: string,
  body: unknown,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'PATCH', endpoint, body, options });
}

export function apiDelete<T>(endpoint: string, options?: ApiRequestOptions<T>): Promise<T> {
  return apiRequest({ method: 'DELETE', endpoint, options });
}

export function apiUpload<T>(
  endpoint: string,
  formData: FormData,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'PATCH', endpoint, body: formData, options });
}

export function apiPutUpload<T>(
  endpoint: string,
  formData: FormData,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'PUT', endpoint, body: formData, options });
}
