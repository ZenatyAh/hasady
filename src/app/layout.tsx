import type { Metadata } from 'next';
import { Almarai } from 'next/font/google';
import './globals.css';

const almarai = Almarai({
  variable: '--font-almarai',
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'محاصيل',
  description: 'تطبيق محاصيل — تسجيل الدخول وإدارة الحساب',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" className={`${almarai.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
