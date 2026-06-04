# Mahaseel

Mahaseel is a frontend web application for an agricultural marketplace. It supports buyer and merchant flows for browsing crops, managing farms/crops, mock purchase orders, wallets, reviews, and notifications.

The backend is not connected by default. When `NEXT_PUBLIC_API_URL` is not set, the app runs in mock API mode and stores demo data in browser session storage.

## Tech Stack

- **Framework:** Next.js 16 App Router
- **UI:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Client state:** Zustand
- **Server/cache provider:** TanStack React Query provider is configured for future remote data usage
- **Validation:** Zod for form/API validation where runtime parsing is needed
- **Quality:** ESLint, Prettier, Husky, lint-staged

## Implemented Frontend Flows

- Buyer authentication mock flow: signup, login, OTP confirmation, reset password.
- Merchant authentication mock flow: signup, login, OTP confirmation.
- Role-aware client route guards for `/customer` and `/merchant` sections.
- Buyer crop browsing, crop detail, fixed purchase, auction bid, orders, wallet, reviews, notifications, and profile pages.
- Merchant dashboard, farms, crops, orders, wallet, reviews, notifications, and profile pages.
- Mock API fallback for local development without backend services.

Admin dashboards, production payment callbacks, real-time SSE, and backend-enforced authentication are not implemented in this frontend repository.

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

When `NEXT_PUBLIC_API_URL` is unset, mock API mode is used. To call a backend, set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Do not include a trailing slash.

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
- `npm run format`: Format the repository with Prettier.

Before opening a PR, run:

```bash
npm run lint
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

This frontend intentionally treats the current token flow as mock-only. The Zustand store keeps the mock token in memory for the current session and persists only non-sensitive mock state such as the user profile and pending OTP metadata.

For production authentication, the backend or BFF should issue HttpOnly, Secure, SameSite cookies. Production tokens must not be stored in `localStorage` or `sessionStorage`.

## API Integration

`src/lib/api-client.ts` centralizes remote API calls. If `NEXT_PUBLIC_API_URL` is missing, each service uses its mock fallback. Remote responses can be validated with an optional Zod schema through the API client options.

Mock data is stored in `sessionStorage` under feature-specific keys such as crops, farms, orders, wallet, and reviews. This is for local development only.

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
