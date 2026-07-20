'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { SectionTitle, reveal, HR_PRIORITY } from './home-shared';

function CategoryCard({ cat, idx, featured }: { cat: any; idx: number; featured?: boolean }) {
  return (
    <motion.div {...reveal((idx % 4) * 0.05)} className="group">
      <Link href={`/discover?category=${cat.slug}`}>
        <div className={`h-full rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-hover transition-all duration-200 p-6 hover:scale-[1.03] ${featured ? 'bg-gradient-to-br from-warm-beige to-white' : ''}`}>
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
          <h3 className="font-semibold text-warm-ink">{cat.name_en}</h3>
          <p className="text-xs text-warm-muted mt-1">{cat.worker_count || cat.job_count || 0} workers available</p>
          <p className="text-xs text-warm-gold mt-0.5">৳{cat.typical_rate_min || 300}–{cat.typical_rate_max || 1500}/hr</p>
          <span className="inline-flex items-center gap-1 mt-3 text-sm text-warm-red font-medium">Explore →</span>
        </div>
      </Link>
    </motion.div>
  );
}

export function CategoryEcosystem({ categories }: { categories: any[] }) {
  const hrCats = categories.filter((c) => HR_PRIORITY.includes(c.slug));
  const otherCats = categories.filter((c) => !HR_PRIORITY.includes(c.slug));
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Browse by category" title="Explore the Workforce" sub="Real people for real jobs — trades, services, and local work." />
        <h3 className="text-sm font-semibold text-warm-muted uppercase tracking-wide mb-3">Physical Human Trades</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {hrCats.map((cat, idx) => <CategoryCard key={cat.slug} cat={cat} idx={idx} featured />)}
        </div>
        <h3 className="text-sm font-semibold text-warm-muted uppercase tracking-wide mb-3">Local Shops & Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {otherCats.map((cat, idx) => <CategoryCard key={cat.slug} cat={cat} idx={idx} />)}
          <Link href="/discover" className="flex items-center justify-center rounded-[24px] border-2 border-dashed border-warm-border text-warm-red font-medium hover:bg-warm-beige transition-all">
            Browse All Categories →
          </Link>
        </div>
      </div>
    </section>
  );
}
