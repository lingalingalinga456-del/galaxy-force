import { cn } from '@/lib/utils';

type MetricCardProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: string; positive?: boolean };
  accent?: 'red' | 'gold' | 'green';
};

const accentMap = {
  red: 'text-warm-red',
  gold: 'text-warm-gold',
  green: 'text-warm-green',
};

export function MetricCard({ label, value, icon, trend, accent = 'red' }: MetricCardProps) {
  return (
    <div className="rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-hover transition-all duration-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-warm-muted">{label}</p>
          <p className="text-3xl font-bold text-warm-ink mt-1 tabular-nums">{value}</p>
        </div>
        {icon && <div className={cn('w-10 h-10 rounded-full bg-warm-beige flex items-center justify-center', accentMap[accent])}>{icon}</div>}
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
