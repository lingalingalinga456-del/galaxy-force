'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle, reveal } from './home-shared';

const PLANS = [
  { name: 'Starter', price: 'Free', feats: ['1 active job', 'Basic AI match', 'Community support'], popular: false },
  { name: 'Growth', price: '৳999/mo', feats: ['10 active jobs', 'Priority AI match', 'Trust badge', 'Escrow support'], popular: true },
  { name: 'Enterprise', price: 'Custom', feats: ['Unlimited jobs', 'Dedicated manager', 'API access', 'SLA'], popular: false },
];

export function PricingPreview() {
  return (
    <section className="py-20 bg-warm-beige/60">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Simple pricing" title="Pricing Preview" sub="Start free. Upgrade when you grow." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((p, i) => (
            <motion.div key={i} {...reveal(i * 0.08)} className={`relative rounded-[28px] border p-7 hover:scale-[1.015] transition-transform duration-200 ${p.popular ? 'border-warm-red shadow-card-lift bg-white' : 'border-warm-border bg-white shadow-card'}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-warm-red text-white text-xs font-semibold">Most Popular</span>}
              <h3 className="text-lg font-semibold text-warm-ink">{p.name}</h3>
              <div className="text-3xl font-bold text-warm-ink mt-2">{p.price}</div>
              <ul className="mt-4 space-y-2 text-sm text-warm-muted">
                {p.feats.map((f) => <li key={f} className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-warm-green" />{f}</li>)}
              </ul>
              <Link href="/register" className="block mt-6"><Button className={`w-full ${p.popular ? '' : 'variant-secondary'}`}>Choose {p.name}</Button></Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-6"><Link href="/pricing" className="text-warm-red font-medium">See full pricing →</Link></div>
      </div>
    </section>
  );
}
