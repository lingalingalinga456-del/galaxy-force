// components/design-system/components/WorkerStatusPill.tsx
import { cn } from '@/lib/utils';

type WorkerStatusPillProps = {
  status?: 'active' | 'unverified' | 'busy' | 'offline';
  label?: string;
};

export function WorkerStatusPill({ status = 'active', label }: WorkerStatusPillProps) {
  const statusConfig = {
    active: { bg: 'bg-warm-red', text: 'text-white', border: 'border-warm-red' },
    unverified: { bg: 'bg-warm-border', text: 'text-warm-muted', border: 'border-warm-border' },
    busy: { bg: 'bg-warm-gold', text: 'text-white', border: 'border-warm-gold' },
    offline: { bg: 'bg-warm-beige', text: 'text-warm-muted', border: 'border-warm-border' },
  };

  const config = statusConfig[status];
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
      config.bg,
      config.text,
      config.border
    )}>
      {displayLabel}
    </span>
  );
}