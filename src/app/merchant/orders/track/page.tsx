// src/app/merchant/orders/track/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { PageHeader } from '@/components/merchant/PageHeader';

export interface TrackOrder {
  id: string;
  cropName: string;
  description: string;
  date: string;
  status: 'PREPARING' | 'IN_TRANSIT' | 'READY' | 'DELIVERED';
}

const DEFAULT_TRACK_ORDERS: TrackOrder[] = [
  {
    id: 'track-1',
    cropName: 'خيار بلدي',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    date: '14-09-2025',
    status: 'DELIVERED',
  },
  {
    id: 'track-2',
    cropName: 'خيار بلدي',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    date: '14-09-2025',
    status: 'READY',
  },
  {
    id: 'track-3',
    cropName: 'خيار بلدي',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    date: '14-09-2025',
    status: 'IN_TRANSIT',
  },
  {
    id: 'track-4',
    cropName: 'خيار بلدي',
    description: 'خيار طازج مزروع في بيوت بلاستيكية، جاهز للاستهلاك، بجودة ممتازة',
    date: '14-09-2025',
    status: 'PREPARING',
  },
];

export default function OrderTrackingPage() {
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);

  const [orders, setOrders] = useState<TrackOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('hasady-track-orders');
      if (stored) {
        try {
          return JSON.parse(stored) as TrackOrder[];
        } catch {
          return DEFAULT_TRACK_ORDERS;
        }
      } else {
        sessionStorage.setItem('hasady-track-orders', JSON.stringify(DEFAULT_TRACK_ORDERS));
        return DEFAULT_TRACK_ORDERS;
      }
    }
    return DEFAULT_TRACK_ORDERS;
  });
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TrackOrder | null>(null);
  const [newStatus, setNewStatus] = useState<TrackOrder['status']>('PREPARING');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Handled in state initializer
  }, []);

  const saveOrders = (updated: TrackOrder[]) => {
    setOrders(updated);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasady-track-orders', JSON.stringify(updated));
    }
  };

  const openStatusModal = (order: TrackOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsModalOpen(true);
  };

  const handleStatusChange = () => {
    if (!selectedOrder) return;
    const updated = orders.map((o) => {
      if (o.id === selectedOrder.id) {
        return { ...o, status: newStatus };
      }
      return o;
    });
    saveOrders(updated);
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (!isReady) {
    return null;
  }

  const getStatusConfig = (status: TrackOrder['status']) => {
    switch (status) {
      case 'DELIVERED':
        return {
          text: 'تم الإستلام',
          badgeClass: 'bg-[#d1fae5] text-[#065f46]',
        };
      case 'READY':
        return {
          text: 'جاهز للاستلام',
          badgeClass: 'bg-[#ede9fe] text-[#5b21b6]',
        };
      case 'IN_TRANSIT':
        return {
          text: 'قيد التوصيل',
          badgeClass: 'bg-[#dbeafe] text-[#1e40af]',
        };
      case 'PREPARING':
        return {
          text: 'قيد التجهيز',
          badgeClass: 'bg-[#fef3c7] text-[#854d0e]',
        };
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-2xl mx-auto w-full flex flex-col space-y-6">
        {/* Header */}
        <PageHeader title="متابعة الطلبات" backHref="/merchant" />

        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-gray-400">جاري تحميل الحالات...</span>
          </div>
        ) : (
          <div className="bg-[#fdfcfa] p-5 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
            <div className="border-b border-[#f0ebde]/55 pb-3">
              <h2 className="text-base font-bold text-[#111111]">قائمة الطلبات</h2>
            </div>

            <div className="space-y-4">
              {orders.map((order) => {
                const config = getStatusConfig(order.status);
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-[#faf8f5]/65 border border-[#e0e0e0] flex flex-col gap-4 text-right"
                  >
                    {/* Top Row: Crop Details & Status Badge */}
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Status Badge */}
                      <span
                        className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 ${config.badgeClass}`}
                      >
                        {config.text}
                      </span>

                      {/* Right: Crop Text */}
                      <div className="flex-1 space-y-1">
                        <h3 className="text-sm font-bold text-[#111111]">{order.cropName}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                          {order.description}
                        </p>
                        <span className="text-[10px] text-gray-400 font-mono block mt-1">
                          {order.date}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Action Button (only if not DELIVERED) */}
                    {order.status !== 'DELIVERED' && (
                      <div className="border-t border-[#e0e0e0]/55 pt-3 flex justify-end">
                        <button
                          type="button"
                          onClick={() => openStatusModal(order)}
                          className="w-full py-2.5 bg-[#265C38] hover:bg-[#1f4f2c] text-white text-xs font-bold rounded-xl transition duration-150 cursor-pointer text-center"
                        >
                          تغيير الحالة
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Change Status Modal */}
      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
          dir="rtl"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-[#fdfcfa] p-6 shadow-xl border border-[#f0ebde]/45 text-right space-y-5 animate-in fade-in zoom-in duration-200">
            {/* Title */}
            <div className="text-center pb-2 border-b border-[#f0ebde]/55">
              <h3 className="text-lg font-bold text-[#265C38]">تغيير حالة الطلب</h3>
            </div>

            {/* Selector field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">حالة الطلب</label>
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TrackOrder['status'])}
                  className="w-full appearance-none rounded-xl border border-[#e0e0e0] bg-white p-3 text-sm text-[#333333] outline-none transition focus:border-[#265C38] pr-4 pl-10 cursor-pointer"
                >
                  <option value="PREPARING">قيد التجهيز</option>
                  <option value="IN_TRANSIT">قيد التوصيل</option>
                  <option value="READY">جاهز للاستلام</option>
                  <option value="DELIVERED">تم الإستلام</option>
                </select>
                {/* Arrow down icon */}
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex gap-4 pt-2 border-t border-[#f0ebde]/55">
              {/* Confirm Button (Left) */}
              <button
                type="button"
                onClick={handleStatusChange}
                className="flex-1 py-3.5 bg-[#265C38] hover:bg-[#1f4f2c] text-white font-bold rounded-2xl transition duration-150 cursor-pointer text-center text-sm"
              >
                تغيير الحالة
              </button>

              {/* Cancel Button (Right) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 bg-[#fbebe8] hover:bg-[#f7d6d0] text-[#d32f2f] font-bold rounded-2xl transition duration-150 cursor-pointer text-center text-sm"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
