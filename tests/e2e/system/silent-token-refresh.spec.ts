import { test, expect } from '@playwright/test';

test.describe('Silent Token Refresh Resiliency', () => {
  test('Should intercept 401, refresh token silently, and replay request without logging out', async ({
    page,
  }) => {
    let refreshCalled = false;

    // 1. Mock user profile endpoint to return 401 initially, then 200 after refresh
    await page.route('**/api/v1/users/me', async (route) => {
      if (!refreshCalled) {
        await route.fulfill({ status: 401, body: JSON.stringify({ message: 'Unauthorized' }) });
      } else {
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, data: { id: '123', fullName: 'Test User' } }),
        });
      }
    });

    // 2. Mock the refresh token endpoint
    await page.route('**/api/v1/auth/refresh', async (route) => {
      refreshCalled = true;
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          data: {
            accessToken: 'new_access_token',
            refreshToken: 'new_refresh_token',
          },
        }),
      });
    });

    // We assume the user was already logged in (e.g. state hydrated in storage)
    // To simulate, we inject mock tokens into sessionStorage before navigation
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'mahaseel-auth-session',
        JSON.stringify({
          state: { accessToken: 'old', refreshToken: 'old', hasHydrated: true },
        })
      );
    });

    await page.goto('/');

    // Since the UI will trigger a fetch to /users/me, it should hit the 401, then /refresh, then /users/me again
    // The user should eventually see their name in the header
    await expect(page.getByText('Test User')).toBeVisible({ timeout: 10000 });
    expect(refreshCalled).toBe(true);
  });
});
