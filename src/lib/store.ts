'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/services/api/auth';
import type { Role } from '@/lib/api-contracts/users';

export type OtpIntent = 'register' | 'reset';
export type AuthRole = Role;
export type SessionStatus = 'idle' | 'restoring' | 'ready';

export type AuthSessionState = {
  accessToken: string | null;
  refreshToken: string | null;
  token: string | null;
  user: User | null;
  pendingEmail: string | null;
  otpIntent: OtpIntent | null;
  pendingRole: AuthRole | null;
  hasHydrated: boolean;
  sessionStatus: SessionStatus;
  setAuthSession: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  setPendingOtp: (email: string, intent: OtpIntent, role?: AuthRole) => void;
  clearPendingOtp: () => void;
  clearAuthSession: () => void;
  clearAllAuthState: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  setSessionStatus: (sessionStatus: SessionStatus) => void;
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
  sessionStatus: 'idle' as SessionStatus,
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
          sessionStatus: 'ready',
        }),
      setPendingOtp: (email, intent, role) =>
        set({ pendingEmail: email, otpIntent: intent, pendingRole: role ?? null }),
      clearPendingOtp: () => set({ pendingEmail: null, otpIntent: null, pendingRole: null }),
      clearAuthSession: () =>
        set({
          accessToken: null,
          refreshToken: null,
          token: null,
          user: null,
          sessionStatus: 'ready',
        }),
      clearAllAuthState: () =>
        set((state) => ({
          ...initialAuthState,
          hasHydrated: state.hasHydrated,
          sessionStatus: 'ready',
        })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setSessionStatus: (sessionStatus) => set({ sessionStatus }),
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
        if (state?.accessToken && !state.user) {
          state.setSessionStatus('restoring');
        } else {
          state?.setSessionStatus('ready');
        }
      },
    }
  )
);

export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}
