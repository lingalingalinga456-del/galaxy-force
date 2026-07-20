'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const IMG = {
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
  before: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=70',
  after: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=70',
};

export const isReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function reveal(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '0px 0px -80px 0px' },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as any },
  };
}

function fallbackFor(alt: string) {
  const seed = encodeURIComponent((alt || 'galaxy').slice(0, 24));
  return `https://picsum.photos/seed/${seed}/600/400`;
}

export function Img({ src, alt, className, style }: { src: string; alt: string; className?: string; style?: React.CSSProperties }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        const el = e.currentTarget;
        if (el.dataset.fb) return;
        el.dataset.fb = '1';
        el.src = fallbackFor(alt);
      }}
    />
  );
}

export function CountUp({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
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

export function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <motion.div {...reveal()} className="text-center mb-12">
      {kicker && <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-beige text-warm-muted text-sm mb-3"><Sparkles className="w-4 h-4 text-warm-red" />{kicker}</div>}
      <h2 className="text-heading text-3xl md:text-4xl font-bold text-warm-ink">{title}</h2>
      {sub && <p className="text-warm-muted mt-3 max-w-2xl mx-auto">{sub}</p>}
    </motion.div>
  );
}

export const HR_PRIORITY = ['skilled-trades','home-services','automotive','construction','repair-maintenance','transportation','security','professional-services','education'];

export const WORKERS = [
  { id: '1', username: 'rahim-electrician', name: 'Rahim Ahmed', role: 'Electrician · Dhaka', photo: IMG.electrician, score: '4.9', verified: true, rate: 450, jobs: 312, location: 'Dhanmondi · 2km', availability: 'Available', match: 96, skills: ['Wiring','Repair','Install'] },
  { id: '2', username: 'karim-mechanic', name: 'Karim Hossain', role: 'Mechanic · Chittagong', photo: IMG.mechanic, score: '4.8', verified: true, rate: 500, jobs: 201, location: 'Uttara · 3km', availability: 'Available', match: 93, skills: ['Engine','AC','Diagnostics'] },
  { id: '3', username: 'sara-tutor', name: 'Sara Begum', role: 'Tutor · Dhaka', photo: IMG.tutor, score: '5.0', verified: true, rate: 600, jobs: 178, location: 'Gulshan · 1km', availability: 'Busy', match: 90, skills: ['Math','English','Science'] },
  { id: '4', username: 'monir-cleaner', name: 'Monir Khan', role: 'Cleaner · Gazipur', photo: IMG.cleaner, score: '4.7', verified: true, rate: 350, jobs: 430, location: 'Banani · 4km', availability: 'Available', match: 88, skills: ['Deep clean','Office','Home'] },
  { id: '5', username: 'faisal-driver', name: 'Faisal Rahman', role: 'Driver · Narayanganj', photo: IMG.driver, score: '4.8', verified: false, rate: 400, jobs: 156, location: 'Mohakhali · 5km', availability: 'Available', match: 85, skills: ['Local','Long route','Moving'] },
  { id: '6', username: 'tanvir-construction', name: 'Tanvir Islam', role: 'Construction · Savar', photo: IMG.construction, score: '4.9', verified: true, rate: 550, jobs: 264, location: 'Savar · 8km', availability: 'Available', match: 92, skills: ['Masonry','Tiles','Paint'] },
  { id: '7', username: 'nadia-tutor', name: 'Nadia Akter', role: 'Tutor · Uttara', photo: IMG.success3, score: '4.9', verified: true, rate: 650, jobs: 142, location: 'Uttara · 2km', availability: 'Available', match: 90, skills: ['Physics','Chemistry'] },
  { id: '8', username: 'sohel-plumber', name: 'Sohel Rana', role: 'Plumber · Mirpur', photo: IMG.plumber, score: '4.6', verified: true, rate: 420, jobs: 198, location: 'Mirpur · 3km', availability: 'Busy', match: 87, skills: ['Leak','Fitting','Repair'] },
];

export const TEAMS = [
  { id: 't1', name: 'Dhaka Movers Collective', leaderName: 'Karim Uddin', memberCount: 6, rating: '4.8', location: 'Dhaka', category: 'Moving', photo: IMG.driver },
  { id: 't2', name: 'Elite Paint Crew', leaderName: 'Sabbir H.', memberCount: 4, rating: '4.7', location: 'Gulshan', category: 'Painting', photo: IMG.shop },
  { id: 't3', name: 'Pro Electrical Team', leaderName: 'Rana A.', memberCount: 5, rating: '4.9', location: 'Dhanmondi', category: 'Electrical', photo: IMG.electrician },
];

export const SHOPS = [
  { id: 's1', name: 'Dhanmondi Hardware Mart', category: 'Hardware', location: 'Dhanmondi', score: '4.8', products: 42, banner: IMG.hardware },
  { id: 's2', name: 'Uttara Auto Parts', category: 'Automotive', location: 'Uttara', score: '4.7', products: 31, banner: IMG.autoparts },
  { id: 's3', name: 'Gulshan Building Supply', category: 'Construction', location: 'Gulshan', score: '4.9', products: 28, banner: IMG.shop },
  { id: 's4', name: 'Banani Paint House', category: 'Painting', location: 'Banani', score: '4.6', products: 19, banner: IMG.shop },
  { id: 's5', name: 'Mirpur Plumbing World', category: 'Plumbing', location: 'Mirpur', score: '4.8', products: 24, banner: IMG.plumber },
  { id: 's6', name: 'Mohakhali Repair Center', category: 'Repair', location: 'Mohakhali', score: '4.7', products: 16, banner: IMG.shop },
];

export const PRODUCTS = [
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

export const TESTIMONIALS = [
  { photo: IMG.success1, quote: 'I found three verified electricians in under ten minutes. The trust scores made the choice effortless.', name: 'Rafi Hassan', role: 'Business Owner', result: 'Hired 6 workers this year' },
  { photo: IMG.success2, quote: 'As a tutor, Galaxy Workforce connected me with families I could never reach alone. My income tripled.', name: 'Sara Begum', role: 'Tutor', result: 'Earned ৳1,24,000 in 3 months' },
  { photo: IMG.success3, quote: 'The hardware shop delivered materials same-day. My renovation finished on schedule.', name: 'Karim Sheikh', role: 'Shop Owner', result: '120 orders this month' },
  { photo: IMG.success4, quote: 'We staff our events with trusted people in minutes. No more last-minute chaos.', name: 'Lamia Chowdhury', role: 'Event Manager', result: 'Saved ৳2,00,000 annually' },
];

export const ACTIVITY = [
  { text: 'Rafi hired a mechanic in Dhanmondi', time: '2m' },
  { text: 'New job posted: AC Repair in Uttara', time: '5m' },
  { text: 'Cleaner completed 3 jobs today', time: '8m' },
  { text: 'Order: Drill set from Hardware Mart', time: '11m' },
  { text: 'Painter finished a Gulshan apartment', time: '14m' },
  { text: 'New shop joined: Mirpur Plumbing', time: '18m' },
];

export const AI_MATCHES = [
  { name: 'Rahim Ahmed', role: 'Electrician', photo: IMG.electrician, match: 96, tags: ['Skills','Location','Availability','Trust 4.9'] },
  { name: 'Karim Hossain', role: 'Mechanic', photo: IMG.mechanic, match: 93, tags: ['Skills','Location','Trust 4.8','Rate'] },
  { name: 'Tanvir Islam', role: 'Construction', photo: IMG.construction, match: 91, tags: ['Skills','Availability','Trust 4.9'] },
  { name: 'Monir Khan', role: 'Cleaner', photo: IMG.cleaner, match: 89, tags: ['Location','Availability','Trust 4.7'] },
];

export const FAQS = [
  { q: 'How does Galaxy Workforce verify workers?', a: 'Every worker is verified through NID, phone number, and admin review before they can accept jobs. Trust scores reflect completed work and client ratings.' },
  { q: 'Can I hire for offline, in-person work?', a: 'Yes. Galaxy Workforce is built for real human workers — from electricians to cleaners. Location-based matching connects you with people near you.' },
  { q: 'How are payments protected?', a: 'Payments are held in escrow and released only after the job is confirmed complete, keeping both clients and workers safe.' },
  { q: 'Can shop owners sell products too?', a: 'Yes. Shop owners list materials and tools, and clients can order them alongside hiring workers — all in one marketplace.' },
];

export type HomeStats = { verifiedWorkers: number; companies: number; jobsCompleted: number; avgRating: number };
