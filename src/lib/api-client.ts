import type { ZodType } from 'zod';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export function getApiMode(): 'remote' | 'mock' {
  return API_BASE ? 'remote' : 'mock';
}

type ApiErrorBody = { message?: string };
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type ApiRequestOptions<T> = {
  token?: string | null;
  schema?: ZodType<T>;
};

async function readJson(res: Response): Promise<unknown> {
  return res.json().catch(() => ({}));
}

function parseResponse<T>(data: unknown, schema?: ZodType<T>): T {
  if (schema) {
    return schema.parse(data);
  }

  return data as T;
}

async function apiRequest<T>({
  method,
  endpoint,
  body,
  mock,
  options,
}: {
  method: HttpMethod;
  endpoint: string;
  body?: unknown;
  mock: () => Promise<T>;
  options?: ApiRequestOptions<T>;
}): Promise<T> {
  if (!API_BASE) {
    return mock();
  }

  const headers: Record<string, string> = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const data = await readJson(res);

  if (!res.ok) {
    const errorBody = data as ApiErrorBody;
    throw new Error(errorBody.message ?? 'حدث خطأ في الاتصال بالخادم');
  }

  return parseResponse(data, options?.schema);
}

export function apiPost<T>(
  endpoint: string,
  body: unknown,
  mock: () => Promise<T>,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'POST', endpoint, body, mock, options });
}

export function apiGet<T>(
  endpoint: string,
  mock: () => Promise<T>,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'GET', endpoint, mock, options });
}

export function apiPut<T>(
  endpoint: string,
  body: unknown,
  mock: () => Promise<T>,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'PUT', endpoint, body, mock, options });
}

export function apiPatch<T>(
  endpoint: string,
  body: unknown,
  mock: () => Promise<T>,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'PATCH', endpoint, body, mock, options });
}

export function apiDelete<T>(
  endpoint: string,
  mock: () => Promise<T>,
  options?: ApiRequestOptions<T>
): Promise<T> {
  return apiRequest({ method: 'DELETE', endpoint, mock, options });
}
