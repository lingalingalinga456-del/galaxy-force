import Link from 'next/link';
import { MapPin, Clock, Bookmark } from 'lucide-react';

export type JobCardData = {
  id: string;
  title: string;
  clientName?: string;
  clientVerified?: boolean;
  budgetType?: string;
  budget?: number;
  location?: string;
  distanceKm?: number;
  proposalsCount?: number;
  postedAt?: string;
  matchScore?: number;
};

export function JobCard({ job }: { job: JobCardData }) {
  return (
    <div className="rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-hover transition-all duration-200 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link href={`/jobs/${job.id}`} className="font-semibold text-warm-ink text-lg hover:text-warm-red transition-colors">
            {job.title}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-sm text-warm-muted">
            <span>{job.clientName || 'Client'}</span>
            {job.clientVerified && <span className="text-warm-green text-xs">✓ Verified</span>}
          </div>
        </div>
        <button className="text-warm-muted hover:text-warm-red transition-colors" aria-label="Save job">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-warm-muted">
        <span className="font-semibold text-warm-red">
          {job.budgetType === 'hourly' ? `৳${job.budget}/hr` : `৳${job.budget?.toLocaleString()}`}
        </span>
        {job.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {job.location}{job.distanceKm ? ` · ${job.distanceKm}km` : ''}
          </span>
        )}
        {job.proposalsCount !== undefined && <span>{job.proposalsCount} proposals</span>}
        {job.postedAt && (
          <span className="inline-flex items-center gap-1">
            <Clock className="w-4 h-4" /> {job.postedAt}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <Link href={`/jobs/${job.id}`}>
          <span className="text-sm font-medium text-warm-red hover:underline">View Job</span>
        </Link>
        {job.matchScore !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-full bg-warm-gold/15 px-3 py-1 text-xs font-medium text-warm-ink">
            {job.matchScore}% match
          </span>
        )}
      </div>
    </div>
  );
}
