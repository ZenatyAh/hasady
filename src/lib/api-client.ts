import { agentLog } from '@/lib/agent-debug';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

export function getApiMode(): 'remote' | 'mock' {
  return API_BASE ? 'remote' : 'mock';
}

type ApiErrorBody = { message?: string };

export async function apiPost<T>(
  endpoint: string,
  body: unknown,
  mock: () => Promise<T>,
  options?: { token?: string | null }
): Promise<T> {
  if (!API_BASE) {
    return mock();
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!res.ok) {
    throw new Error(data.message ?? 'حدث خطأ في الاتصال بالخادم');
  }

  return data as T;
}

export async function apiGet<T>(
  endpoint: string,
  mock: () => Promise<T>,
  options?: { token?: string | null }
): Promise<T> {
  // #region agent log
  agentLog(
    'api-client.ts:apiGet',
    'api_call',
    {
      apiMode: API_BASE ? 'remote' : 'mock',
      endpoint,
      apiBaseSet: Boolean(API_BASE),
      hasAuthHeader: Boolean(options?.token),
    },
    'A'
  );
  // #endregion

  if (!API_BASE) {
    return mock();
  }

  const headers: Record<string, string> = {};
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'GET',
    headers,
  });

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!res.ok) {
    throw new Error(data.message ?? 'حدث خطأ في الاتصال بالخادم');
  }

  return data as T;
}

export async function apiPut<T>(
  endpoint: string,
  body: unknown,
  mock: () => Promise<T>,
  options?: { token?: string | null }
): Promise<T> {
  if (!API_BASE) {
    return mock();
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!res.ok) {
    throw new Error(data.message ?? 'حدث خطأ في الاتصال بالخادم');
  }

  return data as T;
}

export async function apiPatch<T>(
  endpoint: string,
  body: unknown,
  mock: () => Promise<T>,
  options?: { token?: string | null }
): Promise<T> {
  if (!API_BASE) {
    return mock();
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!res.ok) {
    throw new Error(data.message ?? 'حدث خطأ في الاتصال بالخادم');
  }

  return data as T;
}

export async function apiDelete<T>(
  endpoint: string,
  mock: () => Promise<T>,
  options?: { token?: string | null }
): Promise<T> {
  if (!API_BASE) {
    return mock();
  }

  const headers: Record<string, string> = {};
  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: 'DELETE',
    headers,
  });

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;

  if (!res.ok) {
    throw new Error(data.message ?? 'حدث خطأ في الاتصال بالخادم');
  }

  return data as T;
}
