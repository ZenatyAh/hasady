import type { ApiUser } from '@/lib/api-contracts/auth';
import type { User } from '@/services/api/auth';

export function apiUserToUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.fullName ?? apiUser.email,
    email: apiUser.email,
    phone: apiUser.phone ?? '',
    role: apiUser.role === 'MERCHANT' ? 'MERCHANT' : 'BUYER',
    profileImage: apiUser.profileImage ?? undefined,
  };
}
