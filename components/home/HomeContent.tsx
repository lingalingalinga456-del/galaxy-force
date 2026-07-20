'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles, Search, ShieldCheck, BadgeCheck, Star, ChevronLeft, ChevronRight, Phone, FileCheck, UserCheck, Users, Brain, HeartHandshake, Globe2, ShoppingBag, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import Lenis from 'lenis';

const PH = ['Need a mechanic nearby?', 'Hire a cleaner today', 'Find a tutor in Dhaka', 'Need help with AC repair'];

const IMG = {
  electrician: 'https://images.unsplash.com/photo-1545259741-2ea3a54f4cfe?auto=format&fit=crop&w=500&q=70',
  mechanic: 'https://images.unsplash.com/photo-1486262715619-67e5e4db6392?auto=format&fit=crop&w=500&q=70',
  tutor: 'https://images.unsplash.com/photo-1503676260728-1c00da0949d1?auto=format&fit=crop&w=500&q=70',
  cleaner: 'https://images.unsplash.com/photo-1581578731548-c2763647dc21?auto=format&fit=crop&w=500&q=70',
  driver: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=500&q=70',
  construction: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=500&q=70',
  plumber: 'https://images.unsplash.com/photo-1607472586893-2b1cc3fa5b4e?auto=format&fit=crop&w=500&q=70',
  success1: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=75',
  success2: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=700&q=75',
  success3: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=75',
  success4: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=700&q=75',
  shop: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=500&q=70',
  hardware: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=400&q=70',
  autoparts: 'https://images.unsplash.com/photo-1486262715619-67e5e4db6392?auto=format&fit=crop&w=400&q=70',
};

const isReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -80px 0px' },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as any },
  };
}

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={className} loading="lazy" decoding="async" referrerPolicy="no-referrer" />;
}

function CountUp({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isReduced() || value === 0) { setN(value); return; }
    let raf = 0;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const dur = 1500;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref}>{decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString()}{suffix}</span>;
}

function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [reduce]);
  return <>{children}</>;
}

function AiSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [ph, setPh] = useState(PH[0]);
  useEffect(() => {
    if (isReduced()) return;
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % PH.length; setPh(PH[i]); }, 2800);
    return () => clearInterval(t);
  }, []);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = encodeURIComponent(value.trim() || ph);
    router.push(`/discover?query=${q}`);
  };
  return (
    <form onSubmit={submit} className="relative max-w-2xl">
      <div className="flex items-center gap-2 rounded-full bg-white shadow-card-lift border border-transparent focus-within:border-warm-gold focus-within:ring-4 focus-within:ring-warm-gold/15 transition-all duration-200 px-5 py-3">
        <Search className="w-5 h-5 text-warm-muted shrink-0" />
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={ph} className="flex-1 bg-transparent outline-none text-warm-ink placeholder:text-warm-muted" />
        <Button type="submit" size="sm" className="rounded-full gap-1">Search</Button>
      </div>
    </form>
  );
}

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

function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <motion.div {...reveal()} className="text-center mb-12">
      {kicker && <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-beige text-warm-muted text-sm mb-3"><Sparkles className="w-4 h-4 text-warm-red" />{kicker}</div>}
      <h2 className="text-heading text-3xl md:text-4xl font-bold text-warm-ink">{title}</h2>
      {sub && <p className="text-warm-muted mt-3 max-w-2xl mx-auto">{sub}</p>}
    </motion.div>
  );
}

const HR_PRIORITY = ['skilled-trades','home-services','automotive','construction','repair-maintenance','transportation','security','professional-services','education'];

function CategoryCard({ cat, idx, featured }: { cat: any; idx: number; featured?: boolean }) {
  return (
    <motion.div {...reveal((idx % 4) * 0.05)} className="group">
      <Link href={`/discover?category=${cat.slug}`}>
        <div className={`h-full rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-hover transition-all duration-200 p-6 hover:scale-[1.03] ${featured ? 'bg-gradient-to-br from-warm-beige to-white' : ''}`}>
          <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
          <h3 className={`font-semibold ${featured ? 'text-warm-ink' : 'text-warm-ink'}`}>{cat.name_en}</h3>
          <p className="text-xs text-warm-muted mt-1">{cat.worker_count || cat.job_count || 0} workers available</p>
          <p className="text-xs text-warm-gold mt-0.5">৳{cat.typical_rate_min || 300}–{cat.typical_rate_max || 1500}/hr</p>
          <span className="inline-flex items-center gap-1 mt-3 text-sm text-warm-red font-medium">Explore →</span>
        </div>
      </Link>
    </motion.div>
  );
}

