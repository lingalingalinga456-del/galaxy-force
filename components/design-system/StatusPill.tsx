import { cn } from '@/lib/utils';

type PillVariant = 'green' | 'red' | 'gold' | 'ink' | 'muted' | 'blue';

const variants: Record<PillVariant, string> = {
  green: 'bg-warm-green/10 text-warm-green',
  red: 'bg-warm-red/10 text-warm-red',
  gold: 'bg-warm-gold/15 text-warm-ink',
  ink: 'bg-warm-ink text-white',
  muted: 'bg-warm-beige text-warm-muted',
  blue: 'bg-sky-100 text-sky-700',
};

export function StatusPill({ label, variant = 'muted' }: { label: string; variant?: PillVariant }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium', variants[variant])}>
      {label}
    </span>
  );
}
