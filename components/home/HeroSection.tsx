'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMG, Img } from './home-shared';
import { SearchWithSuggestions } from '@/components/search/SearchWithSuggestions';


function FloatingCards() {
  const reduce = useReducedMotion();
  const float = (delay: number) => reduce ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 7, repeat: Infinity, ease: 'easeInOut', delay } };
  return (
    <div className="relative hidden md:block h-[460px]">
      <motion.div {...float(0)} className="absolute top-2 right-6 w-64 rounded-[24px] bg-white shadow-card-lift p-4 border border-warm-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-warm-beige"><Img src={IMG.electrician} alt="Rahim" className="w-full h-full object-cover" /></div>
          <div>
            <div className="font-semibold text-warm-ink">Rahim Ahmed</div>
            <div className="text-xs text-warm-muted">Electrician · Dhaka</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-full bg-warm-green/10 text-warm-green flex items-center gap-1"><BadgeCheck className="w-3 h-3" />Verified</span>
          <span className="px-2 py-0.5 rounded-full bg-warm-beige text-warm-muted">★ 4.9</span>
        </div>
      </motion.div>
      <motion.div {...float(1.8)} className="absolute top-44 -left-2 w-60 rounded-[24px] bg-warm-ink text-white shadow-card-lift p-4">
        <div className="text-xs text-white/60 mb-1">AI Match</div>
        <div className="text-3xl font-bold text-warm-gold">94%</div>
        <div className="text-sm text-white/80 mt-1">Rahim ↔ Your job</div>
        <div className="mt-2 h-1.5 rounded-full bg-white/15 overflow-hidden"><div className="h-full bg-warm-gold" style={{ width: '94%' }} /></div>
      </motion.div>
      <motion.div {...float(3.4)} className="absolute bottom-0 right-16 w-56 rounded-[24px] bg-white shadow-card-lift p-4 border border-warm-border">
        <div className="text-xs text-warm-muted mb-1">New request</div>
        <div className="text-sm font-medium text-warm-ink">AC Repair · Uttara</div>
        <div className="text-xs text-warm-gold mt-1">3 matches found</div>
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const [mode, setMode] = useState<'workers' | 'shops'>('workers');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-warm-cream to-warm-beige">
      <div className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-warm-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-warm-red/5 blur-3xl" />
      <div className="container mx-auto px-4 py-20 grid md:grid-cols-[55fr_45fr] gap-12 items-center relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-warm-muted text-sm mb-6 shadow-card">
            <Sparkles className="w-4 h-4 text-warm-red" /> Human Resource Marketplace
          </div>
           <h1 className="h1 mb-6 leading-[1.1]">
             Find Trusted Talent.<br />Build Without Limits.
           </h1>
          <p className="text-lg text-warm-muted mb-8 max-w-xl">
            Hire real, verified human workers for any job — from electricians to cleaners — across Bangladesh and beyond.
          </p>
          <div className="inline-flex bg-warm-beige rounded-full p-1 mb-4">
            <button onClick={() => setMode('workers')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === 'workers' ? 'bg-white shadow text-warm-ink' : 'text-warm-muted'}`}>Find Workers</button>
            <button onClick={() => setMode('shops')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === 'shops' ? 'bg-white shadow text-warm-ink' : 'text-warm-muted'}`}>Browse Shops</button>
          </div>
          <div className="max-w-2xl">
            <SearchWithSuggestions
              scope={mode === 'shops' ? 'shops' : 'all'}
              placeholder={mode === 'shops' ? 'Search shops, products, hardware…' : 'Search workers, skills, “fix my AC”…'}
              size="lg"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link href="/client/jobs/new"><Button size="lg" className="gap-2">Hire Human Workers <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/talent-dashboard/jobs"><Button size="lg" variant="secondary" className="gap-2">Find Work <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </motion.div>
        <FloatingCards />
      </div>
    </section>
  );
}
