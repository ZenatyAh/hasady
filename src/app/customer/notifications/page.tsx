'use client';

import React from 'react';
import { useAuthStore } from '@/lib/store';
import { useNotifications } from '@/hooks/queries';
import { useMarkAllNotificationsRead } from '@/hooks/mutations';
import { formatRelativeTime } from '@/lib/format-time';
import { getErrorMessage } from '@/lib/api-errors';

export default function CustomerNotificationsPage() {
  const { data: notifications = [], isLoading, error, refetch } = useNotifications();
  const markAllMutation = useMarkAllNotificationsRead();

  const handleMarkAllRead = async () => {
    try {
      await markAllMutation.mutateAsync();
      await refetch();
    } catch {
      // handled by mutation error state
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0ebde]/45 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">التنبيهات والإشعارات</h1>
          <p className="text-xs text-gray-400 mt-1">
            تلقي تحديثات فورية حول طلباتك ومزايداتك ومحفظتك
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          disabled={markAllMutation.isPending || notifications.length === 0}
          className="text-xs font-bold text-[#265C38] hover:underline self-start sm:self-auto cursor-pointer disabled:opacity-50"
        >
          ✓ تحديد الكل كمقروء
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-3">
          <div className="h-8 w-8 border-3 border-[#e8f1eb] border-t-[#265C38] rounded-full animate-spin" />
          <span className="text-xs text-gray-500 font-bold">جاري تحميل الإشعارات...</span>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 text-center text-xs text-red-600">
          {getErrorMessage(error)}
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-[#fdfcfa] rounded-3xl border border-dashed border-[#f0ebde] p-16 text-center max-w-sm mx-auto space-y-3">
          <span className="text-4xl">🔔</span>
          <h3 className="text-lg font-bold text-[#111111]">لا توجد إشعارات جديدة</h3>
          <p className="text-sm text-[#888888]">
            عند حدوث أي مستجدات على طلباتك أو سوماتك ستظهر هنا.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((not) => (
            <div
              key={not.id}
              className={`border rounded-2xl p-5 shadow-sm transition flex flex-col gap-2 relative ${
                not.isRead ? 'bg-white border-[#f0ebde]/60' : 'bg-[#e8f1eb]/30 border-[#265C38]/20'
              }`}
            >
              {!not.isRead && (
                <span className="absolute top-5 left-5 h-2.5 w-2.5 bg-[#265C38] rounded-full" />
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#111111]">{not.title}</h3>
                <span className="text-[10px] text-gray-400 font-semibold">
                  {formatRelativeTime(not.createdAt)}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#666666]">{not.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
