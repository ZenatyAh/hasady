// src/app/customer/notifications/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  type: 'order' | 'bid' | 'system';
}

export default function CustomerNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'not-1',
      title: '✅ تم قبول طلب الشراء',
      body: 'قام صاحب مزرعة الخيرات النجدية بقبول طلبك لشراء طماطم شيري، يرجى إتمام الدفع الآن لتأكيد الشحن.',
      time: 'قبل ساعة',
      isRead: false,
      type: 'order',
    },
    {
      id: 'not-2',
      title: '🚨 تنبيه مزاد - تم سوم أعلى',
      body: 'تفوق أحد المزايدين على سومك الحالي لمحصول خيار بلدي (مزاد)، شارك مجدداً لتضمن الصفقة.',
      time: 'قبل 4 ساعات',
      isRead: true,
      type: 'bid',
    },
    {
      id: 'not-3',
      title: '🏦 إشعار شحن المحفظة',
      body: 'تم شحن رصيد محفظتك بقيمة 10,000 ريال سعودي بنجاح عبر البطاقة الائتمانية.',
      time: 'أمس',
      isRead: true,
      type: 'system',
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 text-right">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#f0ebde]/45 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">التنبيهات والإشعارات</h1>
          <p className="text-xs text-gray-400 mt-1">تلقي تحديثات فورية حول طلباتك ومزايداتك ومحفظتك</p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-bold text-[#265C38] hover:underline self-start sm:self-auto cursor-pointer"
        >
          ✓ تحديد الكل كمقروء
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-[#fdfcfa] rounded-3xl border border-dashed border-[#f0ebde] p-16 text-center max-w-sm mx-auto space-y-3">
          <span className="text-4xl">🔔</span>
          <h3 className="text-lg font-bold text-[#111111]">لا توجد إشعارات جديدة</h3>
          <p className="text-sm text-[#888888]">عند حدوث أي مستجدات على طلباتك أو سوماتك ستظهر هنا.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((not) => (
            <div
              key={not.id}
              className={`border rounded-2xl p-5 shadow-sm transition flex flex-col gap-2 relative ${
                not.isRead
                  ? 'bg-white border-[#f0ebde]/60'
                  : 'bg-[#e8f1eb]/30 border-[#265C38]/20'
              }`}
            >
              {/* Unread dot indicator */}
              {!not.isRead && (
                <span className="absolute top-5 left-5 h-2.5 w-2.5 bg-[#265C38] rounded-full" />
              )}

              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#111111]">{not.title}</h3>
                <span className="text-[10px] text-gray-400 font-semibold">{not.time}</span>
              </div>
              <p className="text-xs leading-relaxed text-[#666666]">{not.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
