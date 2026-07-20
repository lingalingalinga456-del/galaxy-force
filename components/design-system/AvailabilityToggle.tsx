'use client';
import { cn } from '@/lib/utils';

const STATUSES = [
  { key: 'available', label: 'Available Now', color: 'bg-warm-green text-white border-warm-green' },
  { key: 'emergency_only', label: 'Emergency Only', color: 'bg-warm-red text-white border-warm-red' },
  { key: 'appointment_only', label: 'Appointment Only', color: 'bg-warm-gold text-white border-warm-gold' },
  { key: 'on_job', label: 'On Job', color: 'bg-warm-ink text-white border-warm-ink' },
  { key: 'offline', label: 'Offline', color: 'bg-warm-beige text-warm-muted border-warm-border' },
  { key: 'vacation', label: 'Vacation', color: 'bg-warm-beige text-warm-muted border-warm-border' },
] as const;

export function AvailabilityToggle({ value, onChange }: { value: string; onChange?: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((s) => (
        <button
          key={s.key}
          type="button"
          onClick={() => onChange?.(s.key)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150',
            value === s.key ? s.color : 'bg-white text-warm-muted border-warm-border hover:border-warm-red'
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
