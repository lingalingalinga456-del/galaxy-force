'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Search, ShieldCheck, BadgeCheck, Star, ChevronLeft, ChevronRight, Phone, FileCheck, UserCheck, Users, Brain, HeartHandshake, Globe2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const PH = ['Need a mechanic nearby?', 'Hire a cleaner today', 'Find a tutor in Dhaka', 'Need help with AC repair'];

const IMG = {
  electrician: 'https://images.unsplash.com/photo-1545259741-2ea3a54f4cfe?auto=format&fit=crop&w=400&q=80',
  mechanic: 'https://images.unsplash.com/photo-1486262715619-67e5e4db6392?auto=format&fit=crop&w=400&q=80',
  tutor: 'https://images.unsplash.com/photo-1503676260728-1c00da0949d1?auto=format&fit=crop&w=400&q=80',
  cleaner: 'https://images.unsplash.com/photo-1581578731548-c2763647dc21?auto=format&fit=crop&w=400&q=80',
  driver: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=400&q=80',
  construction: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80',
  success1: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=700&q=80',
  success2: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=700&q=80',
  success3: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=700&q=80',
  success4: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=700&q=80',
};

const isReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return <img src={src} alt={alt} className={className} loading="lazy" referrerPolicy="no-referrer" />;
}

function CountUp({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isReduced()) { setN(value); return; }
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const dur = 1600;
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(value * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>{decimals ? n.toFixed(decimals) : Math.round(n).toLocaleString()}{suffix}</span>;
}

function AiSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [ph, setPh] = useState(PH[0]);
  useEffect(() => {
    if (isReduced()) return;
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % PH.length; setPh(PH[i]); }, 2600);
    return () => clearInterval(t);
  }, []);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = encodeURIComponent(value.trim() || ph);
    router.push(`/discover?query=${q}`);
  };
  return (
    <form onSubmit={submit} className="relative max-w-2xl">
      <div className="flex items-center gap-2 rounded-full bg-white shadow-card-lift border border-transparent focus-within:border-warm-gold focus-within:ring-4 focus-within:ring-warm-gold/15 transition-all px-5 py-3">
        <Search className="w-5 h-5 text-warm-muted shrink-0" />
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder={ph} className="flex-1 bg-transparent outline-none text-warm-ink placeholder:text-warm-muted" />
        <Button type="submit" size="sm" className="rounded-full gap-1">Search</Button>
      </div>
    </form>
  );
}

function FloatingCards() {
  const reduce = useReducedMotion();
  const float = (delay: number) => reduce ? {} : { animate: { y: [0, -8, 0] }, transition: { duration: 6, repeat: Infinity, ease: 'easeInOut', delay } };
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
      <motion.div {...float(1.5)} className="absolute top-40 -left-2 w-60 rounded-[24px] bg-warm-ink text-white shadow-card-lift p-4">
        <div className="text-xs text-white/60 mb-1">AI Match</div>
        <div className="text-3xl font-bold text-warm-gold">94%</div>
        <div className="text-sm text-white/80 mt-1">Rahim ↔ Your job</div>
        <div className="mt-2 h-1.5 rounded-full bg-white/15 overflow-hidden"><div className="h-full bg-warm-gold" style={{ width: '94%' }} /></div>
      </motion.div>
      <motion.div {...float(3)} className="absolute bottom-0 right-16 w-56 rounded-[24px] bg-white shadow-card-lift p-4 border border-warm-border">
        <div className="text-xs text-warm-muted mb-1">New request</div>
        <div className="text-sm font-medium text-warm-ink">AC Repair · Uttara</div>
        <div className="text-xs text-warm-gold mt-1">3 matches found</div>
      </motion.div>
    </div>
  );
}

function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="text-center mb-12">
      {kicker && <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-beige text-warm-muted text-sm mb-3"><Sparkles className="w-4 h-4 text-warm-red" />{kicker}</div>}
      <h2 className="text-heading text-3xl md:text-4xl font-bold text-warm-ink">{title}</h2>
      {sub && <p className="text-warm-muted mt-3 max-w-2xl mx-auto">{sub}</p>}
    </motion.div>
  );
}

