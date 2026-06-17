import { logout as logoutApi } from '@/services/api/auth';
import { useAuthStore } from '@/lib/store';

/**
 * Calls the backend logout endpoint then clears the local session.
 * Safe to call even if the API request fails.
 */
export async function logout(): Promise<void> {
  const { accessToken, clearAuthSession } = useAuthStore.getState();

  if (accessToken) {
    try {
      await logoutApi();
    } catch {
      // Clear local session even when the server is unreachable
    }
  }

  clearAuthSession();
}
