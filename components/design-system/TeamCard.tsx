import { Users, Star } from 'lucide-react';
import Link from 'next/link';

export type TeamCardData = {
  id: string;
  name: string;
  leaderName?: string;
  memberCount?: number;
  rating?: number;
  location?: string;
  category?: string;
};

export function TeamCard({ team }: { team: TeamCardData }) {
  return (
    <Link href={`/teams/${team.id}`} className="block">
      <div className="w-full sm:w-80 h-[380px] rounded-[32px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.015] flex flex-col overflow-hidden">
        <div className="h-[150px] bg-gradient-to-br from-warm-gold/20 to-warm-beige flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white/70 flex items-center justify-center text-3xl text-warm-gold">
            <Users />
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-warm-gold/15 text-xs font-medium text-warm-ink">Team</span>
            {team.category && <span className="text-xs text-warm-muted">{team.category}</span>}
          </div>
          <h3 className="font-semibold text-warm-ink text-lg mt-2">{team.name}</h3>
          <p className="text-sm text-warm-muted mt-0.5">Led by {team.leaderName || '—'}</p>
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-warm-muted">{team.location || 'Bangladesh'}</span>
              {team.rating !== undefined && (
                <span className="inline-flex items-center gap-1 text-warm-gold">
                  <Star className="w-4 h-4 fill-warm-gold" /> {team.rating}
                </span>
              )}
            </div>
            <div className="text-sm text-warm-ink font-medium">{team.memberCount || 0} members</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
