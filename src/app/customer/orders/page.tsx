// src/app/customer/orders/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getIncomingOrders, PurchaseOrder } from '@/services/api/orders';
import { useAuthStore } from '@/lib/store';

export default function CustomerOrdersPage() {
  const token = useAuthStore((state) => state.token);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'fixed' | 'auction'>('fixed');

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const data = await getIncomingOrders(token);
        setOrders(data);
      } catch (err) {
        console.error('Failed to load purchase orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [token]);

  const filteredOrders = orders.filter((o) => o.type === activeTab);

  const getStatusLabelAndStyle = (status: PurchaseOrder['status']) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'قيد الانتظار',
          style: 'bg-yellow-50 text-yellow-600 border border-yellow-200/50',
        };
      case 'ACCEPTED':
        return {
          label: 'تم القبول',
          style: 'bg-green-50 text-green-600 border border-green-200/50',
        };
      case 'REJECTED':
        return { label: 'مرفوض', style: 'bg-red-50 text-red-600 border border-red-200/50' };
      default:
        return { label: status, style: 'bg-gray-50 text-gray-600 border border-gray-200/50' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0ebde]/45 pb-4 text-right">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">طلباتي وعروضي</h1>
          <p className="text-xs text-gray-400 mt-1">
            تتبع حالة مشترياتك الفورية وسوماتك في المزادات المفتوحة
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-[#f0ebde]/70 rounded-xl p-1 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('fixed')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'fixed'
                ? 'bg-white text-[#265C38] shadow-sm'
                : 'text-[#666666] hover:text-[#265C38]'
            }`}
          >
            🏷️ طلبات الشراء
          </button>
          <button
            onClick={() => setActiveTab('auction')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'auction'
                ? 'bg-white text-[#265C38] shadow-sm'
                : 'text-[#666666] hover:text-[#265C38]'
            }`}
          >
            ⚖️ العروض المزايدة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="h-10 w-10 border-4 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
          <span className="text-sm text-gray-500 font-bold">جاري تحميل طلباتك...</span>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#fdfcfa] rounded-3xl border border-dashed border-[#f0ebde] p-16 text-center max-w-md mx-auto space-y-3">
          <span className="text-4xl">📦</span>
          <h3 className="text-lg font-bold text-[#111111]">لا توجد طلبات بعد</h3>
          <p className="text-sm text-[#888888]">
            {activeTab === 'fixed'
              ? 'لم تقم بإرسال أي طلبات شراء فورية للمحاصيل حتى الآن.'
              : 'لم تشارك في أي مزاد علني للمحاصيل حتى الآن.'}
          </p>
          <Link href="/customer">
            <button className="bg-[#265C38] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition mt-4 cursor-pointer">
              تصفح المحاصيل الآن
            </button>
          </Link>
        </div>
      ) : (
        /* Order Cards List */
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const statusConfig = getStatusLabelAndStyle(order.status);
            return (
              <div
                key={order.id}
                className="bg-white border border-[#f0ebde]/75 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Details Section */}
                <div className="flex items-center gap-4 text-right w-full md:w-auto">
                  <div className="relative h-20 w-20 bg-[#f4f7f5] rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={order.image || '/images/placeholder-crop.png'}
                      alt={order.cropName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold block">
                      {order.createdAt}
                    </span>
                    <h3 className="text-base font-extrabold text-[#111111]">{order.cropName}</h3>
                    <p className="text-xs text-gray-400 line-clamp-1">{order.description}</p>
                  </div>
                </div>

                {/* Status, Price, and Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t border-[#f0ebde]/30 pt-4 md:border-t-0 md:pt-0">
                  <div className="flex flex-col text-right">
                    <span className="text-[10px] text-gray-400 font-semibold mb-0.5">
                      القيمة المقترحة
                    </span>
                    <span className="text-sm font-extrabold text-[#265C38]">
                      {order.offeredPrice} ريال
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl ${statusConfig.style}`}
                  >
                    {statusConfig.label}
                  </span>

                  <Link href={`/customer/orders/${order.id}`}>
                    <button className="bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer">
                      التفاصيل والتتبع
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
