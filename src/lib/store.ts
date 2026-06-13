'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/services/api/auth';

export type OtpIntent = 'register' | 'reset';
export type AuthRole = 'BUYER' | 'MERCHANT';

export type AuthSessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  token: string | null;
  user: User | null;
  pendingEmail: string | null;
  otpIntent: OtpIntent | null;
  pendingRole: AuthRole | null;
  hasHydrated: boolean;
  setAuthSession: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  setPendingOtp: (email: string, intent: OtpIntent, role?: AuthRole) => void;
  clearPendingOtp: () => void;
  clearAuthSession: () => void;
  clearAllAuthState: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

type PersistedAuthState = Pick<
  AuthSessionState,
  'accessToken' | 'refreshToken' | 'token' | 'user' | 'pendingEmail' | 'otpIntent' | 'pendingRole'
>;

const initialAuthState = {
  accessToken: null,
  refreshToken: null,
  token: null,
  user: null,
  pendingEmail: null,
  otpIntent: null,
  pendingRole: null,
  hasHydrated: false,
};

export const useAuthStore = create<AuthSessionState>()(
  persist<AuthSessionState, [], [], PersistedAuthState>(
    (set) => ({
      ...initialAuthState,
      setAuthSession: (tokens, user) =>
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          token: tokens.accessToken,
          user,
        }),
      setPendingOtp: (email, intent, role) =>
        set({ pendingEmail: email, otpIntent: intent, pendingRole: role ?? null }),
      clearPendingOtp: () => set({ pendingEmail: null, otpIntent: null, pendingRole: null }),
      clearAuthSession: () =>
        set({ accessToken: null, refreshToken: null, token: null, user: null }),
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
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        token: state.accessToken,
        user: state.user,
        pendingEmail: state.pendingEmail,
        otpIntent: state.otpIntent,
        pendingRole: state.pendingRole,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
