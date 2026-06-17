import { apiDelete, apiGet, apiPatch, apiPost, apiUpload } from '@/lib/api-client';
import {
  currentUserSchema,
  publicUserProfileSchema,
  type CurrentUser,
  type PublicUserProfile,
  type UpdateCurrentUserPayload,
} from '@/lib/api-contracts/users';
import { messageResponseSchema } from '@/lib/api-contracts/auth';

/** GET /users/me — full profile of authenticated user */
export async function getMe(): Promise<CurrentUser> {
  return apiGet('/users/me', { schema: currentUserSchema });
}

/** PATCH /users/me — update fullName / bio */
export async function updateMe(payload: UpdateCurrentUserPayload): Promise<CurrentUser> {
  return apiPatch('/users/me', payload, { schema: currentUserSchema });
}

/** GET /users/:id/profile — public profile (safe fields only) */
export async function getPublicProfile(userId: string): Promise<PublicUserProfile> {
  return apiGet(`/users/${userId}/profile`, {
    public: true,
    schema: publicUserProfileSchema,
  });
}

export async function promoteToMerchant(): Promise<CurrentUser> {
  return apiPatch('/users/me/promote-to-merchant', {}, { schema: currentUserSchema });
}

export async function uploadAvatar(file: File): Promise<CurrentUser> {
  const formData = new FormData();
  formData.append('file', file);

  return apiUpload('/users/me/avatar', formData, { schema: currentUserSchema });
}

export async function deleteAvatar(): Promise<CurrentUser> {
  return apiDelete('/users/me/avatar', { schema: currentUserSchema });
}

export async function setUserPassword(newPassword: string): Promise<{ message: string }> {
  return apiPost('/auth/set-password', { newPassword }, { schema: messageResponseSchema });
}

export type { CurrentUser, PublicUserProfile, UpdateCurrentUserPayload };
