'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Search, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IMG, Img } from './home-shared';

const PH = ['Need a mechanic nearby?', 'Hire a cleaner today', 'Find a tutor in Dhaka', 'Need help with AC repair'];

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
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [ph, setPh] = useState(PH[0]);
  const [mode, setMode] = useState<'workers' | 'shops'>('workers');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % PH.length; setPh(PH[i]); }, 2800);
    return () => clearInterval(t);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = encodeURIComponent(query.trim() || ph);
    const base = mode === 'shops' ? '/discover?tab=shops' : '/discover';
    router.push(`${base}&query=${q}`);
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-warm-cream to-warm-beige">
      <div className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-warm-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-warm-red/5 blur-3xl" />
      <div className="container mx-auto px-4 py-20 grid md:grid-cols-[55fr_45fr] gap-12 items-center relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-warm-muted text-sm mb-6 shadow-card">
            <Sparkles className="w-4 h-4 text-warm-red" /> Human Resource Marketplace
          </div>
          <h1 className="text-heading text-5xl md:text-[64px] font-bold mb-6 leading-[1.1] text-warm-ink">
            Find Trusted Talent.<br />Build Without Limits.
          </h1>
          <p className="text-lg text-warm-muted mb-8 max-w-xl">
            Hire real, verified human workers for any job — from electricians to cleaners — across Bangladesh and beyond.
          </p>
          <div className="inline-flex bg-warm-beige rounded-full p-1 mb-4">
            <button onClick={() => setMode('workers')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === 'workers' ? 'bg-white shadow text-warm-ink' : 'text-warm-muted'}`}>Find Workers</button>
            <button onClick={() => setMode('shops')} className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${mode === 'shops' ? 'bg-white shadow text-warm-ink' : 'text-warm-muted'}`}>Browse Shops</button>
          </div>
          <form onSubmit={submit} className="relative max-w-2xl">
            <div className="flex items-center gap-2 rounded-full bg-white shadow-card-lift border border-transparent focus-within:border-warm-gold focus-within:ring-4 focus-within:ring-warm-gold/15 transition-all duration-200 px-5 py-3">
              <Search className="w-5 h-5 text-warm-muted shrink-0" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ph} className="flex-1 bg-transparent outline-none text-warm-ink placeholder:text-warm-muted" />
              <Button type="submit" size="sm" className="rounded-full gap-1">Find</Button>
            </div>
          </form>
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
