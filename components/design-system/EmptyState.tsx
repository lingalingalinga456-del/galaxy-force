import { cn } from '@/lib/utils';

export function EmptyState({ title, description, icon, action }: { title: string; description?: string; icon?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="rounded-[24px] bg-warm-beige/60 border border-dashed border-warm-border p-12 text-center">
      {icon && <div className="mx-auto w-14 h-14 rounded-full bg-warm-cream border border-warm-border flex items-center justify-center text-2xl mb-4">{icon}</div>}
      <h3 className="font-semibold text-warm-ink">{title}</h3>
      {description && <p className="text-sm text-warm-muted mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-[24px]', className)} />;
}
