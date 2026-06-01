# Mahaseel

Mahaseel is a comprehensive agricultural e-commerce platform that connects buyers with merchants (farmers). It facilitates the buying and selling of agricultural products through fixed-price listings and live auctions.

## 🚀 Tech Stack

This project is built using modern web technologies to ensure a high-performance, responsive, and scalable user experience:

- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Form Validation:** [Zod](https://zod.dev/)

## ✨ Key Features

The application supports three primary user roles: **Buyer**, **Merchant**, and **Admin**.

- **Authentication & Authorization:** Secure JWT-based authentication with role-based access control (`Buyer`, `Merchant`, `Admin`).
- **Product Management:** Merchants can manage farms and list products for sale with media uploads.
- **Auctions & Bidding:** Live auction system where buyers can place bids, and merchants can accept the highest bids.
- **Order Processing:** End-to-end order flow from placement to delivery confirmation.
- **Payments & Wallet:** Integrated payment processing (via Moyasar webhook support), merchant wallets, and withdrawal management.
- **Real-time Notifications:** Server-Sent Events (SSE) for live, instant notification delivery.
- **Ratings & Reviews:** Buyers can rate their completed orders, ensuring trust within the marketplace.
- **Admin Dashboard:** Comprehensive administration tools to oversee users, farms, products, disputes, and platform analytics.

## 🛠 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v20+ recommended) and `npm` installed.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd hasady
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

### Environment Setup

Create a `.env.local` file in the root directory by copying the example file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your local backend configuration:
```env
# Base URL for the Mahaseel backend (no trailing slash).
# When unset, the app uses built-in mock API responses for local development.
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Running the Application

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## 📜 Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server (requires a build first).
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run format`: Formats the codebase using Prettier.

## 🏗 Project Structure

- `src/app`: Contains the Next.js App Router pages and layouts for different user flows (e.g., `/customer`, `/merchant`, `/signup`).
- `src/components`: Reusable UI components used throughout the application.
- `public`: Static assets like images and icons.

## 🔌 API Integration

The frontend connects to the Mahaseel backend API. For detailed information about available endpoints, authentication rules, and payload structures, please refer to the [`MAHASEEL_API_QUICK_REFERENCE.md`](./MAHASEEL_API_QUICK_REFERENCE.md) file included in the repository.
