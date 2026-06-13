'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store';
import { useAuthGuard } from '@/lib/use-auth-guard';
import { useNotifications } from '@/hooks/queries';
import { useMarkAllNotificationsRead } from '@/hooks/mutations';
import { PageHeader } from '@/components/merchant/PageHeader';
import { formatRelativeTime } from '@/lib/format-time';
import { getErrorMessage } from '@/lib/api-errors';

export default function NotificationsPage() {
  const { isReady } = useAuthGuard();
  const token = useAuthStore((state) => state.token);
  const { data: notifications = [], isLoading, error, refetch } = useNotifications(token);
  const markAllMutation = useMarkAllNotificationsRead(token);

  const markAllAsRead = async () => {
    try {
      await markAllMutation.mutateAsync();
      await refetch();
    } catch {
      // mutation error surfaced below if needed
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#faf8f5] w-full pb-16 px-4 md:px-8 py-6" dir="rtl">
      <div className="max-w-xl mx-auto w-full flex flex-col space-y-6">
        <PageHeader title="الإشعارات" backHref="/merchant" />

        <div className="bg-[#fdfcfa] p-5 sm:p-8 rounded-[2.5rem] border border-[#f0ebde]/45 shadow-sm space-y-4">
          {notifications.length > 0 && (
            <div className="flex justify-end border-b border-[#f0ebde]/55 pb-3">
              <button
                onClick={markAllAsRead}
                disabled={markAllMutation.isPending}
                className="text-xs font-bold text-[#265C38] hover:underline cursor-pointer disabled:opacity-50"
              >
                تحديد الكل كمقروء
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <div className="h-8 w-8 border-3 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
              <span className="text-xs text-gray-500 font-bold">جاري تحميل الإشعارات...</span>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 p-4 text-center text-xs text-red-600">
              {getErrorMessage(error)}
            </div>
          ) : (
            <div className="space-y-3.5 max-h-[600px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-400 font-medium">
                  لا توجد إشعارات حالياً
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-[#faf8f5]/65 border border-[#e0e0e0]/45 transition hover:bg-[#faf8f5]/90 text-right relative"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#e8f1eb] border border-[#265C38]/10 shrink-0">
                      <svg
                        className="h-5.5 w-5.5 text-[#265C38]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                      </svg>
                    </div>

                    <div className="flex-1 space-y-1 pr-0.5">
                      <h3 className="text-sm font-bold text-[#111111]">{notif.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">
                        {notif.body}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between self-stretch shrink-0 pb-1 pt-0.5">
                      <span className="text-[9px] text-gray-400 font-mono leading-none block">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-red-500 block animate-pulse mr-0.5" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
