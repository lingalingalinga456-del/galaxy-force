import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function EscrowIndicator({ percent = 100, label = 'Funds held in escrow' }: { percent?: number; label?: string }) {
  return (
    <div className="rounded-[24px] border border-warm-gold/30 bg-warm-gold/5 p-5">
      <div className="flex items-center gap-2 text-warm-ink">
        <Lock className="w-4 h-4 text-warm-gold" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="mt-3 h-2 rounded-full bg-warm-beige overflow-hidden">
        <div className={cn('h-full bg-warm-gold transition-all')} style={{ width: `${percent}%` }} />
      </div>
      <p className="text-xs text-warm-muted mt-2">Released after client confirmation. Sandbox demo — no real funds.</p>
    </div>
  );
}
