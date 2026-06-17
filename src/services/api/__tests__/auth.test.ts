import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { signIn } from '@/services/api/auth';

const API_URL = 'https://mahaseel-production.up.railway.app/api/v1';

describe('auth service', () => {
  const previousUrl = process.env.NEXT_PUBLIC_API_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = API_URL;
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: {
            accessToken: 'test-access-token',
            refreshToken: 'test-refresh-token',
            message: 'تم تسجيل الدخول بنجاح',
            user: {
              id: '1',
              email: 'demo@mahaseel.test',
              phone: '0597450057',
              fullName: 'مستخدم محاصيل',
              role: 'buyer',
            },
          },
        }),
      })
    );
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = previousUrl;
    vi.unstubAllGlobals();
  });

  it('signIn returns tokens and mapped user', async () => {
    const result = await signIn({ email: 'demo@mahaseel.test', password: 'secret' });

    expect(result.accessToken).toBe('test-access-token');
    expect(result.refreshToken).toBe('test-refresh-token');
    expect(result.user.email).toBe('demo@mahaseel.test');
    expect(result.user.role).toBe('BUYER');
  });
});
