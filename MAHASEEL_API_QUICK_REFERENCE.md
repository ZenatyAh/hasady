# Mahaseel — API Quick Reference

> All endpoints require `Authorization: Bearer <token>` unless marked **Public**.
> Base URL prefix: `/api/v1`

---

## Table of Contents

- [Authentication & Guards](#authentication--guards)
- [Users](#users)
- [Notifications](#notifications)
- [Orders](#orders)
- [Payments](#payments)
- [Products](#products)
- [Auctions](#auctions)
- [Ratings](#ratings)
- [Farms](#farms)
- [Wallet](#wallet)
- [Bank Accounts](#bank-accounts)
- [Categories](#categories)
- [Admin — Dashboard](#admin--dashboard)
- [Admin — Users](#admin--users)
- [Admin — Farms](#admin--farms)
- [Admin — Products](#admin--products)
- [Admin — Orders](#admin--orders)
- [Admin — Withdrawals](#admin--withdrawals)
- [Admin — Reports](#admin--reports)
- [Admin — Notifications](#admin--notifications)
- [Admin — Audit Log](#admin--audit-log)

---

## Authentication & Guards

| Guard          | Description                                        |
| -------------- | -------------------------------------------------- |
| `JwtAuthGuard` | Validates JWT; populates `CurrentUser`             |
| `RolesGuard`   | Enforces `@Roles(Role.BUYER \| MERCHANT \| ADMIN)` |
| `AdminGuard`   | Shorthand for admin-only routes                    |

**Roles:** `BUYER` · `MERCHANT` · `ADMIN`

---

## Users

Base path: `/users`

| Method   | Path                            | Auth                          | Description                                                     |
| -------- | ------------------------------- | ----------------------------- | --------------------------------------------------------------- |
| `GET`    | `/users/:id/profile`            | Public                        | Public profile (safe fields only)                               |
| `GET`    | `/users/:id/stats`              | Public                        | Order counts & rating summary                                   |
| `GET`    | `/users/me`                     | JWT                           | Full profile of authenticated user                              |
| `PATCH`  | `/users/me`                     | JWT                           | Update `fullName` / `bio`                                       |
| `PATCH`  | `/users/me/avatar`              | JWT                           | Upload or replace avatar (`multipart/form-data`, field: `file`) |
| `DELETE` | `/users/me/avatar`              | JWT                           | Remove avatar                                                   |
| `Patch`  | `/users/me/promote-to-merchant` | request promotion to merchant |

---

## Notifications

Base path: `/notifications`

| Method  | Path                          | Auth | Description                                     |
| ------- | ----------------------------- | ---- | ----------------------------------------------- |
| `GET`   | `/notifications/stream`       | JWT  | **SSE** — live notification stream (keep-alive) |
| `GET`   | `/notifications`              | JWT  | All notifications (paginated, `?page&limit`)    |
| `GET`   | `/notifications/unread`       | JWT  | Unread notifications list                       |
| `GET`   | `/notifications/unread/count` | JWT  | Unread count (badge)                            |
| `PATCH` | `/notifications/:id/read`     | JWT  | Mark one notification as read                   |
| `PATCH` | `/notifications/read-all`     | JWT  | Mark all notifications as read                  |

**SSE Client Example:**

```js
const es = new EventSource('/notifications/stream', { withCredentials: true });
es.onmessage = (e) => {
  const { count, title, body, titleAr, type } = JSON.parse(e.data);
  updateBadge(count);
};
```

---

## Orders

Base path: `/orders`

| Method   | Path                  | Role             | Description                           |
| -------- | --------------------- | ---------------- | ------------------------------------- |
| `POST`   | `/orders`             | BUYER            | Place a fixed-price purchase request  |
| `GET`    | `/orders/my`          | BUYER            | List buyer's own orders               |
| `DELETE` | `/orders/:id/cancel`  | BUYER            | Cancel a pending order                |
| `PUT`    | `/orders/:id/confirm` | BUYER            | Confirm delivery completion           |
| `GET`    | `/orders/incoming`    | MERCHANT         | List incoming orders                  |
| `PUT`    | `/orders/:id/accept`  | MERCHANT         | Accept an order (reveals buyer phone) |
| `PUT`    | `/orders/:id/reject`  | MERCHANT         | Reject an order (`body: { reason }`)  |
| `PUT`    | `/orders/:id/status`  | MERCHANT         | Update delivery status                |
| `GET`    | `/orders/:id`         | BUYER / MERCHANT | Get single order detail               |

---

## Payments

Base path: `/payments`

| Method | Path                                 | Role       | Description                                 |
| ------ | ------------------------------------ | ---------- | ------------------------------------------- |
| `GET`  | `/payments`                          | BUYER      | List buyer payments                         |
| `GET`  | `/payments/:id`                      | JWT        | Payment detail                              |
| `POST` | `/payments/orders/:orderId/initiate` | BUYER      | Initiate Moyasar payment for accepted order |
| `POST` | `/payments/webhook`                  | **Public** | Payment gateway webhook (raw body)          |

---

## Products

Base path: `/products` — all routes require `MERCHANT` role

| Method   | Path                           | Description                                                          |
| -------- | ------------------------------ | -------------------------------------------------------------------- |
| `GET`    | `/products`                    | List own products (`?status=...`)                                    |
| `POST`   | `/products`                    | Create a product listing                                             |
| `GET`    | `/products/:id`                | Product detail (merchant view)                                       |
| `PATCH`  | `/products/:id`                | Update product                                                       |
| `DELETE` | `/products/:id`                | Soft-delete product                                                  |
| `PATCH`  | `/products/:id/relist`         | Re-list a sold or expired product                                    |
| `PATCH`  | `/products/:id/media`          | Upload media files (`multipart/form-data`, field: `files[]`, max 10) |
| `DELETE` | `/products/:id/media/:mediaId` | Delete a product media item                                          |

---

## Auctions

### Buyer — `/auctions/bids` (Role: BUYER)

| Method   | Path                    | Description                      |
| -------- | ----------------------- | -------------------------------- |
| `POST`   | `/auctions/bids`        | Place a bid on an active auction |
| `GET`    | `/auctions/bids/mine`   | List my active bids              |
| `DELETE` | `/auctions/bids/:bidId` | Withdraw a bid                   |

### Merchant — `/auctions/merchant` (Role: MERCHANT)

| Method   | Path                                          | Description                                                                 |
| -------- | --------------------------------------------- | --------------------------------------------------------------------------- |
| `GET`    | `/auctions/merchant/products/:productId/bids` | List all bids on a product (highest first)                                  |
| `POST`   | `/auctions/merchant/bids/:bidId/accept`       | Accept a bid (closes auction, credits wallet)                               |
| `PUT`    | `/auctions/merchant/:productId/image`         | Upload / replace auction cover image (`multipart/form-data`, field: `file`) |
| `DELETE` | `/auctions/merchant/:productId/image`         | Remove auction cover image                                                  |

---

## Ratings

Base path: `/ratings`

| Method  | Path                           | Role  | Description                                  |
| ------- | ------------------------------ | ----- | -------------------------------------------- |
| `POST`  | `/ratings`                     | JWT   | Submit rating for a completed order          |
| `PATCH` | `/ratings/:id`                 | JWT   | Edit a rating you submitted                  |
| `GET`   | `/ratings/me`                  | JWT   | Ratings I received                           |
| `GET`   | `/ratings/given`               | JWT   | Ratings I submitted                          |
| `GET`   | `/ratings/:id`                 | JWT   | Get single rating                            |
| `GET`   | `/ratings/user/:userId`        | JWT   | Public ratings for any user / merchant       |
| `POST`  | `/ratings/:id/flag`            | JWT   | Flag an abusive rating (reviewed party only) |
| `GET`   | `/ratings/admin/ratings`       | ADMIN | List all ratings                             |
| `GET`   | `/ratings/admin/flags`         | ADMIN | List flags (`?status=...`)                   |
| `PATCH` | `/ratings/admin/flags/:flagId` | ADMIN | Dismiss or remove a flagged rating           |

---

## Farms

Base path: `/farms` — all routes require `MERCHANT` role

| Method   | Path                        | Description                                                                 |
| -------- | --------------------------- | --------------------------------------------------------------------------- |
| `POST`   | `/farms`                    | Create a farm                                                               |
| `GET`    | `/farms`                    | List own farms                                                              |
| `GET`    | `/farms/:id`                | Farm detail                                                                 |
| `PUT`    | `/farms/:id`                | Update farm                                                                 |
| `PATCH`  | `/farms/:id/media`          | Upload farm images/videos (`multipart/form-data`, field: `files[]`, max 10) |
| `DELETE` | `/farms/:id/media/:mediaId` | Delete a farm media item                                                    |

---

## Wallet

Base path: `/wallet` — requires `MERCHANT` role

| Method | Path                   | Description                     |
| ------ | ---------------------- | ------------------------------- |
| `GET`  | `/wallet`              | Wallet summary (balance, etc.)  |
| `GET`  | `/wallet/transactions` | Transaction history (paginated) |
| `POST` | `/wallet/withdraw`     | Request a withdrawal            |
| `GET`  | `/wallet/withdrawals`  | List own withdrawal requests    |

---

## Bank Accounts

Base path: `/bank-accounts`

### Merchant Routes (Role: MERCHANT)

| Method   | Path                         | Description            |
| -------- | ---------------------------- | ---------------------- |
| `GET`    | `/bank-accounts`             | List my bank accounts  |
| `POST`   | `/bank-accounts`             | Add a bank account     |
| `PATCH`  | `/bank-accounts/:id`         | Update a bank account  |
| `PATCH`  | `/bank-accounts/:id/default` | Set as default account |
| `DELETE` | `/bank-accounts/:id`         | Remove a bank account  |

### Admin Routes (Role: ADMIN)

| Method | Path                                | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| `GET`  | `/bank-accounts/admin/user/:userId` | Get bank accounts for a merchant |

---

## Categories

### Public — `/categories` (JWT required)

| Method | Path              | Description                                |
| ------ | ----------------- | ------------------------------------------ |
| `GET`  | `/categories`     | List all categories (`?parentId&isActive`) |
| `GET`  | `/categories/:id` | Single category with parent + children     |

### Admin — `/admin/categories` (Role: ADMIN)

| Method   | Path                           | Description                                                           |
| -------- | ------------------------------ | --------------------------------------------------------------------- |
| `POST`   | `/admin/categories`            | Create a category                                                     |
| `PATCH`  | `/admin/categories/:id`        | Update name, slug, sortOrder, isActive, parentId                      |
| `PATCH`  | `/admin/categories/:id/icon`   | Upload / replace category icon (`multipart/form-data`, field: `icon`) |
| `DELETE` | `/admin/categories/:id/icon`   | Remove category icon                                                  |
| `PATCH`  | `/admin/categories/:id/toggle` | Toggle `isActive` flag                                                |
| `DELETE` | `/admin/categories/:id`        | Hard-delete category                                                  |

---

## Admin — Dashboard

Base path: `/admin/dashboard`

| Method | Path               | Description                  |
| ------ | ------------------ | ---------------------------- |
| `GET`  | `/admin/dashboard` | Live platform stats snapshot |

---

## Admin — Users

Base path: `/admin/users`

| Method | Path                         | Description                                                |
| ------ | ---------------------------- | ---------------------------------------------------------- |
| `GET`  | `/admin/users`               | List all users (`?role=BUYER\|MERCHANT\|ADMIN`, paginated) |
| `GET`  | `/admin/users/stats`         | User counts grouped by role & status                       |
| `GET`  | `/admin/users/:id`           | Full user profile with relations                           |
| `PUT`  | `/admin/users/:id/suspend`   | Suspend account (notifies user)                            |
| `PUT`  | `/admin/users/:id/reinstate` | Reinstate suspended account (notifies user)                |
| `put`  | `/admin/:id/make-merchant`   | Promote user to merchant role                              |
| `put`  | `/admin/:id/reject-merchant` | Reject user promotion                                      |

---

## Admin — Farms

Base path: `/admin/farms`

| Method   | Path                         | Description                                  |
| -------- | ---------------------------- | -------------------------------------------- |
| `GET`    | `/admin/farms`               | List all farms (`?status&search`, paginated) |
| `GET`    | `/admin/farms/pending`       | List farms awaiting approval                 |
| `GET`    | `/admin/farms/stats`         | Farm counts by status                        |
| `GET`    | `/admin/farms/:id`           | Single farm with full relations              |
| `PUT`    | `/admin/farms/:id/approve`   | Approve farm (notifies owner)                |
| `PUT`    | `/admin/farms/:id/reject`    | Reject farm with reason (notifies owner)     |
| `PUT`    | `/admin/farms/:id/suspend`   | Suspend approved farm (notifies owner)       |
| `PUT`    | `/admin/farms/:id/unsuspend` | Lift suspension (notifies owner)             |
| `DELETE` | `/admin/farms/:id`           | Hard-delete farm record (irreversible)       |

---

## Admin — Products

Base path: `/admin/products`

| Method | Path                             | Description                                         |
| ------ | -------------------------------- | --------------------------------------------------- |
| `GET`  | `/admin/products`                | List all products (`?status&saleMethod`, paginated) |
| `GET`  | `/admin/products/auctions/live`  | Live auction products                               |
| `GET`  | `/admin/products/stats`          | Product counts by status & sale method              |
| `GET`  | `/admin/products/:id`            | Single product with full relations                  |
| `PUT`  | `/admin/products/:id/deactivate` | Deactivate listing with reason (notifies merchant)  |
| `PUT`  | `/admin/products/:id/reactivate` | Reactivate listing (notifies merchant)              |

---

## Admin — Orders

Base path: `/admin/orders`

| Method | Path                               | Description                                         |
| ------ | ---------------------------------- | --------------------------------------------------- |
| `GET`  | `/admin/orders`                    | List all orders (`?status&from&to`, paginated)      |
| `GET`  | `/admin/orders/disputes`           | Open disputes (AWAITING_PAYMENT > 24h)              |
| `GET`  | `/admin/orders/stats`              | Order counts & revenue by status                    |
| `GET`  | `/admin/orders/:id`                | Full order detail                                   |
| `PUT`  | `/admin/orders/:id/force-cancel`   | Force-cancel disputed order (notifies both parties) |
| `PUT`  | `/admin/orders/:id/force-complete` | Force-complete stuck order (notifies both parties)  |

---

## Admin — Withdrawals

Base path: `/admin/withdrawals`

| Method | Path                            | Description                                 |
| ------ | ------------------------------- | ------------------------------------------- |
| `GET`  | `/admin/withdrawals`            | List all withdrawals (`?status`, paginated) |
| `GET`  | `/admin/withdrawals/pending`    | Pending withdrawal requests                 |
| `GET`  | `/admin/withdrawals/stats`      | Counts & amounts by status                  |
| `GET`  | `/admin/withdrawals/:id`        | Single withdrawal detail                    |
| `PUT`  | `/admin/withdrawals/:id/accept` | Approve a withdrawal                        |
| `PUT`  | `/admin/withdrawals/:id/reject` | Reject a withdrawal                         |

---

## Admin — Reports

Base path: `/admin/reports`

| Method | Path                               | Description                                   |
| ------ | ---------------------------------- | --------------------------------------------- |
| `GET`  | `/admin/reports/revenue`           | Daily revenue (`?from&to`)                    |
| `GET`  | `/admin/reports/revenue/monthly`   | Monthly summary (`?year=2025`)                |
| `GET`  | `/admin/reports/merchants/top`     | Top merchants by revenue (`?from&to&limit`)   |
| `GET`  | `/admin/reports/revenue/breakdown` | Fixed-price vs auction breakdown (`?from&to`) |

---

## Admin — Notifications

Base path: `/admin/notifications`

| Method | Path                             | Description                                      |
| ------ | -------------------------------- | ------------------------------------------------ |
| `POST` | `/admin/notifications/broadcast` | Broadcast to specific users, a role, or everyone |

---

## Admin — Audit Log

Base path: `/admin/audit`

| Method | Path                                     | Description                                        |
| ------ | ---------------------------------------- | -------------------------------------------------- |
| `GET`  | `/admin/audit`                           | Paginated log (`?adminId&resource&action&from&to`) |
| `GET`  | `/admin/audit/:resourceType/:resourceId` | Full history for a specific resource               |

---

## Common Query Parameters

| Parameter | Type                         | Used In                              |
| --------- | ---------------------------- | ------------------------------------ |
| `page`    | `number`                     | Any paginated endpoint               |
| `limit`   | `number`                     | Any paginated endpoint               |
| `from`    | `ISO date`                   | Orders, Reports, Audit               |
| `to`      | `ISO date`                   | Orders, Reports, Audit               |
| `status`  | `enum`                       | Orders, Products, Withdrawals, Farms |
| `role`    | `BUYER \| MERCHANT \| ADMIN` | Admin Users                          |

---

## File Upload Notes

All file uploads use `multipart/form-data`. Files are validated before processing.

| Resource      | Field   | Max      |
| ------------- | ------- | -------- |
| User avatar   | `file`  | 1 file   |
| Product media | `files` | 10 files |
| Farm media    | `files` | 10 files |
| Category icon | `icon`  | 1 file   |
| Auction image | `file`  | 1 file   |
