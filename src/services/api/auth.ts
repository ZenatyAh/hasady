// src/services/api/auth.ts

import { apiPost } from '@/lib/api-client';
import {
  messageResponseSchema,
  signInResponseSchema,
  verifyEmailResponseSchema,
} from '@/lib/api-contracts/auth';
import { apiUserToUser } from '@/lib/mappers/user';
import type { Role } from '@/lib/api-contracts/users';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: Role;
  profileImage?: string;
  bio?: string;
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

const publicAuthOptions = { public: true, skipAuthRedirect: true } as const;

export async function signUp(credentials: SignUpCredentials): Promise<{ message: string }> {
  return apiPost('/auth/signup', credentials, {
    schema: messageResponseSchema,
    ...publicAuthOptions,
  });
}

export async function signIn(credentials: SignInCredentials): Promise<AuthResult> {
  const data = await apiPost('/auth/signin', credentials, {
    schema: signInResponseSchema,
    ...publicAuthOptions,
  });

  return mapAuthResponse(data);
}

export async function verifyEmail(credentials: VerifyEmailCredentials): Promise<AuthResult> {
  const data = await apiPost('/auth/verify-email', credentials, {
    schema: verifyEmailResponseSchema,
    ...publicAuthOptions,
  });

  return mapAuthResponse(data);
}

export async function resendVerification(email: string): Promise<{ message: string }> {
  return apiPost(
    '/auth/resend-verification',
    { email },
    { schema: messageResponseSchema, ...publicAuthOptions }
  );
}

export async function sendResetCode(email: string): Promise<{ message: string }> {
  return apiPost(
    '/auth/reset/send-code',
    { email },
    { schema: messageResponseSchema, ...publicAuthOptions }
  );
}

export async function verifyResetCode(email: string, code: string): Promise<{ message: string }> {
  return apiPost(
    '/auth/reset/verify',
    { email, code },
    { schema: messageResponseSchema, ...publicAuthOptions }
  );
}

export async function changePassword(
  credentials: ResetPasswordCredentials
): Promise<{ message: string }> {
  return apiPost('/auth/reset/change-password', credentials, {
    schema: messageResponseSchema,
    ...publicAuthOptions,
  });
}

export async function refreshSession(refreshToken: string): Promise<AuthResult> {
  const data = await apiPost(
    '/auth/refresh',
    { refreshToken },
    { schema: signInResponseSchema, ...publicAuthOptions }
  );

  return mapAuthResponse(data);
}

export async function logout(): Promise<{ message: string }> {
  return apiPost('/auth/logout', {}, { schema: messageResponseSchema });
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
  role?: Role;
};
export type RegisterCredentials = SignUpCredentials & {
  name?: string;
  role?: Role;
};
export type VerifyOtpCredentials = VerifyEmailCredentials & {
  phone?: string;
  role?: Role;
};
export type LoginResponse = AuthResult & { token: string };
export type RegisterResponse = { message: string };
export type VerifyOtpResponse = AuthResult & { success: boolean; message: string; token?: string };
export type RecoverPasswordCredentials = { phone?: string; email?: string };
export type RecoverPasswordResponse = { success: boolean; message: string };
export type ResetPasswordResponse = { success: boolean; message: string };
