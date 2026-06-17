import { test, expect } from '@playwright/test';

test.describe('Merchant Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Intercept wallet API request and return mock wallet response
    await page.route('**/api/v1/wallet', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            balance: 5200,
            pendingBalance: 2000,
            withdrawableBalance: 3200,
            currency: 'ريال سعودي',
          },
        }),
      });
    });

    // Inject MERCHANT auth state before navigating
    await page.addInitScript(() => {
      window.sessionStorage.setItem(
        'mahaseel-auth-session',
        JSON.stringify({
          state: {
            accessToken: 'mocked_access_token',
            refreshToken: 'mocked_refresh_token',
            token: 'mocked_access_token',
            user: {
              id: 'merchant_1',
              name: 'سلمان المزارع',
              role: 'MERCHANT',
              email: 'merchant@example.com',
            },
          },
        })
      );
    });

    await page.goto('/merchant');
  });

  test('should render merchant header, wallet balance card, and menu items', async ({ page }) => {
    // Check wallet balance card is loaded (mock is 5200)
    await expect(page.getByText('الرصيد المتاح للسحب')).toBeVisible();
    await expect(page.getByText('5200')).toBeVisible();
    await expect(page.getByText('ريال سعودي')).toBeVisible();

    // Check header and quick access title
    await expect(page.getByRole('heading', { name: 'الوصول السريع' })).toBeVisible();

    // Verify all major menu cards exist
    await expect(page.getByText('إضافة مزرعة جديدة')).toBeVisible();
    await expect(page.getByText('مزارعك المتاحة')).toBeVisible();
    await expect(page.getByText('إدارة المحاصيل')).toBeVisible();
    await expect(page.getByText('إضافة محصول جديد')).toBeVisible();
    await expect(page.getByText('المدفوعات')).toBeVisible();
    await expect(page.getByText('طلبات الشراء')).toBeVisible();
    await expect(page.getByText('التقييمات')).toBeVisible();
    await expect(page.getByText('الإشعارات')).toBeVisible();
  });
});
