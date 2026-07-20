'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, BadgeCheck, Store, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchWithSuggestions } from '@/components/search/SearchWithSuggestions';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { MobileBottomNav } from '@/components/design-system/MobileBottomNav';

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        const el = e.currentTarget;
        if (el.dataset.fb) return;
        el.dataset.fb = '1';
        el.src = `https://picsum.photos/seed/${encodeURIComponent((alt || 'gw').slice(0, 20))}/600/400`;
      }}
    />
  );
}

const SORTS = ['Best Match', 'Nearest', 'Trust Score', 'Price Low to High'];

const PLACEHOLDERS = [
  'Need an electrician in Uttara',
  'AC repair near me',
  'Hire a house cleaner today',
  'Find a math tutor in Dhaka',
  'Need a truck and movers',
];

type Props = {
  categories: { slug: string; name_en: string; icon?: string }[];
  realWorkers: any[];
  realTeams: any[];
  realShops: any[];
  realProducts: any[];
};

export function DiscoverClient({ categories, realWorkers, realTeams, realShops, realProducts }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const q = params.get('q') || '';
  const type = params.get('type') || 'all';
  const category = params.get('category') || '';
  const situation = params.get('situation') || '';
  const sort = params.get('sort') || 'Best Match';
  const trust = Number(params.get('trust') || 0);
  const dist = Number(params.get('dist') || 50);
  const minPrice = Number(params.get('min_price') || 0);
  const maxPrice = Number(params.get('max_price') || 5000);

  const [ph, setPh] = useState(PLACEHOLDERS[0]);
  const [avail, setAvail] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPh(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]), 2800);
    return () => clearInterval(t);
  }, []);

  // Merge real + demo data
  const workers = useMemo(() => (realWorkers && realWorkers.length ? realWorkers : mergeDemoWorkers()), [realWorkers]);
  const teams = useMemo(() => (realTeams && realTeams.length ? realTeams : mergeDemoTeams()), [realTeams]);
  const shops = useMemo(() => (realShops && realShops.length ? realShops : mergeDemoShops()), [realShops]);
  const products = useMemo(() => (realProducts && realProducts.length ? realProducts : mergeDemoProducts()), [realProducts]);

  function sync(next: Record<string, string>) {
    const p = new URLSearchParams(Array.from(params.entries()));
    Object.entries(next).forEach(([k, v]) => { if (v) p.set(k, v); else p.delete(k); });
    router.push(`/discover?${p.toString()}`);
  }

  // Filtering
  const filteredWorkers = useMemo(() => filterWorkers(workers, { q, category, situation, avail, verifiedOnly, trust, dist, minPrice, maxPrice, sort }), [workers, q, category, situation, avail, verifiedOnly, trust, dist, minPrice, maxPrice, sort]);
  const filteredTeams = useMemo(() => (type === 'all' || type === 'team') ? teams.filter((t: any) => matchesText(t.name + ' ' + (t.category || ''), q)) : [], [teams, type, q]);
  const filteredShops = useMemo(() => (type === 'all' || type === 'shop') ? shops.filter((s: any) => matchesText(s.name + ' ' + (s.category || ''), q)) : [], [shops, type, q]);
  const filteredProducts = useMemo(() => (type === 'all' || type === 'shop') ? products.filter((p: any) => matchesText(p.name + ' ' + (p.category || ''), q)) : [], [products, type, q]);

  const showWorkers = type === 'all' || type === 'individual';
  const showTeams = type === 'all' || type === 'team';
  const showShops = type === 'all' || type === 'shop';
  const showBusinesses = type === 'all' || type === 'business';

  // LeadScrape fallback: few strong matches or low score
  const totalResults = filteredWorkers.length + filteredTeams.length + filteredShops.length;
  const leadScore = q ? Math.max(0, 100 - filteredWorkers.length * 8 - (filteredTeams.length + filteredShops.length) * 5) : 100;
  const showFallback = (q && (totalResults < 3 || leadScore < 35));

  return (
    <div className="min-h-screen bg-warm-cream pb-20 md:pb-0">
      <SiteHeader />
      {/* Hero + AI Search */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-warm-cream to-warm-beige">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-warm-muted text-sm mb-4 shadow-card"><Search className="w-4 h-4 text-warm-red" /> AI-powered Human Resource Marketplace</span>
          <h1 className="text-heading text-4xl md:text-5xl font-bold mb-3 text-warm-ink">Discover Nearby Human Workforce</h1>
          <p className="text-warm-muted max-w-2xl mx-auto mb-6">Search 1,200+ verified tradesmen, physical repair teams, and local shops near you.</p>
          <div className="max-w-2xl mx-auto">
            <SearchWithSuggestions scope="all" defaultValue={q} placeholder={ph} size="lg" />
            <p className="text-xs text-warm-muted mt-2">Supports English + বাংলা · start typing for live suggestions</p>
          </div>
        </div>
      </section>

      {/* View Type Toggle */}
      <section className="border-y border-warm-border bg-white sticky top-[64px] z-30">
        <div className="container mx-auto px-4 flex gap-2 overflow-x-auto py-3 flex-nowrap justify-center">
          {[['all','All Entities'],['individual','Individuals'],['team','Teams'],['shop','Shops'],['business','Businesses']].map(([v, label]) => (
            <button key={v} onClick={() => sync({ type: v === 'all' ? '' : v })} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${type === v ? 'bg-warm-red text-white' : 'bg-warm-cream text-warm-muted hover:text-warm-red'}`}>{label}</button>
          ))}
        </div>
      </section>

      {/* Category Canvas */}
      <CategoryCanvas
        activeCategory={category}
        activeSituation={situation}
        onPickCategory={(slug: string) => sync({ category: slug, situation: '' })}
        onPickSub={(sub: string) => sync({ q: sub, category: '', situation: '' })}
        onClear={() => sync({ category: '', situation: '' })}
        onPickSituation={(slug: string) => sync({ situation: slug, category: '' })}
      />

      {/* Body */}
      <section className="py-10">
        <div className="container mx-auto px-4 grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <Sidebar sort={sort} trust={trust} dist={dist} minPrice={minPrice} maxPrice={maxPrice} avail={avail} verifiedOnly={verifiedOnly}
              onSort={(v: string) => sync({ sort: v })} onTrust={(v: string) => sync({ trust: String(v) })} onDist={(v: string) => sync({ dist: String(v) })}
              onMin={(v: number) => sync({ min_price: String(v) })} onMax={(v: number) => sync({ max_price: String(v) })} onAvail={setAvail} onVerified={() => setVerifiedOnly((p) => !p)} onClear={clearAll} />
          </aside>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-warm-muted">{totalResults} results{showFallback ? ' + external leads' : ''}</p>
              <button onClick={() => setMobileFilters(true)} className="lg:hidden inline-flex items-center gap-2 rounded-full border border-warm-border px-4 py-2 text-sm"><SlidersHorizontal className="w-4 h-4" /> Filters</button>
            </div>

            {showWorkers && filteredWorkers.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
                {filteredWorkers.map((w: any, i: number) => <WorkerResultCard key={w.id} w={w} idx={i} />)}
              </div>
            )}
            {showTeams && filteredTeams.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-warm-ink mb-3">Teams</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredTeams.map((t: any, i: number) => <TeamResultCard key={t.id} t={t} idx={i} />)}
                </div>
              </div>
            )}
            {showShops && filteredShops.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-warm-ink mb-3">Shops</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredShops.map((s: any, i: number) => <ShopResultCard key={s.id} s={s} idx={i} />)}
                </div>
              </div>
            )}
            {showShops && filteredProducts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-warm-ink mb-3">Products</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredProducts.map((p: any, i: number) => <ProductResultCard key={p.id} p={p} idx={i} />)}
                </div>
              </div>
            )}
            {showBusinesses && <BusinessNote />}

            {totalResults === 0 && !showFallback && (
              <div className="text-center py-16">
                <p className="text-warm-muted mb-4">No matches found. Try a different category or search.</p>
                <Button variant="secondary" onClick={clearAll}>Clear filters</Button>
              </div>
            )}

            {showFallback && <LeadScrapeFallback />}
          </div>
        </div>
      </section>

      <MobileFilterSheet open={mobileFilters} onClose={() => setMobileFilters(false)} sort={sort} trust={trust} dist={dist}
        onSort={(v: string) => sync({ sort: v })} onTrust={(v: string) => sync({ trust: String(v) })} onDist={(v: string) => sync({ dist: String(v) })} onClear={clearAll} />

      <SiteFooter />
      <MobileBottomNav />
    </div>
  );

  function clearAll() {
    router.push('/discover');
    setAvail('all');
    setVerifiedOnly(false);
  }
}

// ---- data refs ----
import { SITUATIONS, buildDemoWorkers, buildDemoTeams, buildDemoShops, buildDemoProducts } from '@/lib/discover-data';
const SITUATIONS_LIST = SITUATIONS;

type MainCat = { slug: string; emoji: string; name: string; trades: string[]; subcategories: string[]; priority: 'High' | 'Medium' | 'Low' };
const MAIN_CATS: MainCat[] = [
  { slug: 'skilled-trades', emoji: '🔧', name: 'Skilled Trades', trades: ['skilled-trades', 'repair-maintenance'], subcategories: ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'Mason', 'Tile Setter', 'Painter'], priority: 'High' },
  { slug: 'home-services', emoji: '🏠', name: 'Home Services', trades: ['home-services'], subcategories: ['House Cleaning', 'AC Repair', 'Deep Cleaning', 'Appliance Repair', 'Pest Control', 'Gardening'], priority: 'High' },
  { slug: 'automotive-repair', emoji: '🚗', name: 'Automotive & Repair', trades: ['automotive'], subcategories: ['Car Mechanic', 'Bike Mechanic', 'Battery Replacement', 'Tyre Service', 'Towing', 'Car Wash'], priority: 'High' },
  { slug: 'construction-renovation', emoji: '🏗️', name: 'Construction & Renovation', trades: ['construction', 'manufacturing'], subcategories: ['General Construction', 'Interior Renovation', 'Flooring', 'Roofing', 'Electrical Work', 'Plumbing Work'], priority: 'High' },
  { slug: 'transportation-moving', emoji: '🚚', name: 'Transportation & Moving', trades: ['transportation'], subcategories: ['Car Driver', 'Truck Driver', 'House Moving', 'Office Shifting', 'Delivery', 'Logistics'], priority: 'High' },
  { slug: 'security-safety', emoji: '🛡️', name: 'Security & Safety', trades: ['security'], subcategories: ['Security Guard', 'CCTV Installation', 'Locksmith', 'Fire Safety', 'Alarm System'], priority: 'Medium' },
  { slug: 'professional-services', emoji: '💼', name: 'Professional Services', trades: ['professional-services', 'business-services'], subcategories: ['Accountant', 'Lawyer', 'Business Consultant', 'HR Consultant', 'Tax Advisor'], priority: 'Medium' },
  { slug: 'education-tutoring', emoji: '📚', name: 'Education & Tutoring', trades: ['education'], subcategories: ['Home Tutor', 'Online Tutor', 'Exam Coaching', 'Language Teacher', 'Music Teacher'], priority: 'Medium' },
  { slug: 'healthcare-wellness', emoji: '⚕️', name: 'Healthcare & Wellness', trades: ['healthcare', 'beauty-wellness'], subcategories: ['Home Nurse', 'Caregiver', 'Physiotherapist', 'Massage Therapist', 'Yoga Trainer'], priority: 'Medium' },
  { slug: 'hospitality-events', emoji: '🍽️', name: 'Hospitality & Events', trades: ['hospitality', 'event-services'], subcategories: ['Event Staff', 'Catering', 'Wedding Services', 'Bartender', 'Event Photographer'], priority: 'Low' },
  { slug: 'retail-local-shops', emoji: '🛍️', name: 'Retail & Local Shops', trades: ['retail', 'agriculture'], subcategories: ['Hardware Store', 'Auto Parts', 'Electrical Parts', 'Tools & Equipment', 'Building Materials'], priority: 'Medium' },
  { slug: 'emergency-services', emoji: '🚨', name: 'Emergency Services', trades: ['skilled-trades', 'automotive', 'security'], subcategories: ['Emergency Plumber', 'Emergency Electrician', 'Emergency Mechanic', 'Urgent Locksmith', '24/7 Towing'], priority: 'High' },
];

function matchesText(hay: string, q: string) { if (!q) return true; return hay.toLowerCase().includes(q.toLowerCase()); }

function filterWorkers(list: any[], f: any) {
  let r = list;
  if (f.category) {
    const mc = MAIN_CATS.find((c) => c.slug === f.category);
    const trades = mc ? mc.trades : [f.category];
    r = r.filter((w: any) => trades.includes(w.category));
  }
  if (f.situation && f.q) r = r.filter((w: any) => matchesText(w.role + ' ' + (w.skills || []).join(' '), f.q));
  if (f.q) r = r.filter((w: any) => matchesText(w.name + ' ' + w.role + ' ' + (w.skills || []).join(' '), f.q));
  if (f.avail !== 'all') r = r.filter((w: any) => (w.availability || '').toLowerCase().includes(f.avail === 'available' ? 'available' : f.avail === 'emergency' ? 'emergency' : f.avail === 'appointment' ? 'appt' : 'busy'));
  if (f.verifiedOnly) r = r.filter((w: any) => w.verified);
  if (f.trust) r = r.filter((w: any) => Number(w.score) >= f.trust);
  if (f.dist < 50) r = r.filter((w: any) => Number(w.distance || 50) <= f.dist);
  if (f.minPrice) r = r.filter((w: any) => Number(w.rate) >= f.minPrice);
  if (f.maxPrice < 5000) r = r.filter((w: any) => Number(w.rate) <= f.maxPrice);
  const sort = f.sort;
  if (sort === 'Trust Score') r = [...r].sort((a: any, b: any) => Number(b.score) - Number(a.score));
  else if (sort === 'Nearest') r = [...r].sort((a: any, b: any) => Number(a.distance) - Number(b.distance));
  else if (sort === 'Price Low to High') r = [...r].sort((a: any, b: any) => Number(a.rate) - Number(b.rate));
  else r = [...r].sort((a: any, b: any) => Number(b.match) - Number(a.match));
  return r;
}

function mergeDemoWorkers() { try { return buildDemoWorkers(); } catch { return []; } }
function mergeDemoTeams() { try { return buildDemoTeams(); } catch { return []; } }
function mergeDemoShops() { try { return buildDemoShops(); } catch { return []; } }
function mergeDemoProducts() { try { return buildDemoProducts(); } catch { return []; } }

// ---- Category Canvas (v2.2: 12 main cats + hover/tap subcategories) ----
function CategoryCanvas({ activeCategory, activeSituation, onPickCategory, onPickSub, onClear, onPickSituation }: any) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = (slug: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setHovered(slug); };
  const scheduleClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setHovered(null), 120); };

  const isActive = (slug: string) => activeCategory === slug || (hovered === slug) || (tapped === slug);

  return (
    <section className="py-6 bg-warm-beige/60">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onMouseEnter={() => open('')}
            onClick={onClear}
            className={`relative z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition-all ${!activeCategory && !activeSituation ? 'bg-warm-red text-white border-warm-red' : 'bg-white text-warm-ink border-warm-border hover:border-warm-red hover:text-warm-red'}`}
          >All</button>
          {MAIN_CATS.map((cat) => {
            const active = isActive(cat.slug);
            return (
              <div key={cat.slug} className="relative" onMouseEnter={() => open(cat.slug)} onMouseLeave={scheduleClose}>
                <button
                  onClick={() => { onPickCategory(cat.slug); setTapped(null); }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition-all ${activeCategory === cat.slug ? 'bg-warm-red text-white border-warm-red' : 'bg-white text-warm-ink border-warm-border hover:border-warm-red hover:text-warm-red'}`}
                >
                  <span>{cat.emoji}</span> {cat.name}
                </button>
                {/* Subcategory popover (hover desktop / tap mobile) */}
                {active && cat.subcategories.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-60 rounded-2xl bg-white border border-warm-border shadow-card-lift p-3"
                    onMouseEnter={() => open(cat.slug)}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="text-xs font-semibold text-warm-muted mb-2 px-1">{cat.name} · Subcategories</div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub}
                          onClick={() => { onPickSub(sub); setTapped(null); setHovered(null); }}
                          className="text-xs px-2.5 py-1 rounded-full border border-warm-border bg-warm-cream text-warm-ink hover:border-warm-gold hover:bg-warm-beige transition-colors"
                        >{sub}</button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mobile tap expansion */}
        {tapped && (
          <div className="lg:hidden mt-3 flex flex-wrap gap-1.5 justify-center">
            {MAIN_CATS.find((c) => c.slug === tapped)?.subcategories.map((sub) => (
              <button key={sub} onClick={() => { onPickSub(sub); setTapped(null); }} className="text-xs px-2.5 py-1 rounded-full border border-warm-border bg-white text-warm-ink hover:border-warm-gold">{sub}</button>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 justify-center mt-3">
          {SITUATIONS_LIST.map((s) => (
            <button key={s.slug} onClick={() => { onPickSituation(s.slug); setTapped(null); }} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition-all ${activeSituation === s.slug ? 'bg-warm-gold text-warm-ink border-warm-gold' : 'bg-white text-warm-ink border-warm-border hover:border-warm-gold hover:text-warm-ink'}`}>{s.icon} {s.label}</button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---- Header / Footer ----
// Header/Footer come from shared SiteHeader/SiteFooter

// ---- Cards ----
function WorkerResultCard({ w, idx = 0 }: { w: any; idx?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 3) * 0.05 }} className="group">
      <Link href={`/talent/${w.username || w.id}`} className="block">
        <div className="rounded-[28px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden flex flex-col">
          <div className="relative h-[180px] overflow-hidden bg-gradient-to-br from-warm-beige to-warm-cream">
            {w.photo ? <Img src={w.photo} alt={w.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-warm-red/30">{w.name?.charAt(0)}</div>}
            <div className="absolute top-3 right-3 bg-white/90 rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-warm-gold text-warm-gold" />{w.score}</div>
            {w.verified && <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-warm-green/90 text-white text-xs">NID ✓</div>}
          </div>
          <div className="p-4 flex flex-col flex-1">
            <div className="flex items-center gap-1.5"><h3 className="font-semibold text-warm-ink">{w.name}</h3>{w.verified && <BadgeCheck className="w-4 h-4 text-warm-green" />}</div>
            <p className="text-sm text-warm-muted mt-0.5">{w.role}</p>
            <p className="text-xs text-warm-muted mt-1">{w.location || 'Bangladesh'} · {w.distance}km</p>
            <div className="mt-auto flex items-center justify-between pt-3 text-sm">
              <span className="font-semibold text-warm-red">৳{w.rate}/hr</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${w.availability === 'Available' ? 'bg-warm-green/10 text-warm-green' : w.availability === 'Emergency' ? 'bg-warm-red/10 text-warm-red' : 'bg-warm-beige text-warm-muted'}`}>{w.availability}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function TeamResultCard({ t, idx = 0 }: { t: any; idx?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 3) * 0.05 }} className="group">
      <Link href="/discover?type=team" className="block">
        <div className="rounded-[28px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden">
          <div className="h-[140px] overflow-hidden bg-gradient-to-br from-warm-gold/20 to-warm-beige"><Img src={t.photo} alt={t.name} className="w-full h-full object-cover" /></div>
          <div className="p-4">
            <span className="px-2 py-0.5 rounded-full bg-warm-gold/15 text-xs font-medium text-warm-ink">Team</span>
            <h3 className="font-semibold text-warm-ink mt-2">{t.name}</h3>
            <p className="text-sm text-warm-muted mt-0.5">{t.category} · {t.location}</p>
            <p className="text-xs text-warm-muted mt-1">Led by {t.leaderName} · {t.memberCount} members</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ShopResultCard({ s, idx = 0 }: { s: any; idx?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 3) * 0.05 }} className="group">
      <Link href="/shops" className="block">
        <div className="rounded-[28px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden">
          <div className="h-[120px] overflow-hidden bg-gradient-to-br from-warm-beige to-warm-cream"><Img src={s.banner} alt={s.name} className="w-full h-full object-cover" /></div>
          <div className="p-4">
            <div className="flex items-center gap-2"><Store className="w-4 h-4 text-warm-red" /><h3 className="font-semibold text-warm-ink">{s.name}</h3></div>
            <p className="text-sm text-warm-muted mt-0.5">{s.category} · {s.location}</p>
            <p className="text-xs text-warm-gold mt-1 flex items-center gap-1"><Star className="w-3 h-3 fill-warm-gold" />{s.score} · {s.products} products</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductResultCard({ p, idx = 0 }: { p: any; idx?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 4) * 0.04 }} className="group">
      <div className="rounded-[20px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all overflow-hidden">
        <div className="h-28 overflow-hidden bg-gradient-to-br from-warm-beige to-warm-cream"><Img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div className="p-3">
          <p className="text-xs text-warm-muted">{p.shop}</p>
          <h4 className="text-sm font-medium text-warm-ink truncate">{p.name}</h4>
          <span className="font-semibold text-warm-red">৳{Number(p.price).toLocaleString()}</span>
        </div>
      </div>
    </motion.div>
  );
}

function BusinessNote() {
  return (
    <div className="rounded-[24px] bg-white border border-warm-border shadow-card p-8 text-center">
      <h3 className="font-semibold text-warm-ink mb-2">Businesses & Agencies</h3>
      <p className="text-sm text-warm-muted max-w-md mx-auto">Verified companies post bulk jobs and manage teams. <Link href="/register?role=client" className="text-warm-red font-medium">Register your business →</Link></p>
    </div>
  );
}

// ---- Sidebar Filters ----
function Sidebar({ sort, trust, dist, minPrice, maxPrice, avail, verifiedOnly, onSort, onTrust, onDist, onMin, onMax, onAvail, onVerified, onClear }: any) {
  return (
    <div className="sticky top-[128px] space-y-5">
      <div className="rounded-[24px] bg-white border border-warm-border shadow-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-warm-ink">Filters</h3>
          <button onClick={onClear} className="text-xs text-warm-red font-medium">Clear all</button>
        </div>
        <div className="space-y-5">
          <div>
            <label className="text-sm text-warm-muted">Sort by</label>
            <select value={sort} onChange={(e) => onSort(e.target.value)} className="mt-1 w-full rounded-xl border border-warm-border px-3 py-2 text-sm bg-warm-cream">
              {SORTS.map((s: any) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-warm-muted">Availability</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {[['all','Any'],['available','Available'],['emergency','Emergency'],['appointment','By Appt'],['busy','Busy']].map(([v, lbl]: any) => (
                <button key={v} onClick={() => onAvail(v)} className={`text-xs px-2.5 py-1 rounded-full border ${avail === v ? 'bg-warm-red text-white border-warm-red' : 'border-warm-border text-warm-muted'}`}>{lbl}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-warm-muted">Min Trust Score: <span className="text-warm-ink font-medium">{trust}</span></label>
            <input type="range" min={0} max={5} step={0.1} value={trust} onChange={(e) => onTrust(Number(e.target.value).toFixed(1))} className="mt-1 w-full accent-warm-red" />
          </div>
          <div>
            <label className="text-sm text-warm-muted">Distance: <span className="text-warm-ink font-medium">{dist}km</span></label>
            <input type="range" min={1} max={50} value={dist} onChange={(e) => onDist(Number(e.target.value))} className="mt-1 w-full accent-warm-red" />
          </div>
          <div>
            <label className="text-sm text-warm-muted">Hourly Budget (৳)</label>
            <div className="flex items-center gap-2 mt-1">
              <input type="number" value={minPrice} onChange={(e) => onMin(Number(e.target.value))} className="w-full rounded-xl border border-warm-border px-2 py-1.5 text-sm bg-warm-cream" />
              <span className="text-warm-muted">–</span>
              <input type="number" value={maxPrice} onChange={(e) => onMax(Number(e.target.value))} className="w-full rounded-xl border border-warm-border px-2 py-1.5 text-sm bg-warm-cream" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={verifiedOnly} onChange={onVerified} className="accent-warm-red" /> Verified only (NID / Admin)
          </label>
        </div>
      </div>
    </div>
  );
}

// ---- LeadScrape Fallback ----
function LeadScrapeFallback() {
  const leads = buildLeadScrapeLeads();
  return (
    <div className="mt-10 rounded-[28px] border-2 border-dashed border-warm-gold bg-warm-gold/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-warm-ink flex items-center gap-2"><ExternalLink className="w-5 h-5 text-warm-gold" /> No exact verified matches on Galaxy Workforce?</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-warm-gold/20 text-warm-ink font-medium">LeadScrape Pro Fallback</span>
      </div>
      <p className="text-sm text-warm-muted mb-4">We searched external listings via LeadScrape Pro. These are simulated external leads and are not yet verified on Galaxy Workforce.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {leads.map((l: any, i: number) => (
          <div key={l.id} className="rounded-[20px] bg-white border border-warm-border p-4 opacity-90">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-warm-ink">{l.name}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-warm-gold/20 text-warm-ink">Simulated External Lead</span>
            </div>
            <p className="text-xs text-warm-muted mt-1">{l.location} · est. ৳{l.rate}/task</p>
            <p className="text-xs text-warm-gold mt-2 flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {l.source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
function buildLeadScrapeLeads() {
  const roles = ['Generator Repair','Sofa Upholstery','CCTV Installation','Solar Panel Fix','Water Tank Clean','Furniture Assembly','Glass Work','Pest Control','Waterproofing','Gate Fabrication','Inverter Service','Deep Well Pump','Marble Polish','Aluminium Work','Sound System Rent'];
  const loc = ['Dhanmondi','Uttara','Gulshan','Banani','Mirpur','Mohakhali','Savar','Chittagong','Sylhet'];
  return roles.map((r, i) => ({ id: `lead-${i + 1}`, name: r, location: loc[i % loc.length], rate: 400 + (i * 37) % 1600, source: 'LeadScrape Pro' }));
}

// ---- Mobile Filter Bottom Sheet ----
function MobileFilterSheet({ open, onClose, sort, trust, dist, onSort, onTrust, onDist, onClear }: any) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={onClose}>
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="absolute bottom-0 left-0 right-0 bg-warm-cream rounded-t-[28px] p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-warm-ink">Filters</h3>
              <button onClick={onClose}><X className="w-5 h-5 text-warm-muted" /></button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm text-warm-muted">Sort by</label>
                <select value={sort} onChange={(e) => onSort(e.target.value)} className="mt-1 w-full rounded-xl border border-warm-border px-3 py-2 text-sm bg-white">{SORTS.map((s: any) => <option key={s}>{s}</option>)}</select>
              </div>
              <div>
                <label className="text-sm text-warm-muted">Min Trust Score: <span className="text-warm-ink font-medium">{trust}</span></label>
                <input type="range" min={0} max={5} step={0.1} value={trust} onChange={(e) => onTrust(Number(e.target.value).toFixed(1))} className="mt-1 w-full accent-warm-red" />
              </div>
              <div>
                <label className="text-sm text-warm-muted">Distance: <span className="text-warm-ink font-medium">{dist}km</span></label>
                <input type="range" min={1} max={50} value={dist} onChange={(e) => onDist(Number(e.target.value))} className="mt-1 w-full accent-warm-red" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" className="flex-1" onClick={onClear}>Clear all</Button>
              <Button className="flex-1" onClick={onClose}>Show results</Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
