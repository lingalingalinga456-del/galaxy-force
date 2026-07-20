'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SectionTitle, Img, AI_MATCHES, isReduced } from './home-shared';

export function AIMatchShowcase() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || isReduced()) return;
    const t = setInterval(() => setI((p) => (p + 1) % AI_MATCHES.length), 4500);
    return () => clearInterval(t);
  }, [paused]);
  const it = AI_MATCHES[i];
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Powered by AI" title="Smart Matching, Made Human" sub="Our AI reads your real needs and surfaces the most trusted workers for the job." />
        <div className="relative max-w-3xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <motion.div key={i} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="rounded-[32px] bg-gradient-to-br from-warm-beige to-white border border-warm-gold/30 shadow-card-lift p-8 flex items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-warm-beige shrink-0"><Img src={it.photo} alt={it.name} className="w-full h-full object-cover" /></div>
            <div className="flex-1">
              <div className="text-4xl font-bold text-warm-gold">{it.match}%</div>
              <div className="text-sm text-warm-muted">{it.name} · {it.role}</div>
              <div className="flex flex-wrap gap-2 mt-3">
                {it.tags.map((tg: string) => <span key={tg} className="text-xs px-2.5 py-1 rounded-full bg-warm-gold/15 text-warm-ink">{tg}</span>)}
              </div>
            </div>
          </motion.div>
          <div className="flex items-center justify-center gap-2 mt-5">
            {AI_MATCHES.map((_, idx) => <button key={idx} onClick={() => setI(idx)} className={`w-2.5 h-2.5 rounded-full ${idx === i ? 'bg-warm-gold' : 'bg-warm-border'}`} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
