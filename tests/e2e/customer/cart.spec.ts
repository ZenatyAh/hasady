import { test, expect } from '@playwright/test';

test.describe('Customer Cart Page E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Inject BUYER auth state before navigating
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'mahaseel-auth-session',
        JSON.stringify({
          state: {
            accessToken: 'mocked_access_token',
            refreshToken: 'mocked_refresh_token',
            token: 'mocked_access_token',
            user: {
              id: 'buyer_1',
              name: 'أحمد المشتري',
              role: 'BUYER',
              email: 'buyer@example.com',
            },
          },
        })
      );
    });

    await page.goto('/customer/cart');
  });

  test('should render default cart items and summary correctly', async ({ page }) => {
    // Check titles
    await expect(page.getByRole('heading', { name: 'سلة المشتريات' })).toBeVisible();

    // Check item 1: طماطم بلدي from مزرعة القصيم
    await expect(page.getByText('طماطم بلدي')).toBeVisible();
    await expect(page.getByText('مزرعة القصيم')).toBeVisible();
    await expect(page.getByText('45 ريال', { exact: true })).toBeVisible();

    // Check item 2: خيار طازج from مزرعة الوفاء
    await expect(page.getByText('خيار طازج')).toBeVisible();
    await expect(page.getByText('مزرعة الوفاء')).toBeVisible();
    await expect(page.getByText('30 ريال', { exact: true })).toBeVisible();

    // Verify initial summary totals: subtotal = 120 (45*2 + 30*1), delivery = 25, total = 145
    await expect(page.getByText('120 ريال', { exact: true })).toBeVisible(); // Subtotal
    await expect(page.getByText('25 ريال', { exact: true })).toBeVisible(); // Delivery Fee
    await expect(page.getByText('145 ريال', { exact: true })).toBeVisible(); // Total
  });

  test('should increase item quantity and update price summary', async ({ page }) => {
    // Find the item "طماطم بلدي" card
    const tomatoCard = page.locator('div.border-border-light', {
      has: page.locator('h3', { hasText: 'طماطم بلدي' }),
    });

    // Click '+' button on tomato card
    await tomatoCard.getByRole('button', { name: '+' }).click();

    // Verify quantity is updated to 3
    await expect(tomatoCard.getByText('3')).toBeVisible();

    // New subtotal: 45 * 3 + 30 = 165. Total: 165 + 25 = 190.
    await expect(page.getByText('165 ريال', { exact: true })).toBeVisible();
    await expect(page.getByText('190 ريال', { exact: true })).toBeVisible();
  });

  test('should decrease item quantity and update price summary', async ({ page }) => {
    const tomatoCard = page.locator('div.border-border-light', {
      has: page.locator('h3', { hasText: 'طماطم بلدي' }),
    });

    // Click '-' button on tomato card
    await tomatoCard.getByRole('button', { name: '-' }).click();

    // Verify quantity is updated to 1
    await expect(tomatoCard.getByText('1')).toBeVisible();

    // New subtotal: 45 * 1 + 30 = 75. Total: 75 + 25 = 100.
    await expect(page.getByText('75 ريال', { exact: true })).toBeVisible();
    await expect(page.getByText('100 ريال', { exact: true })).toBeVisible();
  });

  test('should remove item and update price summary', async ({ page }) => {
    // Click 'إزالة' on cucumber card
    const cucumberCard = page.locator('div.border-border-light', {
      has: page.locator('h3', { hasText: 'خيار طازج' }),
    });
    await cucumberCard.getByRole('button', { name: 'إزالة' }).click();

    // Cucumber card should be gone
    await expect(page.getByText('خيار طازج')).not.toBeVisible();

    // New subtotal: 45 * 2 = 90. Total: 90 + 25 = 115.
    await expect(page.getByText('90 ريال', { exact: true })).toBeVisible();
    await expect(page.getByText('115 ريال', { exact: true })).toBeVisible();
  });

  test('should display empty cart state when all items are removed', async ({ page }) => {
    // Remove both items
    await page.getByRole('button', { name: 'إزالة' }).first().click();
    await page.getByRole('button', { name: 'إزالة' }).first().click();

    // Verify empty state UI renders
    await expect(page.getByText('السلة فارغة')).toBeVisible();
    await expect(page.getByRole('button', { name: 'تصفح المحاصيل' })).toBeVisible();
  });
});
