import { cn } from '@/lib/utils';
import { ShieldCheck, Star, BadgeCheck } from 'lucide-react';

type TrustBadgeProps = {
  label: string;
  variant?: 'verified' | 'gold' | 'rating';
  icon?: React.ReactNode;
};

export function TrustBadge({ label, variant = 'verified', icon }: TrustBadgeProps) {
  const styles = {
    verified: 'bg-warm-green/10 text-warm-green',
    gold: 'bg-warm-gold/15 text-warm-ink',
    rating: 'bg-warm-beige text-warm-ink',
  } as const;

  const defaultIcon =
    variant === 'verified' ? <BadgeCheck className="w-3.5 h-3.5" /> :
    variant === 'gold' ? <Star className="w-3.5 h-3.5" /> :
    <ShieldCheck className="w-3.5 h-3.5" />;

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium', styles[variant])}>
      {icon || defaultIcon}
      {label}
    </span>
  );
}
