import { test, expect } from '@playwright/test';

test.describe('Login Flow E2E', () => {
  test('Happy Path: Valid credentials login', async ({ page }) => {
    // Mock the backend response to simulate a successful login
    await page.route('**/api/v1/auth/signin', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          accessToken: 'mocked_access',
          refreshToken: 'mocked_refresh',
          user: { id: '1', role: 'MERCHANT', fullName: 'Mock Merchant' },
        }),
      });
    });

    await page.goto('/login');
    await page.getByRole('button', { name: 'تاجر (مزارع)' }).click(); // Select merchant role
    await page.getByPlaceholder('user@example.com').fill('merchant@example.com');
    await page.getByPlaceholder('**************').fill('Password123!');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    // Wait for redirect to merchant dashboard
    await expect(page).toHaveURL(/\/merchant/);
  });

  test('Edge Case: Empty submission validation', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    // Zod errors show up in the DOM
    await expect(page.getByText('مطلوب').first()).toBeVisible(); // 'Required' in Arabic
  });

  test('Resiliency: Backend 401 Unauthorized', async ({ page }) => {
    // Intercept the login API call and force a 401
    await page.route('**/api/v1/auth/signin', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'بيانات الدخول غير صحيحة' }),
      });
    });

    await page.goto('/login');
    await page.getByPlaceholder('user@example.com').fill('wrong@example.com');
    await page.getByPlaceholder('**************').fill('wrongpass');
    await page.getByRole('button', { name: 'تسجيل الدخول' }).click();

    // Expect the UI to catch the error gracefully and show the error returned by backend
    await expect(page.getByText('بيانات الدخول غير صحيحة')).toBeVisible();
  });
});
