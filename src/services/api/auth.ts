// src/services/api/auth.ts

import { apiPost } from '@/lib/api-client';

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

// ─── Shared types ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  phone: string;
  role?: 'BUYER' | 'MERCHANT';
}

// ─── Login ───────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  phone: string;
  password?: string;
  role?: 'BUYER' | 'MERCHANT';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return apiPost('/auth/login', credentials, () =>
    mockDelay(() => {
      // Default to MERCHANT if logging in with the predefined admin/merchant credentials
      const selectedRole =
        credentials.role || (credentials.phone === '0597450057' ? 'MERCHANT' : 'BUYER');
      if (credentials.phone === '0597450057' && credentials.password === '123456') {
        return {
          token: 'mock-jwt-token-12345',
          user: { id: '1', phone: '0597450057', name: 'محمد علي إسماعيل', role: selectedRole },
        };
      }
      // For any other number, log them in as the selected role or BUYER
      return {
        token: `mock-jwt-token-${Date.now()}`,
        user: {
          id: String(Date.now()),
          phone: credentials.phone,
          name: 'مستخدم محاصيل',
          role: selectedRole,
        },
      };
    })
  );
}

// ─── Register ────────────────────────────────────────────────────────────────

export interface RegisterCredentials {
  name: string;
  phone: string;
  password: string;
  role?: 'BUYER' | 'MERCHANT';
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export async function register(credentials: RegisterCredentials): Promise<RegisterResponse> {
  return apiPost('/auth/register', credentials, () =>
    mockDelay(() => {
      if (credentials.phone === '0500000000') {
        throw new Error('رقم الهاتف مسجل مسبقاً');
      }
      return {
        token: 'mock-new-user-token-99999',
        user: {
          id: String(Date.now()),
          phone: credentials.phone,
          name: credentials.name,
          role: credentials.role || 'BUYER',
        },
      };
    })
  );
}

// ─── Verification ────────────────────────────────────────────────────────────

export interface VerifyOtpCredentials {
  phone: string;
  code: string;
  role?: 'BUYER' | 'MERCHANT';
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export async function verifyOtp(credentials: VerifyOtpCredentials): Promise<VerifyOtpResponse> {
  return apiPost('/auth/verify', credentials, () =>
    mockDelay(() => {
      if (credentials.code === '123456' || credentials.code === '531000') {
        return {
          success: true,
          message: 'تم تفعيل الحساب بنجاح',
          token: 'mock-verified-token',
          user: {
            id: '1',
            phone: credentials.phone,
            name: 'Verified User',
            role: credentials.role || 'BUYER',
          },
        };
      }
      throw new Error('رمز التحقق غير صحيح');
    })
  );
}

// ─── Password Recovery ───────────────────────────────────────────────────────

export interface RecoverPasswordCredentials {
  phone: string;
}

export interface RecoverPasswordResponse {
  success: boolean;
  message: string;
}

export async function recoverPassword(
  credentials: RecoverPasswordCredentials
): Promise<RecoverPasswordResponse> {
  return apiPost('/auth/recover-password', credentials, () =>
    mockDelay(() => {
      if (credentials.phone === '0599999999') {
        throw new Error('رقم الهاتف غير مسجل في النظام');
      }
      return {
        success: true,
        message: 'تم إرسال رمز التحقق إلى رقم هاتفك',
      };
    })
  );
}

// ─── Reset Password ──────────────────────────────────────────────────────────

export interface ResetPasswordCredentials {
  phone: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export async function resetPassword(
  credentials: ResetPasswordCredentials
): Promise<ResetPasswordResponse> {
  return apiPost('/auth/reset-password', credentials, () =>
    mockDelay(() => {
      if (!credentials.phone || !credentials.password) {
        throw new Error('بيانات تغيير كلمة المرور غير مكتملة');
      }
      return {
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح',
      };
    })
  );
}

// ─── Bank Account ─────────────────────────────────────────────────────────────

export interface AddBankAccountCredentials {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
}

export interface AddBankAccountResponse {
  success: boolean;
  message: string;
  accountId?: string;
}

export async function addBankAccount(
  credentials: AddBankAccountCredentials,
  token?: string | null
): Promise<AddBankAccountResponse> {
  return apiPost(
    '/bank/add-account',
    credentials,
    () =>
      mockDelay(() => {
        const accountSuffix = credentials.accountNumber.slice(-4).padStart(4, '0');
        return {
          success: true,
          message: 'تم إضافة الحساب البنكي بنجاح',
          accountId: `ACC-${accountSuffix}-${Date.now()}`,
        };
      }),
    { token }
  );
}
