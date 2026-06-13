# Mahaseel

Mahaseel is a frontend web application for an agricultural marketplace. It supports buyer and merchant flows for browsing crops, managing farms/crops, orders, wallets, reviews, and notifications.

When `NEXT_PUBLIC_API_URL` is unset, the app runs in mock API mode. When set to the Railway API, buyer and merchant flows call the backend through typed services and React Query hooks.

## Backend

- **Repository:** https://github.com/AmjadOka/mahaseel.git
- **Production API:** `https://mahaseel-production.up.railway.app/api/v1`
- **Demo guide:** [`DEMO_GUIDE.md`](./DEMO_GUIDE.md)
- **API quick reference:** [`MAHASEEL_API_QUICK_REFERENCE.md`](./MAHASEEL_API_QUICK_REFERENCE.md)

## Tech Stack

- **Framework:** Next.js 16 App Router
- **UI:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Client state:** Zustand (session persistence for auth tokens + user)
- **Data fetching:** TanStack React Query hooks over API services
- **Validation:** Zod for form/API validation where runtime parsing is needed
- **Quality:** ESLint, Prettier, Husky, lint-staged

## Implemented Frontend Flows

- Buyer + merchant auth (email signin/signup, verify-email, password reset)
- Role-aware client route guards for `/customer` and `/merchant` sections
- Buyer: market browse, purchase/bid, orders, Stripe payment redirect, wallet, reviews, notifications
- Merchant: farms/crops CRUD with media upload, orders, delivery tracking, wallet, reviews, notifications
- Mock API fallback for local development without backend services

Admin dashboards are out of scope for this frontend repository.

## Getting Started

### Prerequisites

Use Node.js 20+ and npm.

### Installation

```bash
npm install
```

### Environment Setup

Create local environment variables from the example file:

```bash
cp .env.example .env.local
```

When `NEXT_PUBLIC_API_URL` is unset, mock API mode is used. To call the Railway backend:

```env
NEXT_PUBLIC_API_URL=https://mahaseel-production.up.railway.app/api/v1
```

Include `/api/v1` in the URL. Do not add a trailing slash.

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev`: Start the Next.js development server.
- `npm run build`: Create a production build.
- `npm run start`: Start the production server after building.
- `npm run lint`: Run ESLint and Prettier checks.
- `npm run test`: Run unit tests (mappers + API mock flows).
- `npm run format`: Format the repository with Prettier.

Before opening a PR, run:

```bash
npm run lint
npx tsc --noEmit
npm run test
npm run build
```

## Project Structure

- `src/app`: App Router routes and layouts.
- `src/app/(auth)`: Authentication route group for public auth pages.
- `src/app/customer`: Buyer routes protected by buyer role guards.
- `src/app/merchant`: Merchant routes protected by merchant role guards.
- `src/components/ui`: Shared UI primitives.
- `src/components/merchant`: Merchant-specific cards, forms, icons, and extracted form field groups.
- `src/components/providers`: Global client providers.
- `src/lib`: API client, auth store, guards, and utility helpers.
- `src/services/api`: Remote/mock API service functions.
- `public/images`: Static UI and product assets.

## Authentication Notes

Auth tokens (`accessToken`, `refreshToken`) and user profile are persisted in Zustand session storage for the current browser session. On load, `useRestoreSession` calls `GET /users/me` when a token exists.

For hardened production deployments, prefer HttpOnly cookies issued by the backend/BFF instead of client-side token storage.

## API Integration

`src/lib/api-client.ts` centralizes remote API calls with envelope unwrapping, unified `ApiError`, multipart upload, and 401 session clearing. If `NEXT_PUBLIC_API_URL` is missing, each service uses its mock fallback.

Buyer catalog uses `GET /market`. Merchant products use `GET /products`. Payments redirect to Stripe via `POST /payments/orders/:id/initiate`.

## Frontend Conventions

- Use `next/image` for rendered images where possible.
- Keep form labels associated with controls through `htmlFor`/`id`.
- Use `aria-invalid` and `aria-describedby` for field errors.
- Avoid clickable `div` controls; use buttons, labels, or native inputs.
- Keep tokens and secrets out of browser storage.
- Keep large pages/components split into focused subcomponents.

## Static Assets

Product image fallbacks live in:

- `public/images/placeholder-crop.png`
- `public/images/crops/cucumber.png`
- `public/images/crops/tomato.png`

Update these assets when replacing mock crop imagery with final product photography.

## Backend Reference

For backend endpoint expectations and payload notes, see [`MAHASEEL_API_QUICK_REFERENCE.md`](./MAHASEEL_API_QUICK_REFERENCE.md).
