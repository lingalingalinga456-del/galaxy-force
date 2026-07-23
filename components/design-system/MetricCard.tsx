'use client';

import { cn } from '@/lib/utils';

export function MetricCard({ label, value, icon, trend, accent = 'red' }: { label: string; value: string | number; icon?: React.ReactNode; trend?: { value: string; positive?: boolean }; accent?: 'red' | 'gold' | 'green' }) {
  const accentClasses = {
    red: 'border-warm-red bg-warm-red/5',
    gold: 'border-warm-gold bg-warm-gold/5',
    green: 'border-warm-green bg-warm-green/5'
  };

  return (
    <div className={`rounded-2xl bg-white border p-6 shadow-sm hover:shadow-md transition-all ${accentClasses[accent] || ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-warm-muted">{label}</p>
          <p className="text-2xl font-bold text-warm-ink">{value}</p>
        </div>
        {icon && <div className="w-9 h-9 rounded-full flex items-center justify-center bg-warm-beige">{icon}</div>}
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <span className={trend.positive ? 'text-warm-green' : 'text-warm-red'}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
          <span className="text-warm-muted">vs last month</span>
        </div>
      )}
    </div>
  );
}