'use client';

interface JobCardProps {
  id: string;
  title: string;
  clientName: string;
  location: string;
  distance: string;
  budget: number;
  type: string;
  proposals: number;
  matchScore: number;
}

export function JobCard({
  id,
  title,
  clientName,
  location,
  distance,
  budget,
  type,
  proposals,
  matchScore,
}: JobCardProps) {
  return (
    <div className="bg-white border border-warm-border rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-all w-full">
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="font-semibold text-lg text-warm-ink">{title}</h3>
          <p className="text-sm text-warm-muted">{clientName}</p>
        </div>
        <div className="text-right">
          <span className="font-semibold text-lg text-warm-ink">৳{budget}</span>
          <p className="text-xs text-warm-muted capitalize">{type}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-sm text-warm-muted">
        <span>{location}</span> • <span>{distance}</span>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span>{proposals} proposals</span>
        <span className="text-warm-green">{matchScore}% Match</span>
      </div>

      <div className="mt-4 flex gap-3">
        <button className="flex-1 border border-warm-red text-warm-red py-2 rounded-2xl text-sm touch-target transition-colors">
          Save
        </button>
        <button className="flex-1 bg-warm-red text-white py-2 rounded-2xl text-sm touch-target hover:bg-warm-red-hover">
          View Details
        </button>
      </div>
    </div>
  );
}