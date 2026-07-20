import { Check, Clock, MapPin, Play, Square, Search, FileCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LIFECYCLE_STEPS = [
  'booked',
  'accepted',
  'navigated',
  'arrived',
  'started',
  'paused',
  'completed',
  'inspection',
  'payment',
  'review',
  'warranty',
] as const;

type Step = (typeof LIFECYCLE_STEPS)[number];

const icons: Record<Step, React.ReactNode> = {
  booked: <FileCheck className="w-4 h-4" />,
  accepted: <Check className="w-4 h-4" />,
  navigated: <MapPin className="w-4 h-4" />,
  arrived: <MapPin className="w-4 h-4" />,
  started: <Play className="w-4 h-4" />,
  paused: <Clock className="w-4 h-4" />,
  completed: <Square className="w-4 h-4" />,
  inspection: <Search className="w-4 h-4" />,
  payment: <Check className="w-4 h-4" />,
  review: <FileCheck className="w-4 h-4" />,
  warranty: <Check className="w-4 h-4" />,
};

const labels: Record<Step, string> = {
  booked: 'Booked',
  accepted: 'Worker Accepted',
  navigated: 'Navigating',
  arrived: 'Arrived',
  started: 'Started Work',
  paused: 'Paused',
  completed: 'Completed',
  inspection: 'Client Inspection',
  payment: 'Payment',
  review: 'Review',
  warranty: 'Warranty',
};

export function OfflineLifecycle({ current }: { current: Step }) {
  const idx = LIFECYCLE_STEPS.indexOf(current);
  return (
    <div className="relative pl-2">
      {LIFECYCLE_STEPS.map((step, i) => {
        const done = i < idx || current === 'completed' && i <= idx;
        const active = i === idx;
        return (
          <div key={step} className="flex gap-3 pb-5 last:pb-0">
            <div className="flex flex-col items-center">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center border-2', active ? 'bg-warm-red border-warm-red text-white' : done ? 'bg-warm-green border-warm-green text-white' : 'bg-white border-warm-border text-warm-muted')}>
                {done ? <Check className="w-4 h-4" /> : icons[step]}
              </div>
              {i < LIFECYCLE_STEPS.length - 1 && <div className={cn('w-0.5 flex-1', done ? 'bg-warm-green' : 'bg-warm-border')} />}
            </div>
            <div className="pt-1">
              <p className={cn('text-sm font-medium', active ? 'text-warm-ink' : done ? 'text-warm-ink' : 'text-warm-muted')}>{labels[step]}</p>
              {active && <p className="text-xs text-warm-red">In progress</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
