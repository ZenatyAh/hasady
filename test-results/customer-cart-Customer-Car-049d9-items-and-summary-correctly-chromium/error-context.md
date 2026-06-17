# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: customer/cart.spec.ts >> Customer Cart Page E2E >> should render default cart items and summary correctly
- Location: tests/e2e/customer/cart.spec.ts:23:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('45 ريال')
Expected: visible
Error: strict mode violation: getByText('45 ريال') resolved to 2 elements:
    1) <span class="text-sm font-extrabold text-primary mt-1">45 ريال</span> aka getByText('45 ريال', { exact: true })
    2) <span class="font-extrabold text-primary">145 ريال</span> aka getByText('145 ريال')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('45 ريال')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
    - generic [ref=e2]:
        - banner [ref=e3]:
            - generic [ref=e4]:
                - generic [ref=e5]:
                    - img "Logo" [ref=e7]
                    - generic [ref=e8]: محاصيل
                    - navigation [ref=e9]:
                        - link "الرئيسية" [ref=e10] [cursor=pointer]:
                            - /url: /customer
                            - img [ref=e11]
                            - generic [ref=e13]: الرئيسية
                        - link "طلباتي" [ref=e14] [cursor=pointer]:
                            - /url: /customer/orders
                            - img [ref=e15]
                            - generic [ref=e17]: طلباتي
                        - link "المحفظة" [ref=e18] [cursor=pointer]:
                            - /url: /customer/wallet
                            - img [ref=e19]
                            - generic [ref=e21]: المحفظة
                        - link "التقييمات" [ref=e22] [cursor=pointer]:
                            - /url: /customer/reviews
                            - img [ref=e23]
                            - generic [ref=e25]: التقييمات
                - generic [ref=e26]:
                    - link [ref=e27] [cursor=pointer]:
                        - /url: /customer/notifications
                        - img [ref=e28]
                    - generic [ref=e30]:
                        - generic [ref=e31]: مرحباً بك
                        - generic [ref=e32]: مشتري محاصيل
                    - link "Avatar" [ref=e33] [cursor=pointer]:
                        - /url: /customer/profile
                        - img "Avatar" [ref=e34]
                    - button "تسجيل الخروج" [ref=e35] [cursor=pointer]
        - main [ref=e36]:
            - generic [ref=e37]:
                - generic [ref=e38]:
                    - heading "سلة المشتريات" [level=1] [ref=e39]
                    - paragraph [ref=e40]: راجع محاصيلك قبل إتمام الطلب، يمكنك تعديل الكميات أو إزالة المنتجات.
                - generic [ref=e41]:
                    - generic [ref=e42]:
                        - generic [ref=e43]:
                            - generic [ref=e44]:
                                - img "طماطم بلدي" [ref=e46]
                                - generic [ref=e47]:
                                    - heading "طماطم بلدي" [level=3] [ref=e48]
                                    - generic [ref=e49]: مزرعة القصيم
                                    - generic [ref=e50]: 45 ريال
                            - generic [ref=e51]:
                                - button "إزالة" [ref=e52]
                                - generic [ref=e53]:
                                    - button "+" [ref=e54]
                                    - generic [ref=e55]: '2'
                                    - button "-" [ref=e56]
                        - generic [ref=e57]:
                            - generic [ref=e58]:
                                - img "خيار طازج" [ref=e60]
                                - generic [ref=e61]:
                                    - heading "خيار طازج" [level=3] [ref=e62]
                                    - generic [ref=e63]: مزرعة الوفاء
                                    - generic [ref=e64]: 30 ريال
                            - generic [ref=e65]:
                                - button "إزالة" [ref=e66]
                                - generic [ref=e67]:
                                    - button "+" [ref=e68]
                                    - generic [ref=e69]: '1'
                                    - button "-" [disabled] [ref=e70]
                    - generic [ref=e72]:
                        - heading "ملخص الطلب" [level=3] [ref=e73]
                        - generic [ref=e74]:
                            - generic [ref=e75]:
                                - generic [ref=e76]: المجموع الفرعي
                                - generic [ref=e77]: 120 ريال
                            - generic [ref=e78]:
                                - generic [ref=e79]: رسوم التوصيل
                                - generic [ref=e80]: 25 ريال
                            - generic [ref=e81]:
                                - generic [ref=e82]: الإجمالي
                                - generic [ref=e83]: 145 ريال
                        - link "متابعة للدفع" [ref=e84] [cursor=pointer]:
                            - /url: /customer/checkout
                            - button "متابعة للدفع" [ref=e85]
    - alert [ref=e86]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test.describe('Customer Cart Page E2E', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Inject BUYER auth state before navigating
  6  |     await page.addInitScript(() => {
  7  |       window.sessionStorage.setItem(
  8  |         'mahaseel-auth-session',
  9  |         JSON.stringify({
  10 |           state: {
  11 |             accessToken: 'mocked_access_token',
  12 |             refreshToken: 'mocked_refresh_token',
  13 |             token: 'mocked_access_token',
  14 |             user: { id: 'buyer_1', fullName: 'أحمد المشتري', role: 'BUYER', email: 'buyer@example.com' },
  15 |           },
  16 |         })
  17 |       );
  18 |     });
  19 |
  20 |     await page.goto('/customer/cart');
  21 |   });
  22 |
  23 |   test('should render default cart items and summary correctly', async ({ page }) => {
  24 |     // Check titles
  25 |     await expect(page.getByRole('heading', { name: 'سلة المشتريات' })).toBeVisible();
  26 |
  27 |     // Check item 1: طماطم بلدي from مزرعة القصيم
  28 |     await expect(page.getByText('طماطم بلدي')).toBeVisible();
  29 |     await expect(page.getByText('مزرعة القصيم')).toBeVisible();
> 30 |     await expect(page.getByText('45 ريال')).toBeVisible();
     |                                             ^ Error: expect(locator).toBeVisible() failed
  31 |
  32 |     // Check item 2: خيار طازج from مزرعة الوفاء
  33 |     await expect(page.getByText('خيار طازج')).toBeVisible();
  34 |     await expect(page.getByText('مزرعة الوفاء')).toBeVisible();
  35 |     await expect(page.getByText('30 ريال')).toBeVisible();
  36 |
  37 |     // Verify initial summary totals: subtotal = 120 (45*2 + 30*1), delivery = 25, total = 145
  38 |     await expect(page.getByText('120 ريال')).toBeVisible(); // Subtotal
  39 |     await expect(page.getByText('25 ريال')).toBeVisible();  // Delivery Fee
  40 |     await expect(page.getByText('145 ريال')).toBeVisible(); // Total
  41 |   });
  42 |
  43 |   test('should increase item quantity and update price summary', async ({ page }) => {
  44 |     // Find the item "طماطم بلدي" card
  45 |     const tomatoCard = page.locator('div.border-border-light', { has: page.locator('h3', { hasText: 'طماطم بلدي' }) });
  46 |
  47 |     // Click '+' button on tomato card
  48 |     await tomatoCard.getByRole('button', { name: '+' }).click();
  49 |
  50 |     // Verify quantity is updated to 3
  51 |     await expect(tomatoCard.getByText('3')).toBeVisible();
  52 |
  53 |     // New subtotal: 45 * 3 + 30 = 165. Total: 165 + 25 = 190.
  54 |     await expect(page.getByText('165 ريال')).toBeVisible();
  55 |     await expect(page.getByText('190 ريال')).toBeVisible();
  56 |   });
  57 |
  58 |   test('should decrease item quantity and update price summary', async ({ page }) => {
  59 |     const tomatoCard = page.locator('div.border-border-light', { has: page.locator('h3', { hasText: 'طماطم بلدي' }) });
  60 |
  61 |     // Click '-' button on tomato card
  62 |     await tomatoCard.getByRole('button', { name: '-' }).click();
  63 |
  64 |     // Verify quantity is updated to 1
  65 |     await expect(tomatoCard.getByText('1')).toBeVisible();
  66 |
  67 |     // New subtotal: 45 * 1 + 30 = 75. Total: 75 + 25 = 100.
  68 |     await expect(page.getByText('75 ريال')).toBeVisible();
  69 |     await expect(page.getByText('100 ريال')).toBeVisible();
  70 |   });
  71 |
  72 |   test('should remove item and update price summary', async ({ page }) => {
  73 |     // Click 'إزالة' on cucumber card
  74 |     const cucumberCard = page.locator('div.border-border-light', { has: page.locator('h3', { hasText: 'خيار طازج' }) });
  75 |     await cucumberCard.getByRole('button', { name: 'إزالة' }).click();
  76 |
  77 |     // Cucumber card should be gone
  78 |     await expect(page.getByText('خيار طازج')).not.toBeVisible();
  79 |
  80 |     // New subtotal: 45 * 2 = 90. Total: 90 + 25 = 115.
  81 |     await expect(page.getByText('90 ريال')).toBeVisible();
  82 |     await expect(page.getByText('115 ريال')).toBeVisible();
  83 |   });
  84 |
  85 |   test('should display empty cart state when all items are removed', async ({ page }) => {
  86 |     // Remove both items
  87 |     await page.getByRole('button', { name: 'إزالة' }).first().click();
  88 |     await page.getByRole('button', { name: 'إزالة' }).first().click();
  89 |
  90 |     // Verify empty state UI renders
  91 |     await expect(page.getByText('السلة فارغة')).toBeVisible();
  92 |     await expect(page.getByRole('button', { name: 'تصفح المحاصيل' })).toBeVisible();
  93 |   });
  94 | });
  95 |
```
