// src/services/api/auth.ts

// ─── Shared types ────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  phone: string;
}

// ─── Login ───────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  phone: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

/**
 * Login request.
 * Replace the mock body with:
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(credentials),
 *   });
 *   if (!res.ok) throw new Error((await res.json()).message);
 *   return res.json() as Promise<LoginResponse>;
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.phone === '0597450057' && credentials.password === '123456') {
        resolve({
          token: 'mock-jwt-token-12345',
          user: { id: '1', phone: '0597450057', name: 'Test User' },
        });
      } else {
        reject(new Error('بيانات الدخول غير صحيحة'));
      }
    }, 1500);
  });
}

// ─── Register ────────────────────────────────────────────────────────────────

export interface RegisterCredentials {
  name: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

/**
 * Register a new user.
 *
 * ⚡ To connect to a real backend, replace the body below with:
 *
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(credentials),
 *   });
 *   if (!res.ok) throw new Error((await res.json()).message);
 *   return res.json() as Promise<RegisterResponse>;
 */
export async function register(credentials: RegisterCredentials): Promise<RegisterResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock: reject if phone is already "taken"
      if (credentials.phone === '0500000000') {
        reject(new Error('رقم الهاتف مسجل مسبقاً'));
        return;
      }
      resolve({
        token: 'mock-new-user-token-99999',
        user: {
          id: String(Date.now()),
          phone: credentials.phone,
          name: credentials.name,
        },
      });
    }, 1500);
  });
}

// ─── Verification ────────────────────────────────────────────────────────────

export interface VerifyOtpCredentials {
  phone: string;
  code: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

/**
 * Verify OTP code.
 *
 * ⚡ To connect to a real backend, replace the body below with:
 *
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(credentials),
 *   });
 *   if (!res.ok) throw new Error((await res.json()).message);
 *   return res.json() as Promise<VerifyOtpResponse>;
 */
export async function verifyOtp(credentials: VerifyOtpCredentials): Promise<VerifyOtpResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.code === '123456' || credentials.code === '531000') {
        resolve({
          success: true,
          message: 'تم تفعيل الحساب بنجاح',
          token: 'mock-verified-token',
          user: { id: '1', phone: credentials.phone, name: 'Verified User' },
        });
      } else {
        reject(new Error('رمز التحقق غير صحيح'));
      }
    }, 1500);
  });
}

// ─── Password Recovery ───────────────────────────────────────────────────────

export interface RecoverPasswordCredentials {
  phone: string;
}

export interface RecoverPasswordResponse {
  success: boolean;
  message: string;
}

/**
 * Request password recovery OTP.
 *
 * ⚡ To connect to a real backend, replace the body below with:
 *
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/recover-password`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(credentials),
 *   });
 *   if (!res.ok) throw new Error((await res.json()).message);
 *   return res.json() as Promise<RecoverPasswordResponse>;
 */
export async function recoverPassword(
  credentials: RecoverPasswordCredentials
): Promise<RecoverPasswordResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock: Only fail if phone doesn't exist (say "0599999999" doesn't exist)
      if (credentials.phone === '0599999999') {
        reject(new Error('رقم الهاتف غير مسجل في النظام'));
      } else {
        resolve({
          success: true,
          message: 'تم إرسال رمز التحقق إلى رقم هاتفك',
        });
      }
    }, 1500);
  });
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

/**
 * Reset password.
 *
 * ⚡ To connect to a real backend, replace the body below with:
 *
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(credentials),
 *   });
 *   if (!res.ok) throw new Error((await res.json()).message);
 *   return res.json() as Promise<ResetPasswordResponse>;
 */
export async function resetPassword(
  credentials: ResetPasswordCredentials
): Promise<ResetPasswordResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!credentials.phone || !credentials.password) {
        reject(new Error('بيانات تغيير كلمة المرور غير مكتملة'));
        return;
      }

      resolve({
        success: true,
        message: 'تم تغيير كلمة المرور بنجاح',
      });
    }, 1500);
  });
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

/**
 * Add a bank account.
 *
 * ⚡ To connect to a real backend, replace the body below with:
 *
 *   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bank/add-account`, {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify(credentials),
 *   });
 *   if (!res.ok) throw new Error((await res.json()).message);
 *   return res.json() as Promise<AddBankAccountResponse>;
 */
export async function addBankAccount(
  credentials: AddBankAccountCredentials
): Promise<AddBankAccountResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const accountSuffix = credentials.accountNumber.slice(-4).padStart(4, '0');

      resolve({
        success: true,
        message: 'تم إضافة الحساب البنكي بنجاح',
        accountId: `ACC-${accountSuffix}-${Date.now()}`,
      });
    }, 1500);
  });
}
