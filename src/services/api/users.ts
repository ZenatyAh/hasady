import { apiDelete, apiGet, apiPatch, apiUpload } from '@/lib/api-client';
import type { ApiUser } from '@/lib/api-contracts/auth';

export async function getMe(token?: string | null): Promise<ApiUser> {
  return apiGet(
    '/users/me',
    () =>
      Promise.resolve({
        id: '1',
        email: 'demo@mahaseel.test',
        phone: '0597450057',
        fullName: 'مستخدم محاصيل',
        role: 'BUYER' as const,
      }),
    { token }
  );
}

export async function updateMe(
  payload: { fullName?: string; bio?: string; phone?: string },
  token?: string | null
): Promise<ApiUser> {
  return apiPatch(
    '/users/me',
    payload,
    () =>
      Promise.resolve({
        id: '1',
        email: 'demo@mahaseel.test',
        phone: payload.phone ?? '0597450057',
        fullName: payload.fullName ?? 'مستخدم محاصيل',
        role: 'BUYER' as const,
        bio: payload.bio ?? null,
      }),
    { token }
  );
}

export async function promoteToMerchant(token?: string | null): Promise<ApiUser> {
  return apiPatch(
    '/users/me/promote-to-merchant',
    {},
    () =>
      Promise.resolve({
        id: '1',
        email: 'demo@mahaseel.test',
        phone: '0597450057',
        fullName: 'تاجر محاصيل',
        role: 'MERCHANT' as const,
      }),
    { token }
  );
}

export async function uploadAvatar(file: File, token?: string | null): Promise<ApiUser> {
  const formData = new FormData();
  formData.append('file', file);

  return apiUpload(
    '/users/me/avatar',
    formData,
    () =>
      Promise.resolve({
        id: '1',
        email: 'demo@mahaseel.test',
        phone: '0597450057',
        fullName: 'مستخدم محاصيل',
        role: 'BUYER' as const,
        profileImage: URL.createObjectURL(file),
      }),
    { token }
  );
}

export async function deleteAvatar(token?: string | null): Promise<ApiUser> {
  return apiDelete(
    '/users/me/avatar',
    () =>
      Promise.resolve({
        id: '1',
        email: 'demo@mahaseel.test',
        phone: '0597450057',
        fullName: 'مستخدم محاصيل',
        role: 'BUYER' as const,
        profileImage: null,
      }),
    { token }
  );
}

export async function setUserPassword(
  newPassword: string,
  token?: string | null
): Promise<{ message: string }> {
  const { apiPost } = await import('@/lib/api-client');
  return apiPost(
    '/auth/set-password',
    { newPassword },
    () => Promise.resolve({ message: 'تم تغيير كلمة المرور بنجاح' }),
    { token }
  );
}
