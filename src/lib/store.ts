'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/services/api/auth';

export type OtpIntent = 'register' | 'reset';

export type AuthSessionState = {
  token: string | null;
  user: User | null;
  pendingPhone: string | null;
  otpIntent: OtpIntent | null;
  hasHydrated: boolean;
  setAuthSession: (token: string, user: User) => void;
  setPendingOtp: (phone: string, intent: OtpIntent) => void;
  clearPendingOtp: () => void;
  clearAuthSession: () => void;
  clearAllAuthState: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

type PersistedAuthState = Pick<AuthSessionState, 'token' | 'user' | 'pendingPhone' | 'otpIntent'>;

const initialAuthState = {
  token: null,
  user: null,
  pendingPhone: null,
  otpIntent: null,
  hasHydrated: false,
};

export const useAuthStore = create<AuthSessionState>()(
  persist<AuthSessionState, [], [], PersistedAuthState>(
    (set) => ({
      ...initialAuthState,
      setAuthSession: (token, user) => set({ token, user }),
      setPendingOtp: (phone, intent) => set({ pendingPhone: phone, otpIntent: intent }),
      clearPendingOtp: () => set({ pendingPhone: null, otpIntent: null }),
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
      storage: createJSONStorage<PersistedAuthState>(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        pendingPhone: state.pendingPhone,
        otpIntent: state.otpIntent,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
