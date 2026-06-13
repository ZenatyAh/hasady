# دليل العرض التجريبي — محاصيل

## المتطلبات

- Node.js 20+
- npm

## التشغيل المحلي (Mock Mode)

```bash
npm install
cp .env.example .env.local
# اترك NEXT_PUBLIC_API_URL فارغاً للوضع التجريبي المحلي
npm run dev
```

افتح:

`http://localhost:3000`

## التشغيل مع الباك إند (Railway)

```bash
cp .env.example .env.local
```

ثم عيّن:

```env
NEXT_PUBLIC_API_URL=https://mahaseel-production.up.railway.app/api/v1
```

```bash
npm run dev
```

## روابط الباك إند

- **Repository:** https://github.com/AmjadOka/mahaseel.git
- **API Production:** https://mahaseel-production.up.railway.app/api/v1

## حسابات الاختبار

> استخدم حسابات seed من ريبو الباك إن وُجدت، أو أنشئ حسابات جديدة عبر التسجيل.

| الدور | البريد                        | كلمة المرور | ملاحظات                 |
| ----- | ----------------------------- | ----------- | ----------------------- |
| مشتري | أنشئ عبر `/signup`            | —           | تحقق من البريد برمز OTP |
| تاجر  | أنشئ ثم `promote-to-merchant` | —           | أو سجّل كتاجر من الباك  |

رمز التحقق في الوضع التجريبي المحلي:

`123456` أو `531000`

## مسار العرض (Smoke Test)

### مسار المشتري

1. تسجيل / تسجيل دخول عبر البريد الإلكتروني
2. تصفح السوق من `/customer`
3. فتح محصول وشراء أو مزايدة
4. متابعة الطلبات من `/customer/orders`
5. دفع عبر Stripe عند قبول الطلب
6. تقييم التاجر من `/customer/reviews/rate?orderId=...`

### مسار التاجر

1. تسجيل دخول تاجر
2. إضافة مزرعة من `/merchant/farms/add`
3. إضافة محصول من `/merchant/crops/add`
4. قبول طلب شراء من `/merchant/orders`
5. متابعة التوصيل من `/merchant/orders/track`
6. سحب الأرباح من `/merchant/wallet/withdraw`

### التحقق من الجلسة

- حدّث الصفحة بعد تسجيل الدخول — يجب أن تبقى الجلسة فعّالة (`accessToken` محفوظ في sessionStorage)

## أوامر الجودة

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

## اختبار API مباشرة

```bash
curl -s https://mahaseel-production.up.railway.app/api/v1/health || true
curl -s -X POST https://mahaseel-production.up.railway.app/api/v1/auth/signin \
  -H 'Content-Type: application/json' \
  -d '{"email":"YOUR_EMAIL","password":"YOUR_PASSWORD"}'
```

## ملاحظات التكامل

- المصادقة عبر `Authorization: Bearer <accessToken>`
- كتالوج المشتري: `GET /market`
- منتجات التاجر: `GET /products`
- الدفع: `POST /payments/orders/:orderId/initiate` → إعادة توجيه Stripe
- الحسابات البنكية: `POST /bank-accounts`
