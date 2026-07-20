'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Store, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionTitle, reveal, Img, SHOPS, PRODUCTS } from './home-shared';

function ShopCardMini({ s, idx = 0 }: { s: any; idx?: number }) {
  return (
    <motion.div {...reveal((idx % 3) * 0.06)} className="group">
      <Link href="/discover?tab=shops">
        <div className="rounded-[24px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 hover:scale-[1.02] overflow-hidden">
          <div className="h-28 bg-gradient-to-br from-warm-beige to-warm-cream relative overflow-hidden">
            {s.banner ? <Img src={s.banner} alt={s.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Store className="w-8 h-8 text-warm-red/30" /></div>}
            <div className="absolute top-2 right-2 bg-white/90 rounded-full px-2 py-0.5 text-xs font-bold flex items-center gap-1"><Star className="w-3 h-3 fill-warm-gold text-warm-gold" />{s.score}</div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-warm-ink">{s.name}</h3>
            <p className="text-xs text-warm-muted mt-0.5">{s.category}{s.location ? ` · ${s.location}` : ''}</p>
            <div className="flex items-center justify-between mt-3"><span className="text-xs text-warm-muted">{s.products} products</span><span className="text-xs px-2 py-0.5 rounded-full bg-warm-green/10 text-warm-green">Verified</span></div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductCardMini({ p }: { p: any }) {
  return (
    <div className="group shrink-0 w-[220px]">
      <div className="rounded-[20px] bg-white border border-warm-border shadow-card hover:shadow-card-lift transition-all duration-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-br from-warm-beige to-warm-cream relative overflow-hidden"><Img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
        <div className="p-3">
          <p className="text-xs text-warm-muted">{p.shop}</p>
          <h4 className="text-sm font-medium text-warm-ink truncate">{p.name}</h4>
          <div className="flex items-center justify-between mt-2"><span className="font-semibold text-warm-red">৳{p.price}</span><span className="text-xs text-warm-green">{p.stock}</span></div>
        </div>
      </div>
    </div>
  );
}

export function LocalShopsSection({ shops, products }: { shops?: any[]; products?: any[] }) {
  const shopList = (shops && shops.length ? shops : SHOPS);
  const productList = (products && products.length ? products : PRODUCTS);
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Local businesses" title="Explore Shops & Products" sub="Trusted shop owners with the materials and tools you need." />
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-10 items-start">
          <div>
            <h3 className="text-lg font-semibold text-warm-ink mb-4 flex items-center gap-2"><Store className="w-5 h-5 text-warm-red" /> Featured Shops</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {shopList.slice(0, 6).map((s, i) => <ShopCardMini key={s.id} s={s} idx={i} />)}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-warm-ink mb-4 flex items-center gap-2"><ShoppingBag className="w-5 h-5 text-warm-red" /> Popular Products</h3>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {productList.slice(0, 8).map((p) => <ProductCardMini key={p.id} p={p} />)}
            </div>
          </div>
        </div>
        <div className="text-center mt-8"><Link href="/discover?tab=shops"><Button size="lg" className="gap-2">Browse All Shops & Products <ArrowRight className="w-4 h-4" /></Button></Link></div>
      </div>
    </section>
  );
}
