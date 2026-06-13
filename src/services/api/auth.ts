// src/services/api/auth.ts

import { apiPost } from '@/lib/api-client';
import { messageResponseSchema } from '@/lib/api-contracts/auth';
import { apiUserToUser } from '@/lib/mappers/user';

const MOCK_DELAY_MS = 1500;

function mockDelay<T>(fn: () => T | Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (err) {
        reject(err);
      }
    }, MOCK_DELAY_MS);
  });
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'BUYER' | 'MERCHANT';
  profileImage?: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
  message?: string;
}

export interface SignUpCredentials {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface VerifyEmailCredentials {
  email: string;
  code: string;
}

export interface ResetPasswordCredentials {
  email: string;
  code: string;
  newPassword: string;
}

function mapAuthResponse(data: {
  accessToken: string;
  refreshToken: string;
  user: Parameters<typeof apiUserToUser>[0];
  message?: string;
}): AuthResult {
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: apiUserToUser(data.user),
    message: data.message,
  };
}

export async function signUp(credentials: SignUpCredentials): Promise<{ message: string }> {
  return apiPost(
    '/auth/signup',
    credentials,
    () =>
      mockDelay(() => ({
        message: 'تم التسجيل بنجاح. تحقق من بريدك الإلكتروني لتفعيل الحساب.',
      })),
    { schema: messageResponseSchema }
  );
}

export async function signIn(credentials: SignInCredentials): Promise<AuthResult> {
  const data = await apiPost(
    '/auth/signin',
    credentials,
    () =>
      mockDelay(() => ({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        message: 'تم تسجيل الدخول بنجاح',
        user: {
          id: '1',
          email: credentials.email,
          phone: '0597450057',
          fullName: 'محمد علي إسماعيل',
          role: 'BUYER' as const,
        },
      })),
    { skipAuthRedirect: true }
  );

  return mapAuthResponse(data as Parameters<typeof mapAuthResponse>[0]);
}

export async function verifyEmail(credentials: VerifyEmailCredentials): Promise<AuthResult> {
  const data = await apiPost(
    '/auth/verify-email',
    credentials,
    () =>
      mockDelay(() => {
        if (credentials.code !== '123456' && credentials.code !== '531000') {
          throw new Error('رمز التحقق غير صحيح');
        }
        return {
          accessToken: 'mock-verified-access-token',
          refreshToken: 'mock-verified-refresh-token',
          message: 'تم تفعيل الحساب بنجاح',
          user: {
            id: '1',
            email: credentials.email,
            phone: '0597450057',
            fullName: 'مستخدم محاصيل',
            role: 'BUYER' as const,
          },
        };
      }),
    { skipAuthRedirect: true }
  );

  return mapAuthResponse(data as Parameters<typeof mapAuthResponse>[0]);
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return apiPost(
    '/auth/resend-verification',
    { email },
    () =>
      mockDelay(() => ({
        message: 'إذا كان الحساب موجوداً وغير مفعّل، تم إرسال رمز جديد.',
      })),
    { schema: messageResponseSchema, skipAuthRedirect: true }
  );
}

export async function sendResetCode(email: string): Promise<{ message: string }> {
  return apiPost(
    '/auth/reset/send-code',
    { email },
    () =>
      mockDelay(() => {
        if (email === 'missing@example.com') {
          throw new Error('البريد الإلكتروني غير مسجل في النظام');
        }
        return { message: 'تم إرسال رمز التحقق إلى بريدك الإلكتروني' };
      }),
    { schema: messageResponseSchema, skipAuthRedirect: true }
  );
}

export async function verifyResetCode(email: string, code: string): Promise<{ message: string }> {
  return apiPost(
    '/auth/reset/verify',
    { email, code },
    () =>
      mockDelay(() => {
        if (code !== '123456') throw new Error('رمز التحقق غير صحيح');
        return { message: 'تم التحقق من الرمز بنجاح' };
      }),
    { schema: messageResponseSchema, skipAuthRedirect: true }
  );
}

export async function changePassword(
  credentials: ResetPasswordCredentials
): Promise<{ message: string }> {
  return apiPost(
    '/auth/reset/change-password',
    credentials,
    () =>
      mockDelay(() => ({
        message: 'تم تغيير كلمة المرور بنجاح',
      })),
    { schema: messageResponseSchema, skipAuthRedirect: true }
  );
}

export async function refreshSession(refreshToken: string): Promise<AuthResult> {
  const data = await apiPost(
    '/auth/refresh',
    { refreshToken },
    () =>
      mockDelay(() => ({
        accessToken: 'mock-refreshed-access-token',
        refreshToken: 'mock-refreshed-refresh-token',
        user: {
          id: '1',
          email: 'demo@mahaseel.test',
          phone: '0597450057',
          fullName: 'مستخدم محاصيل',
          role: 'BUYER' as const,
        },
      })),
    { skipAuthRedirect: true }
  );

  return mapAuthResponse(data as Parameters<typeof mapAuthResponse>[0]);
}

export async function logout(token?: string | null): Promise<{ message: string }> {
  return apiPost('/auth/logout', {}, () => mockDelay(() => ({ message: 'تم تسجيل الخروج' })), {
    token,
    schema: messageResponseSchema,
  });
}

// Backward-compatible aliases used by existing pages
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const email = credentials.email ?? credentials.phone ?? '';
  const result = await signIn({ email, password: credentials.password });
  return { ...result, token: result.accessToken };
}

export async function register(credentials: RegisterCredentials): Promise<RegisterResponse> {
  return signUp({
    fullName: credentials.fullName ?? credentials.name ?? '',
    email: credentials.email ?? `${credentials.phone}@mahaseel.app`,
    phone: credentials.phone,
    password: credentials.password,
  });
}

export async function verifyOtp(credentials: VerifyOtpCredentials): Promise<VerifyOtpResponse> {
  const email = credentials.email ?? credentials.phone ?? '';
  const result = await verifyEmail({ email, code: credentials.code });
  return {
    ...result,
    success: true,
    message: result.message ?? 'تم التحقق بنجاح',
    token: result.accessToken,
  };
}

export async function recoverPassword(
  credentials: RecoverPasswordCredentials
): Promise<RecoverPasswordResponse> {
  const email = credentials.email ?? credentials.phone ?? '';
  const result = await sendResetCode(email);
  return { success: true, message: result.message };
}

export async function resetPassword(credentials: {
  email: string;
  password: string;
  code?: string;
}): Promise<ResetPasswordResponse> {
  const result = await changePassword({
    email: credentials.email,
    code: credentials.code ?? '000000',
    newPassword: credentials.password,
  });
  return { success: true, message: result.message };
}

export { createBankAccount as addBankAccount } from '@/services/api/bank-accounts';

export type LoginCredentials = SignInCredentials & {
  phone?: string;
  role?: 'BUYER' | 'MERCHANT';
};
export type RegisterCredentials = SignUpCredentials & {
  name?: string;
  role?: 'BUYER' | 'MERCHANT';
};
export type VerifyOtpCredentials = VerifyEmailCredentials & {
  phone?: string;
  role?: 'BUYER' | 'MERCHANT';
};
export type LoginResponse = AuthResult & { token: string };
export type RegisterResponse = { message: string };
export type VerifyOtpResponse = AuthResult & { success: boolean; message: string; token?: string };
export type RecoverPasswordCredentials = { phone?: string; email?: string };
export type RecoverPasswordResponse = { success: boolean; message: string };
export type ResetPasswordResponse = { success: boolean; message: string };
