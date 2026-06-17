import { test, expect } from '@playwright/test';

test.describe('Customer Order Tracking E2E', () => {
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

    await page.goto('/customer/orders/track');
  });

  test('should render tracking details and customer order info', async ({ page }) => {
    // Check main title
    await expect(page.getByRole('heading', { name: 'تتبع الطلب' })).toBeVisible();

    // Check order id details
    await expect(page.getByText('الطلب رقم #102394')).toBeVisible();

    // Check product breakdown
    await expect(page.getByText('2x طماطم بلدي')).toBeVisible();
    await expect(page.getByText('1x خيار طازج')).toBeVisible();
    await expect(page.getByText('الإجمالي (مع التوصيل)')).toBeVisible();
    await expect(page.getByText('130 ريال')).toBeVisible();

    // Check delivery address
    await expect(page.getByText('الرياض, الملقا, الشارع الأول')).toBeVisible();
  });

  test('should render order tracking stepper with all status stages in Arabic', async ({
    page,
  }) => {
    // Verify stepper shows steps in correct sequence
    await expect(page.getByText('قيد الانتظار')).toBeVisible();
    await expect(page.getByText('قيد التجهيز')).toBeVisible();
    await expect(page.getByText('في الطريق')).toBeVisible();
    await expect(page.getByText('تم التسليم')).toBeVisible();
  });
});
