import { describe, expect, it } from 'vitest';
import { signIn } from '@/services/api/auth';

describe('auth service (mock mode)', () => {
  it('signIn returns tokens and mapped user without API URL', async () => {
    const previous = process.env.NEXT_PUBLIC_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    const result = await signIn({ email: 'demo@mahaseel.test', password: 'secret' });

    expect(result.accessToken).toBeTruthy();
    expect(result.refreshToken).toBeTruthy();
    expect(result.user.email).toBe('demo@mahaseel.test');

    process.env.NEXT_PUBLIC_API_URL = previous;
  });
});
