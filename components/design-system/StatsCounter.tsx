'use client';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type StatsCounterProps = {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  duration?: number;
};

export function StatsCounter({ value, label, suffix = '', prefix = '', duration = 1200 }: StatsCounterProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className={cn('text-3xl md:text-4xl font-bold text-warm-red tabular-nums')}>
        {prefix}{display.toLocaleString()}{suffix}
      </div>
      <div className="text-sm text-warm-muted mt-1">{label}</div>
    </div>
  );
}
