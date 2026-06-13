// src/app/merchant/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { getWalletSummary, WalletSummary } from '@/services/api/wallet';
import { DashboardHeader } from '@/components/merchant/DashboardHeader';
import { BalanceCard } from '@/components/merchant/BalanceCard';
import { QuickAccessCard } from '@/components/merchant/QuickAccessCard';
import {
  AddFarmIcon,
  FarmsIcon,
  ManageCropsIcon,
  AddCropIcon,
  PaymentsIcon,
  PurchaseOrdersIcon,
  ReviewsIcon,
  NotificationsIcon,
  TrackOrdersIcon,
} from '@/components/merchant/icons';

export default function MerchantDashboard() {
  const { isReady } = useAuthGuard();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  const [wallet, setWallet] = useState<WalletSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    getWalletSummary(token)
      .then((data) => {
        setWallet(data);
      })
      .catch((err) => {
        console.error('Failed to load wallet summary:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, token]);

  if (!isReady) {
    return null;
  }

  const displayName = user?.name ?? 'مستخدم';
  const displayBalance = wallet?.balance ?? 0;
  const displayCurrency = wallet?.currency ?? 'ريال سعودي';
  const displayLastLogin = new Date().toLocaleDateString('ar-SA');

  const menuItems = [
    {
      title: 'إضافة مزرعة جديدة',
      description: 'قم بإضافة مزرعتك لتبدأ بعرض منتجاتك وبيعها في السوق',
      href: '/merchant/farms/add',
      icon: <AddFarmIcon />,
    },
    {
      title: 'مزارعك المتاحة',
      description: 'استعرض المزارع المسجلة ومنتجاتها ومواقعها بسهولة',
      href: '/merchant/farms',
      icon: <FarmsIcon />,
    },
    {
      title: 'إدارة المحاصيل',
      description: 'تصفح، عدّل، أو احذف محاصيلك بسهولة وتابع حالة منتجاتك في السوق',
      href: '/merchant/crops',
      icon: <ManageCropsIcon />,
    },
    {
      title: 'إضافة محصول جديد',
      description: 'قم بإضافة منتجاتك الزراعية أو الحيوانية وابدأ بعرضها في السوق بكل سهولة',
      href: '/merchant/crops/add',
      icon: <AddCropIcon />,
    },
    {
      title: 'المدفوعات',
      description: 'تابع أرباحك، مجموعاتك، وحالة عمليات البيع والشراء بكل سهولة',
      href: '/merchant/wallet',
      icon: <PaymentsIcon />,
    },
    {
      title: 'طلبات الشراء',
      description: 'تابع جميع الطلبات المقدمة على محاصيلك سواء بسعر ثابت أو من خلال المزايدة',
      href: '/merchant/orders',
      icon: <PurchaseOrdersIcon />,
    },
    {
      title: 'التقييمات',
      description: 'شاهد التقييمات التي تمت كتابتها للبائعين والمشترين',
      href: '/merchant/reviews',
      icon: <ReviewsIcon />,
    },
    {
      title: 'الإشعارات',
      description: 'لا تفوت أي تنبيه أو رسالة مهمة في التطبيق',
      href: '/merchant/notifications',
      icon: <NotificationsIcon />,
    },
    {
      title: 'متابعة الطلبات',
      description: 'متابعة الطلبات النشطة وتغيير حالتها حسب التقدم',
      href: '/merchant/orders/track',
      icon: <TrackOrdersIcon />,
    },
  ];

  return (
    <main
      className="min-h-screen bg-[#faf8f5] w-full flex flex-col items-center justify-start pb-16 px-4 md:px-8 py-6"
      dir="rtl"
    >
      {/* Responsive Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col space-y-6">
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="md:hidden">
          <DashboardHeader userName={displayName} />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2 md:pt-6">
          {/* Side Column (Balance Card) - Stacks on mobile, sits side-by-side on lg screen */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            {loading ? (
              <div className="h-[156px] w-full rounded-[2rem] bg-gray-200 animate-pulse flex items-center justify-center text-gray-400 text-sm font-medium border border-[#f0ebde]/45">
                جاري تحميل الرصيد...
              </div>
            ) : (
              <Link
                href="/merchant/wallet"
                className="block transition transform hover:scale-[1.01] cursor-pointer"
              >
                <BalanceCard
                  balance={displayBalance}
                  currency={displayCurrency}
                  lastLogin={displayLastLogin}
                />
              </Link>
            )}
          </div>

          {/* Main Column (Quick Access Grid) */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#111111] pr-1">الوصول السريع</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-8">
              {menuItems.map((item, index) => (
                <QuickAccessCard
                  key={index}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  icon={item.icon}
                />
              ))}

              {/* Empty slot matching mockup to balance grid layout */}
              <div className="rounded-[1.5rem] bg-white p-6 border border-dashed border-[#f0ebde]/55 flex items-center justify-center opacity-40 min-h-[140px]">
                <span className="text-xs text-[#888888]">قريباً</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
