import { test, expect } from '@playwright/test';

test.describe('Customer Checkout Flow E2E', () => {
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

    await page.goto('/customer/checkout');
  });

  test('should render address details and default payment fields', async ({ page }) => {
    // Check main title
    await expect(
      page.getByRole('heading', { name: 'إإتمام الطلب' }).or(page.getByText('إتمام الطلب'))
    ).toBeVisible();

    // Verify Address Inputs are visible
    await expect(page.getByLabel('المدينة')).toBeVisible();
    await expect(page.getByLabel('الحي')).toBeVisible();
    await expect(page.getByLabel('الشارع ورقم المبنى')).toBeVisible();

    // By default CARD payment method should be active and card fields visible
    await expect(page.getByLabel('رقم البطاقة')).toBeVisible();
    await expect(page.getByLabel('تاريخ الانتهاء')).toBeVisible();
    await expect(page.getByLabel('رمز التحقق (CVV)')).toBeVisible();
  });

  test('should toggle payment methods and show/hide credit card fields', async ({ page }) => {
    // Select cash on delivery 'الدفع عند الاستلام'
    await page.getByText('الدفع عند الاستلام').click();

    // Verify credit card inputs are hidden
    await expect(page.getByLabel('رقم البطاقة')).not.toBeVisible();
    await expect(page.getByLabel('تاريخ الانتهاء')).not.toBeVisible();
    await expect(page.getByLabel('رمز التحقق (CVV)')).not.toBeVisible();

    // Toggle back to card 'البطاقة البنكية'
    await page.getByText('البطاقة البنكية').click();

    // Verify credit card inputs are visible again
    await expect(page.getByLabel('رقم البطاقة')).toBeVisible();
    await expect(page.getByLabel('تاريخ الانتهاء')).toBeVisible();
    await expect(page.getByLabel('رمز التحقق (CVV)')).toBeVisible();
  });

  test('should fill the checkout form and submit successfully', async ({ page }) => {
    // Fill Address
    await page.getByLabel('المدينة').fill('الرياض');
    await page.getByLabel('الحي').fill('الملقا');
    await page.getByLabel('الشارع ورقم المبنى').fill('شارع الملك فهد، مبنى 10');

    // Fill Card Info
    await page.getByLabel('رقم البطاقة').fill('4242 4242 4242 4242');
    await page.getByLabel('تاريخ الانتهاء').fill('12/28');
    await page.getByLabel('رمز التحقق (CVV)').fill('123');

    // Click confirm order button 'تأكيد الطلب'
    await page.getByRole('button', { name: 'تأكيد الطلب' }).click();

    // Verify redirect to tracking page
    await expect(page).toHaveURL(/\/customer\/orders\/track/);
  });
});
