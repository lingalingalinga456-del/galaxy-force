'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionTitle, Img, TESTIMONIALS, isReduced } from './home-shared';

export function SuccessStories() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || isReduced()) return;
    const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [paused]);
  const it = TESTIMONIALS[i];
  return (
    <section className="py-20 bg-warm-beige/60">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Real outcomes" title="Success Stories" sub="Hear from the people who build, hire, and sell on Galaxy Workforce." />
        <div className="relative max-w-4xl mx-auto" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <motion.div key={i} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="rounded-[32px] bg-white shadow-card border border-warm-border overflow-hidden grid md:grid-cols-2">
            <div className="h-64 md:h-auto bg-warm-beige"><Img src={it.photo} alt={it.name} className="w-full h-full object-cover" /></div>
            <div className="p-8 flex flex-col justify-center">
              <Star className="w-7 h-7 text-warm-gold fill-warm-gold" />
              <p className="text-lg text-warm-ink mt-3 leading-relaxed">"{it.quote}"</p>
              <p className="mt-4 font-semibold text-warm-ink">{it.name}</p>
              <p className="text-sm text-warm-muted">{it.role} · {it.result}</p>
            </div>
          </motion.div>
          <div className="flex items-center justify-center gap-3 mt-5">
            <button onClick={() => setI((p) => (p - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="w-9 h-9 rounded-full bg-white border border-warm-border flex items-center justify-center text-warm-muted hover:text-warm-red"><ChevronLeft className="w-4 h-4" /></button>
            {TESTIMONIALS.map((_, idx) => <button key={idx} onClick={() => setI(idx)} className={`w-2.5 h-2.5 rounded-full ${idx === i ? 'bg-warm-red' : 'bg-warm-border'}`} />)}
            <button onClick={() => setI((p) => (p + 1) % TESTIMONIALS.length)} className="w-9 h-9 rounded-full bg-white border border-warm-border flex items-center justify-center text-warm-muted hover:text-warm-red"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
