import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-border-light flex flex-col justify-between h-full gap-4">
      <div className="flex justify-between items-start">
        <div className="w-12 h-12 bg-surface-green rounded-xl flex items-center justify-center text-2xl">
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${
              trend.isPositive ? 'bg-green-50 text-primary' : 'bg-red-50 text-red-600'
            }`}
          >
            <span dir="ltr">
              {trend.isPositive ? '+' : '-'}
              {Math.abs(trend.value)}%
            </span>
            <span>{trend.isPositive ? '↗' : '↘'}</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-bold text-text-muted mb-1">{title}</p>
        <h3 className="text-2xl font-extrabold text-foreground">{value}</h3>
      </div>
    </div>
  );
}
