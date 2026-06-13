'use client';

import React, { useMemo, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { useIncomingOrders } from '@/hooks/queries';
import { useUpdateOrderStatus } from '@/hooks/mutations';
import { PageHeader } from '@/components/merchant/PageHeader';
import type { PurchaseOrder } from '@/services/api/orders';
import { getErrorMessage } from '@/lib/api-errors';

export type TrackOrderStatus = 'PREPARING' | 'IN_TRANSIT' | 'READY' | 'DELIVERED';

export interface TrackOrder {
  id: string;
  cropName: string;
  description: string;
  date: string;
  status: TrackOrderStatus;
}

function mapDeliveryStatus(order: PurchaseOrder): TrackOrderStatus {
  const status = (order.deliveryStatus ?? order.backendStatus ?? 'PREPARING').toUpperCase();
  if (status === 'DELIVERED' || status === 'COMPLETED') return 'DELIVERED';
  if (status === 'READY' || status === 'READY_FOR_PICKUP') return 'READY';
  if (status === 'IN_TRANSIT' || status === 'SHIPPED') return 'IN_TRANSIT';
  return 'PREPARING';
}

function toTrackOrder(order: PurchaseOrder): TrackOrder {
  return {
    id: order.id,
    cropName: order.cropName,
    description: order.description,
    date: order.createdAt,
    status: mapDeliveryStatus(order),
  };
}

const TRACKABLE_STATUSES = new Set([
  'ACCEPTED',
  'AWAITING_PAYMENT',
  'PAID',
  'IN_DELIVERY',
  'SHIPPED',
]);

export default function OrderTrackingPage() {
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);
  const { data: incomingOrders = [], isLoading, error, refetch } = useIncomingOrders(token);
  const updateStatus = useUpdateOrderStatus(token);

  const orders = useMemo(
    () =>
      incomingOrders
        .filter(
          (order) =>
            order.status === 'ACCEPTED' || TRACKABLE_STATUSES.has(order.backendStatus ?? '')
        )
        .map(toTrackOrder),
    [incomingOrders]
  );

  const [selectedOrder, setSelectedOrder] = useState<TrackOrder | null>(null);
  const [newStatus, setNewStatus] = useState<TrackOrderStatus>('PREPARING');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionError, setActionError] = useState('');

  const openStatusModal = (order: TrackOrder) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setActionError('');
    setIsModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedOrder) return;

    try {
      await updateStatus.mutateAsync({ id: selectedOrder.id, status: newStatus });
      await refetch();
      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      setActionError(getErrorMessage(err));
    }
  };

  if (!isReady) {
    return null;
  }

  const getStatusConfig = (status: TrackOrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return { text: 'تم الإستلام', badgeClass: 'bg-[#d1fae5] text-[#065f46]' };
      case 'READY':
        return { text: 'جاهز للاستلام', badgeClass: 'bg-[#ede9fe] text-[#5b21b6]' };
      case 'IN_TRANSIT':
        return { text: 'قيد التوصيل', badgeClass: 'bg-[#dbeafe] text-[#1e40af]' };
      case 'PREPARING':
        return { text: 'قيد التجهيز', badgeClass: 'bg-[#fef3c7] text-[#854d0e]' };
    }
  };

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-2xl mx-auto w-full flex flex-col space-y-6">
        <PageHeader title="متابعة الطلبات" backHref="/merchant" />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-20 bg-white rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#265C38] border-t-transparent" />
            <span className="text-sm font-medium text-gray-400">جاري تحميل الحالات...</span>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-red-50 p-4 text-center text-xs text-red-600">
            {getErrorMessage(error)}
          </div>
        ) : (
          <div className="bg-[#fdfcfa] p-5 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-6">
            <div className="border-b border-[#f0ebde]/55 pb-3">
              <h2 className="text-base font-bold text-[#111111]">قائمة الطلبات</h2>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400">
                  لا توجد طلبات قابلة للمتابعة حالياً
                </div>
              ) : (
                orders.map((order) => {
                  const config = getStatusConfig(order.status);
                  return (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl bg-[#faf8f5]/65 border border-[#e0e0e0] flex flex-col gap-4 text-right"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span
                          className={`inline-flex items-center rounded-xl px-3 py-1.5 text-xs font-semibold shrink-0 ${config.badgeClass}`}
                        >
                          {config.text}
                        </span>

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
                })
              )}
            </div>
          </div>
        )}
      </div>

      {isModalOpen && selectedOrder && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-6"
          dir="rtl"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-sm transform overflow-hidden rounded-[2.5rem] bg-[#fdfcfa] p-6 shadow-xl border border-[#f0ebde]/45 text-right space-y-5">
            <div className="text-center pb-2 border-b border-[#f0ebde]/55">
              <h3 className="text-lg font-bold text-[#265C38]">تغيير حالة الطلب</h3>
            </div>

            {actionError && (
              <div className="rounded-xl bg-red-50 p-3 text-center text-xs text-red-600">
                {actionError}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">حالة الطلب</label>
              <div className="relative">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TrackOrderStatus)}
                  className="w-full appearance-none rounded-xl border border-[#e0e0e0] bg-white p-3 text-sm text-[#333333] outline-none transition focus:border-[#265C38] pr-4 pl-10 cursor-pointer"
                >
                  <option value="PREPARING">قيد التجهيز</option>
                  <option value="IN_TRANSIT">قيد التوصيل</option>
                  <option value="READY">جاهز للاستلام</option>
                  <option value="DELIVERED">تم الإستلام</option>
                </select>
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-2 border-t border-[#f0ebde]/55">
              <button
                type="button"
                onClick={handleStatusChange}
                disabled={updateStatus.isPending}
                className="flex-1 py-3.5 bg-[#265C38] hover:bg-[#1f4f2c] text-white font-bold rounded-2xl transition duration-150 cursor-pointer text-center text-sm disabled:opacity-50"
              >
                {updateStatus.isPending ? 'جاري التحديث...' : 'تغيير الحالة'}
              </button>
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
