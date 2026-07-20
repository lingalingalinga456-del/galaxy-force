'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, BadgeCheck, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle, reveal, Img, WORKERS, TEAMS } from './home-shared';

function PremiumWorkerCard({ w, idx = 0, recommended = false }: { w: any; idx?: number; recommended?: boolean }) {
  return (
    <motion.div {...reveal((idx % 4) * 0.05)} className="group">
      <Link href={`/talent/${w.username || w.id}`} className="block">
        <div className="w-full h-[420px] rounded-[28px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden flex flex-col">
          <div className="relative h-[210px] overflow-hidden bg-gradient-to-br from-warm-beige to-warm-cream">
            {w.photo ? <Img src={w.photo} alt={w.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-warm-red/30">{w.name?.charAt(0) || 'W'}</div>}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-xs font-bold text-warm-ink shadow flex items-center gap-1"><Star className="w-3 h-3 fill-warm-gold text-warm-gold" />{w.score}</div>
            {recommended && <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-warm-gold text-warm-ink text-xs font-semibold shadow">Recommended</div>}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-warm-ink text-lg leading-tight">{w.name}</h3>
              {w.verified && <BadgeCheck className="w-4 h-4 text-warm-green shrink-0" />}
            </div>
            <p className="text-sm text-warm-muted mt-0.5">{w.role}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">{(w.skills || []).slice(0, 3).map((s: string) => <span key={s} className="px-2 py-0.5 rounded-full bg-warm-beige text-xs text-warm-muted">{s}</span>)}</div>
            <div className="mt-auto space-y-3 pt-3">
              <div className="flex items-center justify-between text-sm"><span className="text-warm-muted">{w.location || 'Bangladesh'}</span><span className="font-semibold text-warm-red">৳{w.rate}/hr</span></div>
              <div className="flex items-center justify-between"><span className="text-xs text-warm-muted">{w.jobs} jobs done</span><span className={`text-xs px-2 py-0.5 rounded-full ${w.availability === 'Available' ? 'bg-warm-green/10 text-warm-green' : 'bg-warm-beige text-warm-muted'}`}>{w.availability}</span></div>
              {w.match != null && <div className="text-xs px-2 py-0.5 rounded-full bg-warm-gold/15 text-warm-ink self-start">{w.match}% AI match</div>}
            </div>
            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="flex-1 text-center text-xs px-3 py-1.5 rounded-full bg-warm-red text-white">View Profile</span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-warm-beige text-warm-ink">Save</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function TeamCardMini({ t, idx = 0 }: { t: any; idx?: number }) {
  return (
    <motion.div {...reveal((idx % 4) * 0.05)} className="group">
      <Link href="/discover?view=teams" className="block">
        <div className="w-full h-[420px] rounded-[28px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden flex flex-col">
          <div className="relative h-[210px] overflow-hidden"><Img src={t.photo} alt={t.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" /><div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-warm-gold text-warm-ink text-xs font-semibold shadow">Team</div></div>
          <div className="p-5 flex flex-col flex-1">
            <h3 className="font-semibold text-warm-ink text-lg leading-tight">{t.name}</h3>
            <p className="text-sm text-warm-muted mt-0.5">{t.category} · {t.location}</p>
            <p className="text-sm text-warm-muted mt-3">Led by {t.leaderName}</p>
            <div className="mt-auto flex items-center justify-between text-sm pt-3"><span className="flex items-center gap-1 text-warm-muted"><Star className="w-4 h-4 fill-warm-gold text-warm-gold" />{t.rating}</span><span className="text-xs text-warm-muted">{t.memberCount} members</span></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedWorkers({ workers }: { workers?: any[] }) {
  const list = (workers && workers.length ? workers : WORKERS);
  const mixed = [...list.slice(0, 6), TEAMS[0], TEAMS[1], ...list.slice(6, 8)];
  return (
    <section className="py-20 bg-warm-beige/60">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Hand-picked talent" title="Featured Human Workers" sub="Verified, trusted, and ready to help — workers, teams, and shops." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {mixed.map((item: any, i: number) => item.memberCount !== undefined
            ? <TeamCardMini key={`team-${item.id}`} t={item} idx={i} />
            : <PremiumWorkerCard key={item.id} w={item} idx={i} recommended={i % 3 === 1} />)}
        </div>
        <div className="text-center mt-8"><Link href="/discover"><Button size="lg" variant="secondary" className="gap-2">Browse All Workers <ArrowRight className="w-4 h-4" /></Button></Link></div>
      </div>
    </section>
  );
}
