import { test, expect } from '@playwright/test';

test.describe('Landing Page & Navigation E2E', () => {
  test('should render landing page components correctly', async ({ page }) => {
    await page.goto('/');

    // Check header logo text
    await expect(page.locator('header').getByText('محاصيل')).toBeVisible();

    // Check navigation links in header
    await expect(page.locator('header').getByRole('link', { name: 'تسجيل الدخول' })).toBeVisible();
    await expect(page.locator('header').getByRole('link', { name: 'حساب جديد' })).toBeVisible();

    // Check Hero components
    await expect(page.getByRole('heading', { name: /حصادك اليوم، بين يديك/i })).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: 'تسجيل الدخول' }).click();

    // Verify redirected to login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'أهلاً بعودتك!' })).toBeVisible();
  });

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: 'حساب جديد' }).click();

    // Verify redirected to signup/welcome page
    await expect(page).toHaveURL(/\/signup/);
  });
});
