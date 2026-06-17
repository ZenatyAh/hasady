import type { CurrentUser } from '@/lib/api-contracts/users';
import type { User } from '@/services/api/auth';

export function apiUserToUser(apiUser: CurrentUser): User {
  return {
    id: apiUser.id,
    name: apiUser.fullName ?? apiUser.email,
    email: apiUser.email,
    phone: apiUser.phone ?? '',
    role: apiUser.role,
    profileImage: apiUser.profileImage ?? undefined,
    bio: apiUser.bio ?? undefined,
  };
}

/** @deprecated Use apiUserToUser */
export const mapApiUserToUser = apiUserToUser;
