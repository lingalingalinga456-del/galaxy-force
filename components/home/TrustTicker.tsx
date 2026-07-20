'use client';

import { motion } from 'framer-motion';
import { UserCheck, ShieldCheck, BadgeCheck, Star, FileCheck, Phone } from 'lucide-react';
import { CountUp, HomeStats, reveal } from './home-shared';

export function TrustTicker({ stats }: { stats?: HomeStats }) {
  const items = [
    { v: (stats?.verifiedWorkers ?? 12450), s: '+', l: 'Verified Workers', icon: <UserCheck className="w-4 h-4" /> },
    { v: (stats?.companies ?? 3280), s: '+', l: 'Companies', icon: <ShieldCheck className="w-4 h-4" /> },
    { v: (stats?.jobsCompleted ?? 87500), s: '+', l: 'Jobs Completed', icon: <BadgeCheck className="w-4 h-4" /> },
    { v: (stats?.avgRating ?? 4.9), s: '/5', l: 'Average Rating', d: 1, icon: <Star className="w-4 h-4" /> },
  ];
  return (
    <section className="py-14 bg-warm-beige">
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((c, i) => (
          <motion.div key={i} {...reveal(i * 0.08)} className="flex flex-col items-center text-center rounded-[20px] bg-white/70 border border-warm-border px-4 py-6 shadow-card">
            <div className="w-9 h-9 rounded-full bg-warm-gold/15 text-warm-ink flex items-center justify-center mb-2">{c.icon}</div>
            <div className="text-2xl md:text-3xl font-bold text-warm-ink"><CountUp value={c.v} suffix={c.s} decimals={c.d || 0} /></div>
            <div className="text-sm text-warm-muted mt-1">{c.l}</div>
          </motion.div>
        ))}
      </div>
      <div className="container mx-auto px-4 mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-warm-muted">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-warm-border"><FileCheck className="w-3 h-3 text-warm-green" /> NID Verified</span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-warm-border"><Phone className="w-3 h-3 text-warm-green" /> Phone Verified</span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-warm-border"><UserCheck className="w-3 h-3 text-warm-green" /> Face Verified</span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-warm-border"><ShieldCheck className="w-3 h-3 text-warm-green" /> Admin Approved</span>
      </div>
      <p className="text-center text-sm text-warm-muted mt-4 font-medium">Verified Human Workers — ready for real jobs.</p>
    </section>
  );
}
