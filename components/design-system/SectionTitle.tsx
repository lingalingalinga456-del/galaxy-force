import { cn } from '@/lib/utils';

export function SectionTitle({ children, action, className }: { children: React.ReactNode; action?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <h2 className="text-heading text-xl md:text-2xl font-bold text-warm-ink">{children}</h2>
      {action}
    </div>
  );
}
