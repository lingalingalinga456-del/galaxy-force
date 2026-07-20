import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MatchTooltip({ score, reasons = [] }: { score: number; reasons?: string[] }) {
  return (
    <span className="group relative inline-flex items-center">
      <span className="inline-flex items-center gap-1 rounded-full bg-warm-gold/15 px-2 py-0.5 text-xs font-medium text-warm-ink cursor-help">
        {score}% match <Info className="w-3 h-3" />
      </span>
      <span className={cn('pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-card-sm bg-warm-ink text-white text-xs p-3 opacity-0 group-hover:opacity-100 transition-opacity z-20')}>
        <p className="font-medium mb-1">Why this matches</p>
        <ul className="list-disc list-inside space-y-0.5 text-white/80">
          {reasons.length ? reasons.map((r, i) => <li key={i}>{r}</li>) : <li>Matches your stated skills and location</li>}
        </ul>
      </span>
    </span>
  );
}
