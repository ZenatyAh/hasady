// src/app/merchant/orders/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { getIncomingOrders, PurchaseOrder } from '@/services/api/orders';
import { PageHeader } from '@/components/merchant/PageHeader';

export default function PurchaseRequestsPage() {
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'fixed' | 'auction'>('fixed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;

    getIncomingOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.error('Failed to load incoming orders:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isReady, token]);

  if (!isReady) {
    return null;
  }

  const filteredOrders = orders.filter((o) => o.type === activeTab && o.status === 'PENDING');

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      {/* Centered responsive container */}
      <div className="max-w-2xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="طلبات الشراء" backHref="/merchant" />

        {/* Custom Pill Tabs Selector */}
        <div className="flex bg-[#faf8f5] rounded-2xl p-1.5 border border-[#f0ebde]/55">
          <button
            onClick={() => setActiveTab('fixed')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition duration-150 cursor-pointer ${
              activeTab === 'fixed'
                ? 'bg-white text-[#265C38] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            طلبات السعر الثابت
          </button>
          <button
            onClick={() => setActiveTab('auction')}
            className={`flex-1 py-3 text-sm font-bold rounded-xl transition duration-150 cursor-pointer ${
              activeTab === 'auction'
                ? 'bg-white text-[#265C38] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            طلبات البيع بالمزاد
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-gray-400">جاري تحميل الطلبات...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm text-sm text-gray-400 font-medium">
                لا توجد طلبات معلقة حالياً
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-row items-center bg-[#fdfcfa] p-4 rounded-[2rem] border border-[#f0ebde]/45 shadow-sm transition hover:shadow-md gap-4 text-right"
                  >
                    {/* Left content (Details/Info) */}
                    <div className="flex-1 space-y-2.5">
                      <div>
                        <h3 className="text-base font-bold text-[#111111]">{order.cropName}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mt-1 line-clamp-2">
                          {order.description}
                        </p>
                      </div>

                      <div>
                        <Link href={`/merchant/orders/${order.id}`}>
                          <button className="px-5 py-2 bg-[#faf8f5] hover:bg-[#eae6dd] text-[#265C38] text-xs font-bold rounded-xl transition duration-150 cursor-pointer border border-[#f0ebde]/45">
                            مزيد من التفاصيل
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Right content (Image) */}
                    <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-[#f0ebde]/35">
                      <Image src={order.image} alt={order.cropName} fill className="object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
