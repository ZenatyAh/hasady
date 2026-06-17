import { describe, expect, it } from 'vitest';
import { apiUserToUser } from '@/lib/mappers/user';
import { roleSchema } from '@/lib/api-contracts/users';

describe('roleSchema', () => {
  it('accepts lowercase roles from the API', () => {
    expect(roleSchema.parse('buyer')).toBe('BUYER');
    expect(roleSchema.parse('merchant')).toBe('MERCHANT');
    expect(roleSchema.parse('admin')).toBe('ADMIN');
  });

  it('defaults unknown roles to BUYER', () => {
    expect(roleSchema.parse(null)).toBe('BUYER');
    expect(roleSchema.parse('unknown')).toBe('BUYER');
  });
});

describe('apiUserToUser', () => {
  it('maps merchant role and nullable fields', () => {
    const user = apiUserToUser({
      id: 'u-1',
      email: 'merchant@test.com',
      phone: null,
      fullName: 'تاجر محاصيل',
      role: 'MERCHANT',
      profileImage: 'https://cdn.test/avatar.png',
    });

    expect(user).toEqual({
      id: 'u-1',
      name: 'تاجر محاصيل',
      email: 'merchant@test.com',
      phone: '',
      role: 'MERCHANT',
      profileImage: 'https://cdn.test/avatar.png',
      bio: undefined,
    });
  });

  it('falls back to email when fullName is missing', () => {
    const user = apiUserToUser({
      id: 'u-2',
      email: 'buyer@test.com',
      role: 'BUYER',
    });

    expect(user.name).toBe('buyer@test.com');
    expect(user.role).toBe('BUYER');
  });
});
