'use client';

import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Store, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Img } from '@/components/home/home-shared';
import { SearchWithSuggestions } from '@/components/search/SearchWithSuggestions';
import { SHOP_CATS, buildDemoShops, buildDemoProducts } from '@/lib/shops-data';
import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';

type Shop = any;
type Product = any;

export function ShopsDiscoverClient({ realShops = [] as Shop[], realProducts = [] as Product[] }) {
  const demoShops = useMemo(() => buildDemoShops(), []);
  const demoProducts = useMemo(() => buildDemoProducts(), []);
  const shops: Shop[] = useMemo(() => (realShops && realShops.length ? realShops : demoShops), [realShops, demoShops]);
  const products: Product[] = useMemo(() => (realProducts && realProducts.length ? realProducts : demoProducts), [realProducts, demoProducts]);

  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('');
  const [sub, setSub] = useState('');
  const [shopsVisible, setShopsVisible] = useState(9);
  const [prodsVisible, setProdsVisible] = useState(16);

  const filteredShops = useMemo(() => {
    let r = shops;
    const q = query.trim().toLowerCase();
    if (q) r = r.filter((s: Shop) => `${s.name} ${s.category} ${s.subcategory} ${s.location}`.toLowerCase().includes(q));
    if (cat) r = r.filter((s: Shop) => s.category === cat);
    if (sub) r = r.filter((s: Shop) => (s.subcategory || '').toLowerCase().includes(sub.toLowerCase()));
    return r;
  }, [shops, query, cat, sub]);

  const filteredProducts = useMemo(() => {
    let r = products;
    const q = query.trim().toLowerCase();
    if (q) r = r.filter((p: Product) => `${p.name} ${p.shop} ${p.category}`.toLowerCase().includes(q));
    if (cat) r = r.filter((p: Product) => p.category === cat);
    if (sub) r = r.filter((p: Product) => (p.name || '').toLowerCase().includes(sub.toLowerCase()));
    return r;
  }, [products, query, cat, sub]);

  function pickCat(slug: string) { setCat(slug); setSub(''); setShopsVisible(9); setProdsVisible(16); }
  function pickSub(s: string) { setSub(s); setShopsVisible(9); setProdsVisible(16); }
  function clearAll() { setCat(''); setSub(''); setQuery(''); setShopsVisible(9); setProdsVisible(16); }

  return (
    <div className="min-h-screen bg-warm-cream">
      <SiteHeader />
      <section className="py-12 md:py-16 bg-gradient-to-b from-warm-cream to-warm-beige">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-warm-muted text-sm mb-4 shadow-card"><Store className="w-4 h-4 text-warm-red" /> Local Shops & Products</span>
          <h1 className="text-heading text-4xl md:text-5xl font-bold mb-3 text-warm-ink">Discover Shops & Products</h1>
          <p className="text-warm-muted max-w-2xl mx-auto mb-6">Browse verified local shops and the materials, tools, and parts they offer.</p>
          <div className="max-w-2xl mx-auto">
            <SearchWithSuggestions scope="shops" defaultValue={query} placeholder="Search shops, products, hardware…" size="lg" />
          </div>
        </div>
      </section>

      <CategoryCanvas activeCat={cat} activeSub={sub} onPickCat={pickCat} onPickSub={pickSub} onClear={clearAll} />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-warm-ink mb-4 flex items-center gap-2"><Store className="w-5 h-5 text-warm-red" /> Shops <span className="text-sm font-normal text-warm-muted">({filteredShops.length})</span></h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShops.slice(0, shopsVisible).map((s: Shop, i: number) => <ShopCard key={s.id} s={s} idx={i} />)}
          </div>
          {filteredShops.length === 0 && <p className="text-warm-muted">No shops found.</p>}
          {shopsVisible < filteredShops.length && (
            <div className="mt-6"><Button variant="secondary" onClick={() => setShopsVisible((v) => v + 9)}>Show More Shops</Button></div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-semibold text-warm-ink mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-warm-red" /> Products <span className="text-sm font-normal text-warm-muted">({filteredProducts.length})</span></h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.slice(0, prodsVisible).map((p: Product, i: number) => <ProductCard key={p.id} p={p} idx={i} />)}
          </div>
          {filteredProducts.length === 0 && <p className="text-warm-muted">No products found.</p>}
          {prodsVisible < filteredProducts.length && (
            <div className="mt-6"><Button variant="secondary" onClick={() => setProdsVisible((v) => v + 16)}>Show More Products</Button></div>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

// ---- Category canvas (shop-relevant cats + hover/tap subcategories) ----
function CategoryCanvas({ activeCat, activeSub, onPickCat, onPickSub, onClear }: any) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tapped, setTapped] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const open = (slug: string) => { if (closeTimer.current) clearTimeout(closeTimer.current); setHovered(slug); };
  const scheduleClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => setHovered(null), 120); };
  const isActive = (slug: string) => activeCat === slug || hovered === slug || tapped === slug;

  return (
    <section className="py-5 bg-warm-beige/60 sticky top-[64px] z-30">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          <button onMouseEnter={() => open('')} onClick={onClear} className={`relative z-10 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition-all ${!activeCat && !activeSub ? 'bg-warm-red text-white border-warm-red' : 'bg-white text-warm-ink border-warm-border hover:border-warm-red hover:text-warm-red'}`}>All</button>
          {SHOP_CATS.map((c) => (
            <div key={c.slug} className="relative" onMouseEnter={() => open(c.slug)} onMouseLeave={scheduleClose}>
              <button onClick={() => { onPickCat(c.slug); setTapped(null); }} className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition-all ${activeCat === c.slug ? 'bg-warm-red text-white border-warm-red' : 'bg-white text-warm-ink border-warm-border hover:border-warm-red hover:text-warm-red'}`}>
                <span>{c.emoji}</span> {c.name}
              </button>
              {isActive(c.slug) && c.subcategories.length > 0 && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15 }} className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-60 rounded-2xl bg-white border border-warm-border shadow-card-lift p-3" onMouseEnter={() => open(c.slug)} onMouseLeave={scheduleClose}>
                  <div className="text-xs font-semibold text-warm-muted mb-2 px-1">{c.name} · Subcategories</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.subcategories.map((sub) => (
                      <button key={sub} onClick={() => { onPickSub(sub); setTapped(null); setHovered(null); }} className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${activeSub === sub ? 'bg-warm-red text-white border-warm-red' : 'border-warm-border bg-warm-cream text-warm-ink hover:border-warm-gold hover:bg-warm-beige'}`}>{sub}</button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          ))}
        </div>
        {tapped && (
          <div className="lg:hidden mt-3 flex flex-wrap gap-1.5 justify-center">
            {SHOP_CATS.find((c) => c.slug === tapped)?.subcategories.map((sub) => (
              <button key={sub} onClick={() => { onPickSub(sub); setTapped(null); }} className={`text-xs px-2.5 py-1 rounded-full border ${activeSub === sub ? 'bg-warm-red text-white border-warm-red' : 'border-warm-border bg-white text-warm-ink hover:border-warm-gold'}`}>{sub}</button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ---- Cards ----
function ShopCard({ s, idx = 0 }: { s: Shop; idx?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 3) * 0.05 }} className="group">
      <Link href={`/shop/${s.id}`} className="block">
        <div className="rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-warm-beige to-warm-cream relative overflow-hidden">
            {s.banner ? <Img src={s.banner} alt={s.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Store className="w-8 h-8 text-warm-red/30" /></div>}
            <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-warm-gold text-warm-gold" />{s.score}</div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2"><Store className="w-4 h-4 text-warm-red" /><h3 className="font-semibold text-warm-ink truncate">{s.name}</h3></div>
            <p className="text-xs text-warm-muted mt-0.5">{s.category}{s.location ? ` · ${s.location}` : ''}</p>
            <div className="flex items-center justify-between mt-3"><span className="text-xs text-warm-muted">{s.products} products</span><span className="text-xs px-2 py-0.5 rounded-full bg-warm-green/10 text-warm-green">Verified</span></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductCard({ p, idx = 0 }: { p: Product; idx?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (idx % 4) * 0.04 }} className="group">
      <div className="rounded-[20px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-warm-beige to-warm-cream relative overflow-hidden"><Img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div className="p-3">
          <p className="text-xs text-warm-muted truncate">{p.shop}</p>
          <h4 className="text-sm font-medium text-warm-ink truncate">{p.name}</h4>
          <div className="flex items-center justify-between mt-2"><span className="font-semibold text-warm-red">৳{Number(p.price).toLocaleString()}</span><span className="text-xs text-warm-green">{p.stock}</span></div>
        </div>
      </div>
    </motion.div>
  );
}

// ---- Header / Footer ----
// Header/Footer come from shared SiteHeader/SiteFooter
