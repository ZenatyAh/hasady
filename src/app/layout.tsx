import type { Metadata } from 'next';
import { Almarai } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

const almarai = Almarai({
  variable: '--font-almarai',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'محاصيل | منصة المنتجات الزراعية',
    template: '%s | محاصيل',
  },
  description:
    'منصة محاصيل الإلكترونية لبيع وشراء المنتجات الزراعية والمحاصيل الطازجة عبر مزادات أو أسعار ثابتة.',
  openGraph: {
    title: 'محاصيل | منصة المنتجات الزراعية',
    description: 'منصة محاصيل الإلكترونية لبيع وشراء المنتجات الزراعية والمحاصيل الطازجة.',
    url: 'https://mahaseel.com',
    siteName: 'محاصيل',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'محاصيل | منصة المنتجات الزراعية',
    description: 'منصة محاصيل الإلكترونية لبيع وشراء المنتجات الزراعية والمحاصيل الطازجة.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className={`${almarai.variable} h-full antialiased`} dir="rtl">
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
