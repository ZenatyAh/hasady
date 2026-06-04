'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/services/api/auth';

export type OtpIntent = 'register' | 'reset';
export type AuthRole = 'BUYER' | 'MERCHANT';

export type AuthSessionState = {
  token: string | null;
  user: User | null;
  pendingPhone: string | null;
  otpIntent: OtpIntent | null;
  pendingRole: AuthRole | null;
  hasHydrated: boolean;
  setAuthSession: (token: string | null, user: User) => void;
  setPendingOtp: (phone: string, intent: OtpIntent, role?: AuthRole) => void;
  clearPendingOtp: () => void;
  clearAuthSession: () => void;
  clearAllAuthState: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

type PersistedAuthState = Pick<
  AuthSessionState,
  'user' | 'pendingPhone' | 'otpIntent' | 'pendingRole'
>;

const initialAuthState = {
  token: null,
  user: null,
  pendingPhone: null,
  otpIntent: null,
  pendingRole: null,
  hasHydrated: false,
};

export const useAuthStore = create<AuthSessionState>()(
  persist<AuthSessionState, [], [], PersistedAuthState>(
    (set) => ({
      ...initialAuthState,
      setAuthSession: (token, user) => set({ token, user }),
      setPendingOtp: (phone, intent, role) =>
        set({ pendingPhone: phone, otpIntent: intent, pendingRole: role ?? null }),
      clearPendingOtp: () => set({ pendingPhone: null, otpIntent: null, pendingRole: null }),
      clearAuthSession: () => set({ token: null, user: null }),
      clearAllAuthState: () =>
        set((state) => ({
          ...initialAuthState,
          hasHydrated: state.hasHydrated,
        })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: 'mahaseel-auth-session',
      // Mock mode only: production auth must use HttpOnly secure cookies managed by the backend/BFF.
      storage: createJSONStorage<PersistedAuthState>(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        pendingPhone: state.pendingPhone,
        otpIntent: state.otpIntent,
        pendingRole: state.pendingRole,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