function CategorySlider({ categories }: { categories: any[] }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat, idx) => (
          <motion.div key={cat.slug} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 4) * 0.06 }} className="group">
            <Link href={`/discover?category=${cat.slug}`}>
              <div className="h-full rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-hover transition-all duration-200 p-6 hover:scale-[1.03]">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">{cat.icon}</div>
                <h3 className="font-semibold text-warm-ink">{cat.name_en}</h3>
                <p className="text-xs text-warm-muted mt-1">{cat.worker_count || cat.job_count || 0} workers available</p>
                <p className="text-xs text-warm-gold mt-0.5">৳{cat.typical_rate_min || 300}–{cat.typical_rate_max || 1500}/hr</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm text-warm-red font-medium">Explore →</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WorkerCard({ w }: { w: any }) {
  return (
    <Link href={`/talent/${w.username || w.id}`} className="group shrink-0 w-[300px]">
      <div className="rounded-[32px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.015] overflow-hidden">
        <div className="h-[180px] bg-gradient-to-br from-warm-beige to-warm-cream relative flex items-center justify-center overflow-hidden">
          {w.photo ? <Img src={w.photo} alt={w.name} className="w-full h-full object-cover" /> : (
            <div className="w-20 h-20 rounded-full bg-warm-red/10 flex items-center justify-center text-3xl font-bold text-warm-red">{w.name?.charAt(0) || 'W'}</div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-1 text-xs font-bold text-warm-ink shadow">★ {w.score}</div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-warm-ink">{w.name}</h3>
            {w.verified && <BadgeCheck className="w-4 h-4 text-warm-green" />}
          </div>
          <p className="text-sm text-warm-muted">{w.role}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="font-semibold text-warm-red">৳{w.rate}/hr</span>
            <span className="text-xs text-warm-muted">{w.jobs} jobs</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs px-2 py-0.5 rounded-full bg-warm-green/10 text-warm-green">{w.availability}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-warm-gold/15 text-warm-ink">{w.match}% match</span>
          </div>
          <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs px-3 py-1.5 rounded-full bg-warm-red text-white">View Profile</span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-warm-beige text-warm-ink">Save</span>
          </div>
        </div>
      </div>
    </Link>
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
          <p className="text-lg text-warm-ink mt-3 leading-relaxed">“{it.quote}”</p>
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

const WORKERS = [
  { id: '1', username: 'rahim-electrician', name: 'Rahim Ahmed', role: 'Electrician · Dhaka', photo: IMG.electrician, score: '4.9', verified: true, rate: 450, jobs: 312, availability: 'Available', match: 94 },
  { id: '2', username: 'karim-mechanic', name: 'Karim Hossain', role: 'Mechanic · Chittagong', photo: IMG.mechanic, score: '4.8', verified: true, rate: 500, jobs: 201, availability: 'Available', match: 91 },
  { id: '3', username: 'sara-tutor', name: 'Sara Begum', role: 'Tutor · Dhaka', photo: IMG.tutor, score: '5.0', verified: true, rate: 600, jobs: 178, availability: 'Busy', match: 89 },
  { id: '4', username: 'monir-cleaner', name: 'Monir Khan', role: 'Cleaner · Gazipur', photo: IMG.cleaner, score: '4.7', verified: true, rate: 350, jobs: 430, availability: 'Available', match: 87 },
  { id: '5', username: 'faisal-driver', name: 'Faisal Rahman', role: 'Driver · Narayanganj', photo: IMG.driver, score: '4.8', verified: false, rate: 400, jobs: 156, availability: 'Available', match: 85 },
  { id: '6', username: 'tanvir-construction', name: 'Tanvir Islam', role: 'Construction · Savar', photo: IMG.construction, score: '4.9', verified: true, rate: 550, jobs: 264, availability: 'Available', match: 92 },
  { id: '7', username: 'nadia-tutor', name: 'Nadia Akter', role: 'Tutor · Uttara', photo: IMG.success3, score: '4.9', verified: true, rate: 650, jobs: 142, availability: 'Available', match: 90 },
  { id: '8', username: 'sohel-mechanic', name: 'Sohel Rana', role: 'AC Repair · Mirpur', photo: IMG.mechanic, score: '4.6', verified: true, rate: 480, jobs: 198, availability: 'Busy', match: 88 },
];

const TESTIMONIALS = [
  { photo: IMG.success1, quote: 'I found three verified electricians in under ten minutes. The trust scores made the choice effortless.', name: 'Rafi Hassan', role: 'Business Owner', result: 'Hired 6 workers this year' },
  { photo: IMG.success2, quote: 'As a tutor, Galaxy Workforce connected me with families I could never reach alone. My income tripled.', name: 'Sara Begum', role: 'Tutor', result: 'Earned ৳1,24,000 in 3 months' },
  { photo: IMG.success3, quote: 'The verification gave clients confidence, and the AI matching sent me exactly the right jobs.', name: 'Monir Khan', role: 'Cleaner', result: '430 jobs completed' },
  { photo: IMG.success4, quote: 'We staff our events with trusted people in minutes. No more last-minute chaos.', name: 'Lamia Chowdhury', role: 'Event Manager', result: 'Saved ৳2,00,000 annually' },
];

const ACTIVITY = [
  { text: 'Rafi hired a mechanic in Dhanmondi', time: '2m' },
  { text: 'New job posted: AC Repair in Uttara', time: '5m' },
  { text: 'Cleaner completed 3 jobs today', time: '8m' },
  { text: 'Sara matched with 2 new students', time: '11m' },
  { text: 'Tanvir finished a construction project', time: '14m' },
  { text: 'New company joined: BuildRight Ltd', time: '18m' },
];

const AI_MATCHES = [
  { name: 'Rahim Ahmed', role: 'Electrician', photo: IMG.electrician, match: 96, tags: ['Skills', 'Location', 'Availability', 'Trust 4.9'] },
  { name: 'Karim Hossain', role: 'Mechanic', photo: IMG.mechanic, match: 93, tags: ['Skills', 'Location', 'Trust 4.8', 'Rate'] },
  { name: 'Tanvir Islam', role: 'Construction', photo: IMG.construction, match: 91, tags: ['Skills', 'Availability', 'Trust 4.9'] },
  { name: 'Monir Khan', role: 'Cleaner', photo: IMG.cleaner, match: 89, tags: ['Location', 'Availability', 'Trust 4.7'] },
];

const FAQS = [
  { q: 'How does Galaxy Workforce verify workers?', a: 'Every worker is verified through NID, phone number, and admin review before they can accept jobs. Trust scores reflect completed work and client ratings.' },
  { q: 'Is the AI matching free to use?', a: 'Searching and receiving AI matches is free for clients. Workers create profiles at no cost and only pay when they upgrade their visibility.' },
  { q: 'Can I hire for offline, in-person work?', a: 'Yes. Galaxy Workforce supports both online and offline work, with location-based matching and escrow-protected offline job lifecycles.' },
  { q: 'How are payments protected?', a: 'Payments are held in escrow and released only after the job is confirmed complete, keeping both clients and workers safe.' },
];

export default function HomeContent({
  categories,
  stats,
  featuredWorkers,
  activity,
}: {
  categories: any[];
  stats?: { verifiedWorkers: number; companies: number; jobsCompleted: number; avgRating: number };
  featuredWorkers?: any[];
  activity?: { text: string; time: string }[];
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const meshY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
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
        <motion.div style={{ y: meshY }} className="pointer-events-none absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-warm-gold/10 blur-3xl" />
        <motion.div style={{ y: meshY }} className="pointer-events-none absolute -bottom-40 -left-40 w-[480px] h-[480px] rounded-full bg-warm-red/5 blur-3xl" />
        <div className="container mx-auto px-4 py-20 grid md:grid-cols-[55fr_45fr] gap-12 items-center relative">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-warm-muted text-sm mb-6 shadow-card">
              <Sparkles className="w-4 h-4 text-warm-red" /> AI-powered Human Resource Marketplace
            </div>
            <h1 className="text-heading text-5xl md:text-[64px] font-bold mb-6 leading-[1.1] text-warm-ink">
              Find Trusted Talent.<br />Build Without Limits.
            </h1>
            <p className="text-lg text-warm-muted mb-8 max-w-xl">
              An AI-powered marketplace connecting businesses with verified human workers across Bangladesh and beyond.
            </p>
            <div className="mb-8"><AiSearchBar /></div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/client/jobs/new"><Button size="lg" className="gap-2">Hire Talent <ArrowRight className="w-4 h-4" /></Button></Link>
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
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="flex flex-col items-center text-center rounded-[20px] bg-white/70 border border-warm-border px-4 py-6 shadow-card">
              <div className="w-9 h-9 rounded-full bg-warm-gold/15 text-warm-ink flex items-center justify-center mb-2">{c.icon}</div>
              <div className="text-2xl md:text-3xl font-bold text-warm-ink"><CountUp value={c.v} suffix={c.s} decimals={c.d || 0} /></div>
              <div className="text-sm text-warm-muted mt-1">{c.l}</div>
            </motion.div>
          ))}
        </div>
        <div className="container mx-auto px-4 mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-warm-muted">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-warm-border"><FileCheck className="w-3 h-3 text-warm-green" /> NID Verified</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-warm-border"><Phone className="w-3 h-3 text-warm-green" /> Phone Verified</span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-warm-border"><ShieldCheck className="w-3 h-3 text-warm-green" /> Admin Approved</span>
        </div>
      </section>

      {/* Section 3: Category Ecosystem */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Browse by category" title="Explore the Workforce" sub="From skilled trades to digital services — find the right person for any job." />
          <CategorySlider categories={categories} />
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
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="flex items-center gap-4 rounded-[24px] bg-white border border-warm-border shadow-card p-4">
                    <div className="w-10 h-10 rounded-full bg-warm-red text-white flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                    <div className="flex-1"><div className="font-semibold text-warm-ink">{s[0]}</div><div className="text-sm text-warm-muted">{s[1]}</div></div>
                    <Img src={s[2] as string} alt="" className="w-14 h-14 rounded-xl object-cover hidden sm:block" />
                  </motion.div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-warm-gold mb-5">For Workers</h3>
              <div className="space-y-4">
                {[['Create your profile', 'Showcase your skills with verification.', IMG.tutor], ['Get matched', 'Receive jobs that fit your location and skill.', IMG.construction], ['Earn with trust', 'Build your score and grow your income.', IMG.driver]].map((s, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }} className="flex items-center gap-4 rounded-[24px] bg-white border border-warm-border shadow-card p-4">
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

      {/* Section 6: Featured Workforce */}
      <section className="py-20 bg-warm-beige/60">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Hand-picked talent" title="Featured Workforce" sub="Verified, trusted, and ready to help — meet some of our top workers." />
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
            {(featuredWorkers && featuredWorkers.length ? featuredWorkers : WORKERS).map((w: any) => <div key={w.id} className="snap-start"><WorkerCard w={w} /></div>)}
          </div>
          <div className="text-center mt-8"><Link href="/discover"><Button size="lg" variant="secondary" className="gap-2">View All Talent <ArrowRight className="w-4 h-4" /></Button></Link></div>
        </div>
      </section>

      {/* Section 7: Live Marketplace Activity */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Live on platform" title="Marketplace Activity" />
          <LiveActivityFeed items={activity && activity.length ? activity : ACTIVITY} />
        </div>
      </section>

      {/* Section 8: Success Stories */}
      <section className="py-20 bg-warm-beige/60">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Real outcomes" title="Success Stories" sub="Hear from the people who build and hire on Galaxy Workforce." />
          <TestimonialSlider items={TESTIMONIALS} />
        </div>
      </section>

      {/* Section 9: Why Galaxy Workforce */}
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
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className="rounded-[24px] bg-white border border-warm-border shadow-card p-6">
                <div className="w-12 h-12 rounded-2xl bg-warm-gold/15 text-warm-ink flex items-center justify-center mb-4">{b.icon}</div>
                <h3 className="font-semibold text-warm-ink mb-2">{b.t}</h3>
                <p className="text-sm text-warm-muted">{b.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Pricing Preview */}
      <section className="py-20 bg-warm-beige/60">
        <div className="container mx-auto px-4">
          <SectionTitle kicker="Simple pricing" title="Pricing Preview" sub="Start free. Upgrade when you grow." />
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: 'Free', feats: ['1 active job', 'Basic AI match', 'Community support'], popular: false },
              { name: 'Growth', price: '৳999/mo', feats: ['10 active jobs', 'Priority AI match', 'Trust badge', 'Escrow support'], popular: true },
              { name: 'Enterprise', price: 'Custom', feats: ['Unlimited jobs', 'Dedicated manager', 'API access', 'SLA'], popular: false },
            ].map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }} className={`relative rounded-[28px] border p-7 hover:scale-[1.015] transition-transform duration-200 ${p.popular ? 'border-warm-red shadow-card-lift bg-white' : 'border-warm-border bg-white shadow-card'}`}>
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

      {/* Section 11: FAQ */}
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

      {/* Section 12: Final CTA */}
      <section className="relative py-24 bg-gradient-to-br from-warm-red to-[#b53d3d] overflow-hidden">
        {!reduce && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(14)].map((_, i) => <motion.span key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white/30" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }} animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 5 + (i % 5), repeat: Infinity, ease: 'easeInOut' }} />)}
          </div>
        )}
        <div className="container mx-auto px-4 text-center relative">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-heading text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
            Ready to find the right person for any task?
          </motion.h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/client/jobs/new"><Button size="lg" variant="secondary" className="gap-2">Start Hiring <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/register"><Button size="lg" className="gap-2 bg-white text-warm-red hover:bg-warm-beige">Join as a Worker <ArrowRight className="w-4 h-4" /></Button></Link>
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
          <div><h3 className="font-semibold mb-4">Product</h3><ul className="space-y-2 text-sm text-white/70"><li><Link href="/discover" className="hover:text-white">Discover</Link></li><li><Link href="/jobs" className="hover:text-white">Find Work</Link></li><li><Link href="/pricing" className="hover:text-white">Pricing</Link></li><li><Link href="/about" className="hover:text-white">About</Link></li></ul></div>
          <div><h3 className="font-semibold mb-4">Support</h3><ul className="space-y-2 text-sm text-white/70"><li><Link href="/faq" className="hover:text-white">FAQ</Link></li><li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li><li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li></ul></div>
          <div><h3 className="font-semibold mb-4">Contact</h3><ul className="space-y-2 text-sm text-white/70"><li>support@galaxyworkforce.com</li><li>Dhaka, Bangladesh</li></ul></div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">© 2026 Galaxy Workforce. All rights reserved.</div>
      </footer>
    </div>
  );
}
