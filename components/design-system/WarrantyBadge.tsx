import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WarrantyBadge({ days }: { days: number | string | null | undefined }) {
  if (!days || days === 'none' || days === 'No warranty') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-warm-beige px-3 py-1 text-xs text-warm-muted">
        <ShieldCheck className="w-3.5 h-3.5" /> No warranty
      </span>
    );
  }
  const label = typeof days === 'number' ? `${days} days warranty` : days;
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full bg-warm-gold/15 px-3 py-1 text-xs font-medium text-warm-ink')}>
      <ShieldCheck className="w-3.5 h-3.5" /> {label}
    </span>
  );
}