function PremiumWorkerCard({ w, idx = 0, recommended = false }: { w: any; idx?: number; recommended?: boolean }) {
  return (
    <motion.div {...reveal((idx % 4) * 0.05)} className="group shrink-0 w-[300px] sm:w-[340px]">
      <Link href={`/talent/${w.username || w.id}`} className="block">
        <div className="w-full h-[420px] rounded-[28px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden flex flex-col">
          <div className="relative h-[210px] overflow-hidden bg-gradient-to-br from-warm-beige to-warm-cream">
            {w.photo ? <Img src={w.photo} alt={w.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-warm-red/30">{w.name?.charAt(0) || 'W'}</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-xs font-bold text-warm-ink shadow flex items-center gap-1"><Star className="w-3 h-3 fill-warm-gold text-warm-gold" />{w.score}</div>
            {recommended && <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-warm-gold text-warm-ink text-xs font-semibold shadow">Recommended</div>}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-warm-ink text-lg leading-tight">{w.name}</h3>
              {w.verified && <BadgeCheck className="w-4 h-4 text-warm-green shrink-0" />}
            </div>
            <p className="text-sm text-warm-muted mt-0.5">{w.role}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {(w.skills || []).slice(0, 3).map((s: string) => <span key={s} className="px-2 py-0.5 rounded-full bg-warm-beige text-xs text-warm-muted">{s}</span>)}
            </div>
            <div className="mt-auto space-y-3 pt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-warm-muted">{w.location || 'Bangladesh'}</span>
                <span className="font-semibold text-warm-red">৳{w.rate}/hr</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-warm-muted">{w.jobs} jobs done</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${w.availability === 'Available' ? 'bg-warm-green/10 text-warm-green' : 'bg-warm-beige text-warm-muted'}`}>{w.availability}</span>
              </div>
              {w.match != null && <div className="text-xs px-2 py-0.5 rounded-full bg-warm-gold/15 text-warm-ink self-start">{w.match}% AI match</div>}
            </div>
            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <span className="flex-1 text-center text-xs px-3 py-1.5 rounded-full bg-warm-red text-white">View Profile</span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-warm-beige text-warm-ink">Save</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PremiumShopCard({ s, idx = 0 }: { s: any; idx?: number }) {
  return (
    <motion.div {...reveal((idx % 3) * 0.06)} className="group">
      <Link href={`/discover?tab=shops`}>
        <div className="rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-warm-beige to-warm-cream relative overflow-hidden">
            {s.banner ? <Img src={s.banner} alt={s.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Store className="w-8 h-8 text-warm-red/30" /></div>}
            <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-warm-gold text-warm-gold" />{s.score}</div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-warm-ink">{s.name}</h3>
            <p className="text-xs text-warm-muted mt-0.5">{s.category}{s.location ? ` · ${s.location}` : ''}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-warm-muted">{s.products} products</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-warm-green/10 text-warm-green">Verified</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function PremiumProductCard({ p }: { p: any }) {
  return (
    <div className="group shrink-0 w-[220px]">
      <div className="rounded-[20px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-warm-beige to-warm-cream relative overflow-hidden">
          <Img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="p-3">
          <p className="text-xs text-warm-muted">{p.shop}</p>
          <h4 className="text-sm font-medium text-warm-ink truncate">{p.name}</h4>
          <div className="flex items-center justify-between mt-2">
            <span className="font-semibold text-warm-red">৳{p.price}</span>
            <span className="text-xs text-warm-green">{p.stock}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TestimonialSlider({ items }: { items: any[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || isReduced()) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [paused, items.length]);
  const it = items[i];
  return (
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
        <button onClick={() => setI((p) => (p - 1 + items.length) % items.length)} className="w-9 h-9 rounded-full bg-white border border-warm-border flex items-center justify-center text-warm-muted hover:text-warm-red"><ChevronLeft className="w-4 h-4" /></button>
        {items.map((_, idx) => <button key={idx} onClick={() => setI(idx)} className={`w-2.5 h-2.5 rounded-full ${idx === i ? 'bg-warm-red' : 'bg-warm-border'}`} />)}
        <button onClick={() => setI((p) => (p + 1) % items.length)} className="w-9 h-9 rounded-full bg-white border border-warm-border flex items-center justify-center text-warm-muted hover:text-warm-red"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}

function LiveActivityFeed({ items }: { items: any[] }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...items, ...items];
  return (
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
  );
}

function AiMatchSlider({ items }: { items: any[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || isReduced()) return;
    const t = setInterval(() => setI((p) => (p + 1) % items.length), 4500);
    return () => clearInterval(t);
  }, [paused, items.length]);
  const it = items[i];
  return (
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
        {items.map((_, idx) => <button key={idx} onClick={() => setI(idx)} className={`w-2.5 h-2.5 rounded-full ${idx === i ? 'bg-warm-gold' : 'bg-warm-border'}`} />)}
      </div>
    </div>
  );
}

const SHOPS = [
  { id: 's1', name: 'Dhanmondi Hardware Mart', category: 'Hardware', location: 'Dhanmondi', score: '4.8', products: 42, banner: IMG.hardware },
  { id: 's2', name: 'Uttara Auto Parts', category: 'Automotive', location: 'Uttara', score: '4.7', products: 31, banner: IMG.autoparts },
  { id: 's3', name: 'Gulshan Building Supply', category: 'Construction', location: 'Gulshan', score: '4.9', products: 28, banner: IMG.shop },
  { id: 's4', name: 'Banani Paint House', category: 'Painting', location: 'Banani', score: '4.6', products: 19, banner: IMG.shop },
  { id: 's5', name: 'Mirpur Plumbing World', category: 'Plumbing', location: 'Mirpur', score: '4.8', products: 24, banner: IMG.plumber },
  { id: 's6', name: 'Mohakhali Repair Center', category: 'Repair', location: 'Mohakhali', score: '4.7', products: 16, banner: IMG.shop },
];

const PRODUCTS = [
  { id: 'p1', name: 'Cordless Drill 18V', shop: 'Dhanmondi Hardware', price: 3200, stock: 'In stock', image: IMG.hardware },
  { id: 'p2', name: 'Brake Pads Set', shop: 'Uttara Auto Parts', price: 1450, stock: 'In stock', image: IMG.autoparts },
  { id: 'p3', name: 'Cement 50kg Bag', shop: 'Gulshan Building', price: 540, stock: 'In stock', image: IMG.shop },
  { id: 'p4', name: 'Exterior Paint 4L', shop: 'Banani Paint House', price: 2100, stock: 'Low stock', image: IMG.shop },
  { id: 'p5', name: 'PVC Pipe 1 inch', shop: 'Mirpur Plumbing', price: 180, stock: 'In stock', image: IMG.plumber },
  { id: 'p6', name: 'Socket Wrench Kit', shop: 'Dhanmondi Hardware', price: 1850, stock: 'In stock', image: IMG.hardware },
  { id: 'p7', name: 'Engine Oil 4L', shop: 'Uttara Auto Parts', price: 2600, stock: 'In stock', image: IMG.autoparts },
  { id: 'p8', name: 'Tile Adhesive 20kg', shop: 'Gulshan Building', price: 720, stock: 'In stock', image: IMG.shop },
  { id: 'p9', name: 'LED Work Light', shop: 'Mohakhali Repair', price: 950, stock: 'In stock', image: IMG.shop },
  { id: 'p10', name: 'Paint Roller Set', shop: 'Banani Paint House', price: 420, stock: 'In stock', image: IMG.shop },
];

const TESTIMONIALS = [
  { photo: IMG.success1, quote: 'I found three verified electricians in under ten minutes. The trust scores made the choice effortless.', name: 'Rafi Hassan', role: 'Business Owner', result: 'Hired 6 workers this year' },
  { photo: IMG.success2, quote: 'As a tutor, Galaxy Workforce connected me with families I could never reach alone. My income tripled.', name: 'Sara Begum', role: 'Tutor', result: 'Earned ৳1,24,000 in 3 months' },
  { photo: IMG.success3, quote: 'The hardware shop delivered materials same-day. My renovation finished on schedule.', name: 'Karim Sheikh', role: 'Shop Owner', result: '120 orders this month' },
  { photo: IMG.success4, quote: 'We staff our events with trusted people in minutes. No more last-minute chaos.', name: 'Lamia Chowdhury', role: 'Event Manager', result: 'Saved ৳2,00,000 annually' },
];

const ACTIVITY = [
  { text: 'Rafi hired a mechanic in Dhanmondi', time: '2m' },
  { text: 'New job posted: AC Repair in Uttara', time: '5m' },
  { text: 'Cleaner completed 3 jobs today', time: '8m' },
  { text: 'Order: Drill set from Hardware Mart', time: '11m' },
  { text: 'Painter finished a Gulshan apartment', time: '14m' },
  { text: 'New shop joined: Mirpur Plumbing', time: '18m' },
];

const AI_MATCHES = [
  { name: 'Rahim Ahmed', role: 'Electrician', photo: IMG.electrician, match: 96, tags: ['Skills', 'Location', 'Availability', 'Trust 4.9'] },
  { name: 'Karim Hossain', role: 'Mechanic', photo: IMG.mechanic, match: 93, tags: ['Skills', 'Location', 'Trust 4.8', 'Rate'] },
  { name: 'Tanvir Islam', role: 'Construction', photo: IMG.construction, match: 91, tags: ['Skills', 'Availability', 'Trust 4.9'] },
  { name: 'Monir Khan', role: 'Cleaner', photo: IMG.cleaner, match: 89, tags: ['Location', 'Availability', 'Trust 4.7'] },
];

const WORKERS = [
  { id: '1', username: 'rahim-electrician', name: 'Rahim Ahmed', role: 'Electrician · Dhaka', photo: IMG.electrician, score: '4.9', verified: true, rate: 450, jobs: 312, location: 'Dhanmondi · 2km', availability: 'Available', match: 96, skills: ['Wiring', 'Repair', 'Install'] },
  { id: '2', username: 'karim-mechanic', name: 'Karim Hossain', role: 'Mechanic · Chittagong', photo: IMG.mechanic, score: '4.8', verified: true, rate: 500, jobs: 201, location: 'Uttara · 3km', availability: 'Available', match: 93, skills: ['Engine', 'AC', 'Diagnostics'] },
  { id: '3', username: 'sara-tutor', name: 'Sara Begum', role: 'Tutor · Dhaka', photo: IMG.tutor, score: '5.0', verified: true, rate: 600, jobs: 178, location: 'Gulshan · 1km', availability: 'Busy', match: 90, skills: ['Math', 'English', 'Science'] },
  { id: '4', username: 'monir-cleaner', name: 'Monir Khan', role: 'Cleaner · Gazipur', photo: IMG.cleaner, score: '4.7', verified: true, rate: 350, jobs: 430, location: 'Banani · 4km', availability: 'Available', match: 88, skills: ['Deep clean', 'Office', 'Home'] },
  { id: '5', username: 'faisal-driver', name: 'Faisal Rahman', role: 'Driver · Narayanganj', photo: IMG.driver, score: '4.8', verified: false, rate: 400, jobs: 156, location: 'Mohakhali · 5km', availability: 'Available', match: 85, skills: ['Local', 'Long route', 'Moving'] },
  { id: '6', username: 'tanvir-construction', name: 'Tanvir Islam', role: 'Construction · Savar', photo: IMG.construction, score: '4.9', verified: true, rate: 550, jobs: 264, location: 'Savar · 8km', availability: 'Available', match: 92, skills: ['Masonry', 'Tiles', 'Paint'] },
  { id: '7', username: 'nadia-tutor', name: 'Nadia Akter', role: 'Tutor · Uttara', photo: IMG.success3, score: '4.9', verified: true, rate: 650, jobs: 142, location: 'Uttara · 2km', availability: 'Available', match: 90, skills: ['Physics', 'Chemistry'] },
  { id: '8', username: 'sohel-plumber', name: 'Sohel Rana', role: 'Plumber · Mirpur', photo: IMG.plumber, score: '4.6', verified: true, rate: 420, jobs: 198, location: 'Mirpur · 3km', availability: 'Busy', match: 87, skills: ['Leak', 'Fitting', 'Repair'] },
];

const FAQS = [
  { q: 'How does Galaxy Workforce verify workers?', a: 'Every worker is verified through NID, phone number, and admin review before they can accept jobs. Trust scores reflect completed work and client ratings.' },
  { q: 'Can I hire for offline, in-person work?', a: 'Yes. Galaxy Workforce is built for real human workers — from electricians to cleaners. Location-based matching connects you with people near you.' },
  { q: 'How are payments protected?', a: 'Payments are held in escrow and released only after the job is confirmed complete, keeping both clients and workers safe.' },
  { q: 'Can shop owners sell products too?', a: 'Yes. Shop owners list materials and tools, and clients can order them alongside hiring workers — all in one marketplace.' },
];

export default function HomeContent({
  categories,
  stats,
  featuredWorkers,
  activity,
  shops: shopsProp,
  products: productsProp,
}: {
  categories: any[];
  stats?: { verifiedWorkers: number; companies: number; jobsCompleted: number; avgRating: number };
  featuredWorkers?: any[];
  activity?: { text: string; time: string }[];
  shops?: any[];
  products?: any[];
}) {
  const workers = (featuredWorkers && featuredWorkers.length ? featuredWorkers : WORKERS);
  const act = (activity && activity.length ? activity : ACTIVITY);
  const shopList = (shopsProp && shopsProp.length ? shopsProp : SHOPS);
  const productList = (productsProp && productsProp.length ? productsProp : PRODUCTS);
  const hrCats = categories.filter((c) => HR_PRIORITY.includes(c.slug));
  const otherCats = categories.filter((c) => !HR_PRIORITY.includes(c.slug));

  return (
    <SmoothScroll>
    <div className="flex flex-col min-h-screen bg-warm-cream overflow-x-hidden">
      <header className="sticky top-0 z-50 border-b border-warm-border bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-warm-red flex items-center justify-center"><Sparkles className="w-6 h-6 text-white" /></div>
            <span className="text-heading text-xl font-bold">Galaxy Workforce</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/discover" className="hover:text-warm-red">Discover</Link>
            <Link href="/jobs" className="hover:text-warm-red">Find Work</Link>
            <Link href="/discover?tab=shops" className="hover:text-warm-red">Shops</Link>
            <Link href="/pricing" className="hover:text-warm-red">Pricing</Link>
            <Link href="/about" className="hover:text-warm-red">About</Link>
            <Link href="/faq" className="hover:text-warm-red">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link href="/register"><Button size="sm">Get Started</Button></Link>
          </div>
        </div>
      </header>

      {/* Section 1: Hero */}
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
            <div className="mb-8"><AiSearchBar /></div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/client/jobs/new"><Button size="lg" className="gap-2">Hire Human Workers <ArrowRight className="w-4 h-4" /></Button></Link>
              <Link href="/talent-dashboard/jobs"><Button size="lg" variant="secondary" className="gap-2">Find Work <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
          </motion.div>
          <FloatingCards />
        </div>
      </section>

      {/* Section 2: Trust & Safety Bar */}
      <section className="py-14 bg-warm-beige">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { v: (stats?.verifiedWorkers ?? 12450), s: '+', l: 'Verified Workers', icon: <UserCheck className="w-4 h-4" /> },
            { v: (stats?.companies ?? 3280), s: '+', l: 'Companies', icon: <ShieldCheck className="w-4 h-4" /> },
            { v: (stats?.jobsCompleted ?? 87500), s: '+', l: 'Jobs Completed', icon: <BadgeCheck className="w-4 h-4" /> },
            { v: (stats?.avgRating ?? 4.9), s: '/5', l: 'Average Rating', d: 1, icon: <Star className="w-4 h-4" /> },
          ].map((c, i) => (
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

      {/* Section 3: Category Ecosystem (HR priority) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Browse by category" title="Explore the Workforce" sub="Real people for real jobs — trades, services, and local work." />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {hrCats.map((cat, idx) => <CategoryCard key={cat.slug} cat={cat} idx={idx} featured />)}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {otherCats.map((cat, idx) => <CategoryCard key={cat.slug} cat={cat} idx={idx} />)}
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section className="py-20 bg-warm-beige/60">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Simple by design" title="How It Works" />
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-semibold text-warm-red mb-5">For Clients</h3>
              <div className="space-y-4">
                {[['Describe your need', 'Tell the AI what you need in plain language.', IMG.electrician], ['AI matches workers', 'Get matched with verified, available talent.', IMG.mechanic], ['Hire & pay safely', 'Pay through escrow and confirm completion.', IMG.cleaner]].map((s, i) => (
                  <motion.div key={i} {...reveal(i * 0.1)} className="flex items-center gap-4 rounded-[24px] bg-white border border-warm-border shadow-card p-4">
                    <div className="w-10 h-10 rounded-full bg-warm-red text-white flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                    <div className="flex-1"><div className="font-semibold text-warm-ink">{s[0]}</div><div className="text-sm text-warm-muted">{s[1]}</div></div>
                    <Img src={s[2] as string} alt="" className="w-14 h-14 rounded-xl object-cover hidden sm:block" />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-warm-gold mb-5">For Workers & Shops</h3>
              <div className="space-y-4">
                {[['Create your profile', 'Showcase skills or products with verification.', IMG.tutor], ['Get matched', 'Receive jobs that fit your location and skill.', IMG.construction], ['Earn with trust', 'Build your score and grow your income.', IMG.shop]].map((s, i) => (
                  <motion.div key={i} {...reveal(i * 0.1)} className="flex items-center gap-4 rounded-[24px] bg-white border border-warm-border shadow-card p-4">
                    <div className="w-10 h-10 rounded-full bg-warm-gold text-warm-ink flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                    <div className="flex-1"><div className="font-semibold text-warm-ink">{s[0]}</div><div className="text-sm text-warm-muted">{s[1]}</div></div>
                    <Img src={s[2] as string} alt="" className="w-14 h-14 rounded-xl object-cover hidden sm:block" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: AI Matching Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Powered by AI" title="Smart Matching, Made Human" sub="Our AI reads your real needs and surfaces the most trusted workers for the job." />
          <AiMatchSlider items={AI_MATCHES} />
        </div>
      </section>

      {/* Section 6: Featured Human Workers */}
      <section className="py-20 bg-warm-beige/60">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Hand-picked talent" title="Featured Human Workers" sub="Verified, trusted, and ready to help — meet some of our top workers." />
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
            {workers.map((w: any, i: number) => <PremiumWorkerCard key={w.id} w={w} idx={i} recommended={i % 3 === 1} />)}
          </div>
          <div className="text-center mt-8"><Link href="/discover"><Button size="lg" variant="secondary" className="gap-2">Browse All Workers <ArrowRight className="w-4 h-4" /></Button></Link></div>
        </div>
      </section>

      {/* Section 7: Explore Local Shops & Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Local businesses" title="Explore Shops & Products" sub="Trusted shop owners with the materials and tools you need." />
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
            <div>
              <h3 className="text-lg font-semibold text-warm-ink mb-4 flex items-center gap-2"><Store className="w-5 h-5 text-warm-red" /> Featured Shops</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {shopList.map((s, i) => <PremiumShopCard key={s.id} s={s} idx={i} />)}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-warm-ink mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-warm-red" /> Popular Products</h3>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {productList.map((p) => <PremiumProductCard key={p.id} p={p} />)}
              </div>
            </div>
          </div>
          <div className="text-center mt-8"><Link href="/discover?tab=shops"><Button size="lg" className="gap-2">Browse All Shops & Products <ArrowRight className="w-4 h-4" /></Button></Link></div>
        </div>
      </section>

      {/* Section 8: Live Marketplace Activity */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Live on platform" title="Marketplace Activity" />
          <LiveActivityFeed items={act} />
        </div>
      </section>

      {/* Section 9: Success Stories */}
      <section className="py-20 bg-warm-beige/60">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Real outcomes" title="Success Stories" sub="Hear from the people who build, hire, and sell on Galaxy Workforce." />
          <TestimonialSlider items={TESTIMONIALS} />
        </div>
      </section>

      {/* Section 10: Why Galaxy Workforce */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Why us" title="Why Galaxy Workforce" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Users className="w-6 h-6" />, t: 'Real Human Workers', d: 'Every profile is a real, verified person — never bots or automation.' },
              { icon: <Brain className="w-6 h-6" />, t: 'AI That Understands', d: 'Our matching reads intent, not just keywords, to find the right fit.' },
              { icon: <HeartHandshake className="w-6 h-6" />, t: 'Trust & Verification', d: 'NID, phone, and admin checks build confidence on both sides.' },
              { icon: <Globe2 className="w-6 h-6" />, t: 'Online & Offline', d: 'Hire for remote tasks or in-person work with equal safety.' },
            ].map((b, i) => (
              <motion.div key={i} {...reveal(i * 0.08)} className="rounded-[24px] bg-white border border-warm-border shadow-card p-6">
                <div className="w-12 h-12 rounded-2xl bg-warm-gold/15 text-warm-ink flex items-center justify-center mb-4">{b.icon}</div>
                <h3 className="font-semibold text-warm-ink mb-2">{b.t}</h3>
                <p className="text-sm text-warm-muted">{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 11: Pricing Preview */}
      <section className="py-20 bg-warm-beige/60">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Simple pricing" title="Pricing Preview" sub="Start free. Upgrade when you grow." />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: 'Free', feats: ['1 active job', 'Basic AI match', 'Community support'], popular: false },
              { name: 'Growth', price: '৳999/mo', feats: ['10 active jobs', 'Priority AI match', 'Trust badge', 'Escrow support'], popular: true },
              { name: 'Enterprise', price: 'Custom', feats: ['Unlimited jobs', 'Dedicated manager', 'API access', 'SLA'], popular: false },
            ].map((p, i) => (
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

      {/* Section 12: FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionTitle kicker="Questions" title="Frequently Asked Questions" />
          <Accordion type="single" collapsible className="space-y-3">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="rounded-[20px] bg-white border border-warm-border px-5 shadow-card">
                <AccordionTrigger className="text-left font-medium text-warm-ink">{f.q}</AccordionTrigger>
                <AccordionContent className="text-warm-muted">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Section 13: Final CTA */}
      <section className="relative py-24 bg-gradient-to-br from-warm-red to-[#b53d3d] overflow-hidden">
        <div className="container mx-auto px-4 text-center relative">
          <motion.h2 {...reveal()} className="text-heading text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
            Ready to find the right person for any task?
          </motion.h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client/jobs/new"><Button size="lg" variant="secondary" className="gap-2">Hire Human Workers <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/discover?tab=shops"><Button size="lg" className="gap-2 bg-white text-warm-red hover:bg-warm-beige">Find Local Products <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/register"><Button size="lg" className="gap-2 bg-white/15 text-white border border-white/30 hover:bg-white/25">Join as Worker or Shop <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      <footer className="bg-warm-ink text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-warm-red flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
              <span className="text-heading text-lg font-bold">Galaxy Workforce</span>
            </div>
            <p className="text-sm text-white/70">AI-powered human workforce marketplace for Bangladesh and beyond.</p>
          </div>
          <div><h3 className="font-semibold mb-4">Product</h3><ul className="space-y-2 text-sm text-white/70"><li><Link href="/discover" className="hover:text-white">Discover</Link></li><li><Link href="/jobs" className="hover:text-white">Find Work</Link></li><li><Link href="/discover?tab=shops" className="hover:text-white">Shops</Link></li><li><Link href="/pricing" className="hover:text-white">Pricing</Link></li></ul></div>
          <div><h3 className="font-semibold mb-4">Support</h3><ul className="space-y-2 text-sm text-white/70"><li><Link href="/faq" className="hover:text-white">FAQ</Link></li><li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li><li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li></ul></div>
          <div><h3 className="font-semibold mb-4">Contact</h3><ul className="space-y-2 text-sm text-white/70"><li>support@galaxyworkforce.com</li><li>Dhaka, Bangladesh</li></ul></div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">© 2026 Galaxy Workforce. All rights reserved.</div>
      </footer>
    </div>
    </SmoothScroll>
  );
}

