'use client';

import { useState } from 'react';
import { SectionTitle, Img, IMG } from './home-shared';

const SLIDES = [
  { before: IMG.before, after: IMG.after, title: 'Home Renovation · Gulshan', tag: 'Painting & Tiling' },
  { before: IMG.plumber, after: IMG.hardware, title: 'Bathroom Repair · Banani', tag: 'Plumbing' },
  { after: IMG.construction, before: IMG.shop, title: 'Office Setup · Uttara', tag: 'Construction' },
];

export function BeforeAfterSlider() {
  const [slide, setSlide] = useState(0);
  const [pos, setPos] = useState(50);
  const [drag, setDrag] = useState(false);
  const s = SLIDES[slide];

  const onMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!drag) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <section className="py-20 bg-warm-beige/60">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Real results" title="Before & After" sub="See the quality of work delivered by verified workers and shops." />
        <div className="max-w-3xl mx-auto">
          <div
            className="relative w-full h-[340px] rounded-[32px] overflow-hidden select-none cursor-ew-resize shadow-card-lift"
            onMouseMove={onMove}
            onMouseUp={() => setDrag(false)}
            onMouseLeave={() => setDrag(false)}
            onTouchMove={onMove}
            onTouchEnd={() => setDrag(false)}
          >
            <Img src={s.after} alt="after" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-warm-green text-white text-xs font-semibold">After</div>
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
              <Img src={s.before} alt="before" className="absolute inset-0 w-full h-full object-cover" style={{ width: `${(100 / pos) * 100}%`, maxWidth: 'none' }} />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-warm-red text-white text-xs font-semibold">Before</div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 w-1 h-12 bg-white shadow rounded-full" style={{ left: `${pos}%` }} onMouseDown={() => setDrag(true)} onTouchStart={() => setDrag(true)}>
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 rounded-full bg-white shadow-card-lift flex items-center justify-center text-warm-red">⇄</div>
            </div>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-warm-ink/80 text-white text-xs">{s.title} · {s.tag}</div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-5">
            {SLIDES.map((_, idx) => <button key={idx} onClick={() => { setSlide(idx); setPos(50); }} className={`w-2.5 h-2.5 rounded-full ${idx === slide ? 'bg-warm-red' : 'bg-warm-border'}`} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
