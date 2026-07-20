'use client';

import { useState } from 'react';
import { SectionTitle, ACTIVITY, isReduced } from './home-shared';

export function ActivityTicker({ activity }: { activity?: { text: string; time: string }[] }) {
  const items = (activity && activity.length ? activity : ACTIVITY);
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
    <section className="py-14">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Live on platform" title="Marketplace Activity" />
        <div className="overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className={`flex gap-4 ${paused || isReduced() ? '' : 'animate-[marquee_24s_linear_infinite]'}`}>
            {doubled.map((it, idx) => (
              <div key={idx} className="shrink-0 flex items-center gap-2 rounded-full bg-white border border-warm-border shadow-card px-4 py-2 text-sm whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-warm-green" />
                <span className="text-warm-ink">{it.text}</span>
                <span className="text-warm-muted">{it.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
