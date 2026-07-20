import Link from 'next/link';
import { TrustScoreRing } from './TrustScoreRing';
import { WorkerStatusPill } from './WorkerStatusPill';
import { TrustBadge } from './TrustBadge';

export type WorkerCardData = {
  username?: string;
  id?: string;
  name: string;
  headline?: string;
  primaryOccupation?: string;
  location?: string;
  hourlyRate?: number;
  completedJobs?: number;
  trustScore?: number;
  verified?: boolean;
  status?: 'active' | 'unverified' | 'busy' | 'offline';
  skills?: string[];
  imageUrl?: string;
};

export function WorkerCard({ worker }: { worker: WorkerCardData }) {
  const href = `/talent/${worker.username || worker.id}`;
  return (
    <Link href={href} className="group block">
      <div className="w-[320px] h-[380px] rounded-[32px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.015] flex flex-col overflow-hidden">
        {/* Top image */}
        <div className="relative h-[150px] bg-gradient-to-br from-warm-beige to-warm-cream flex items-center justify-center overflow-hidden">
          {worker.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={worker.imageUrl} alt={worker.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-warm-red/10 flex items-center justify-center text-3xl font-bold text-warm-red">
              {worker.name.charAt(0)}
            </div>
          )}
          <div className="absolute top-3 right-3">
            <TrustScoreRing score={worker.trustScore ?? 0} />
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-warm-ink text-lg leading-tight">{worker.name}</h3>
                {worker.verified && <TrustBadge label="Verified" variant="verified" />}
              </div>
              <p className="text-sm text-warm-muted mt-0.5">{worker.primaryOccupation || worker.headline}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {(worker.skills || []).slice(0, 3).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-full bg-warm-beige text-xs text-warm-muted">
                {s}
              </span>
            ))}
          </div>

          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-warm-muted">{worker.location || 'Bangladesh'}</span>
              <span className="font-semibold text-warm-red">
                {worker.hourlyRate ? `৳${worker.hourlyRate}/hr` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-warm-muted">{worker.completedJobs || 0} jobs done</span>
              <WorkerStatusPill status={worker.status || 'active'} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
