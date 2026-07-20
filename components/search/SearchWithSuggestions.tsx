'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, CornerDownRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type Suggestion = { label: string; sub?: string; href: string; icon?: string; kind: 'worker' | 'shop' | 'job' | 'category' | 'trend' | 'query' };

type Scope = 'all' | 'workers' | 'shops' | 'jobs' | 'talent';

const CATEGORIES: { slug: string; label: string; icon: string }[] = [
  { slug: 'skilled-trades', label: 'Skilled Trades', icon: '🔧' },
  { slug: 'home-services', label: 'Home Services', icon: '🧹' },
  { slug: 'automotive', label: 'Automotive', icon: '🚗' },
  { slug: 'construction', label: 'Construction', icon: '🏗️' },
  { slug: 'repair-maintenance', label: 'Repair & Maintenance', icon: '🛠️' },
  { slug: 'transportation', label: 'Transportation', icon: '🚚' },
  { slug: 'security', label: 'Security', icon: '🛡️' },
  { slug: 'professional-services', label: 'Professional Services', icon: '💼' },
  { slug: 'education', label: 'Education', icon: '📚' },
  { slug: 'healthcare', label: 'Healthcare', icon: '⚕️' },
  { slug: 'digital-services', label: 'Digital Services', icon: '💻' },
  { slug: 'business-services', label: 'Business Services', icon: '📊' },
  { slug: 'hospitality', label: 'Hospitality', icon: '🍽️' },
  { slug: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { slug: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { slug: 'beauty-wellness', label: 'Beauty & Wellness', icon: '💇' },
  { slug: 'event-services', label: 'Event Services', icon: '🎉' },
  { slug: 'retail', label: 'Retail', icon: '🛍️' },
];

const SITUATIONS = [
  { label: 'Emergency Repairs', icon: '🚨' }, { label: 'Moving House', icon: '📦' },
  { label: 'Wedding Services', icon: '💍' }, { label: 'Home Renovation', icon: '🏠' },
  { label: 'Office Setup', icon: '🏢' }, { label: 'Vehicle Breakdown', icon: '🚗' },
  { label: 'House Cleaning', icon: '🧹' }, { label: 'AC Installation', icon: '❄️' },
  { label: 'Exam Preparation', icon: '📚' }, { label: 'Business Startup', icon: '🚀' },
];

function baseSuggestions(scope: Scope): Suggestion[] {
  const cats: Suggestion[] = CATEGORIES.map((c) => ({
    label: c.label, icon: c.icon, kind: 'category',
    href: scope === 'shops' ? `/discover?tab=shops&category=${c.slug}` : `/discover?category=${c.slug}`,
    sub: 'Category',
  }));
  const sit: Suggestion[] = SITUATIONS.map((s) => ({
    label: s.label, icon: s.icon, kind: 'query',
    href: `/discover?q=${encodeURIComponent(s.label)}`, sub: 'I need help with',
  }));
  const trends: Suggestion[] = [
    { label: 'Electrician near me', icon: '🔧', kind: 'trend', href: `/discover?q=electrician`, sub: 'Trending' },
    { label: 'AC repair', icon: '❄️', kind: 'trend', href: `/discover?q=AC%20repair`, sub: 'Trending' },
    { label: 'House cleaner', icon: '🧹', kind: 'trend', href: `/discover?q=cleaner`, sub: 'Trending' },
    { label: 'Math tutor', icon: '📚', kind: 'trend', href: `/discover?q=tutor`, sub: 'Trending' },
    { label: 'Plumber', icon: '🛠️', kind: 'trend', href: `/discover?q=plumber`, sub: 'Trending' },
  ];
  if (scope === 'jobs') {
    return [
      { label: 'Electrical work', icon: '🔧', kind: 'query', href: '/jobs?search=electrical', sub: 'Job keyword' },
      { label: 'Cleaning', icon: '🧹', kind: 'query', href: '/jobs?search=cleaning', sub: 'Job keyword' },
      { label: 'Painting', icon: '🏗️', kind: 'query', href: '/jobs?search=painting', sub: 'Job keyword' },
      { label: 'Plumbing', icon: '🛠️', kind: 'query', href: '/jobs?search=plumbing', sub: 'Job keyword' },
      ...trends,
    ];
  }
  if (scope === 'shops') {
    return [
      ...cats.filter((c) => true),
      { label: 'Hardware store', icon: '🛒', kind: 'query', href: '/discover?tab=shops&q=hardware', sub: 'Shop search' },
      { label: 'Auto parts', icon: '🚗', kind: 'query', href: '/discover?tab=shops&q=auto%20parts', sub: 'Shop search' },
      { label: 'Paint shop', icon: '🎨', kind: 'query', href: '/discover?tab=shops&q=paint', sub: 'Shop search' },
    ];
  }
  if (scope === 'workers' || scope === 'talent') {
    return [...cats, ...sit, ...trends];
  }
  return [...cats, ...sit, ...trends];
}

function matchScore(text: string, q: string) {
  const t = text.toLowerCase();
  const s = q.toLowerCase().trim();
  if (!s) return 0;
  if (t === s) return 100;
  if (t.startsWith(s)) return 80;
  if (t.includes(s)) return 60;
  // word boundary
  if (t.split(' ').some((w) => w.startsWith(s))) return 50;
  // fuzzy: all chars present in order
  let i = 0;
  for (const ch of t) { if (ch === s[i]) i++; if (i === s.length) return 30; }
  return 0;
}

export function SearchWithSuggestions({
  scope = 'all',
  defaultValue = '',
  placeholder = 'Search…',
  className = '',
  size = 'md',
}: {
  scope?: Scope;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  size?: 'md' | 'lg';
}) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const base = useMemo(() => baseSuggestions(scope), [scope]);

  const filtered = useMemo(() => {
    const s = query.trim();
    if (!s) {
      // Show top recommendations even before typing
      return base.slice(0, 6).map((b) => ({ s: b, score: 0 }));
    }
    return base
      .map((b) => ({ s: b, score: matchScore(b.label, s) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [query, base]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function submit(q?: string) {
    const term = (q ?? query).trim();
    setOpen(false);
    if (!term) return;
    const enc = encodeURIComponent(term);
    if (scope === 'jobs') router.push(`/jobs?search=${enc}`);
    else if (scope === 'shops') router.push(`/discover?tab=shops&q=${enc}`);
    else if (scope === 'workers' || scope === 'talent') router.push(`/discover?q=${enc}`);
    else router.push(`/discover?q=${enc}`);
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (open && filtered[active]) { router.push(filtered[active].s.href); setOpen(false); } else submit(); }
    else if (e.key === 'Escape') setOpen(false);
  }

  const pad = size === 'lg' ? 'px-5 py-3.5 text-base' : 'px-4 py-2.5 text-sm';

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="relative">
        <div className={`flex items-center gap-2 rounded-full bg-white shadow-card-lift border border-transparent focus-within:border-warm-gold focus-within:ring-4 focus-within:ring-warm-gold/15 transition-all duration-200 ${pad}`}>
          <Search className="w-5 h-5 text-warm-muted shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0); }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKey}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-warm-ink placeholder:text-warm-muted min-w-0"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(''); setOpen(true); inputRef.current?.focus(); }} className="text-warm-muted hover:text-warm-ink">
              <X className="w-4 h-4" />
            </button>
          )}
          <Button type="submit" size={size === 'lg' ? 'sm' : 'sm'} className="rounded-full">{scope === 'jobs' ? 'Find' : 'Search'}</Button>
        </div>
      </form>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl bg-white shadow-card-lift border border-warm-border overflow-hidden max-h-[60vh] overflow-y-auto">
          {query.trim() === '' && <div className="px-4 py-2 text-xs font-semibold text-warm-muted uppercase tracking-wide">Recommended</div>}
          {filtered.length === 0 && (
            <div className="px-4 py-3 text-sm text-warm-muted">No suggestions — press Enter to search “{query}”.</div>
          )}
          {filtered.map((f, i) => (
            <button
              key={`${f.s.label}-${i}`}
              type="button"
              onMouseEnter={() => setActive(i)}
              onClick={() => { router.push(f.s.href); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === active ? 'bg-warm-beige' : 'hover:bg-warm-cream'}`}
            >
              <span className="text-lg leading-none w-6 text-center">{f.s.icon || '🔍'}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm text-warm-ink truncate">{f.s.label}</span>
                {f.s.sub && <span className="block text-xs text-warm-muted">{f.s.sub}</span>}
              </span>
              {f.s.kind === 'trend' && <TrendingUp className="w-4 h-4 text-warm-gold" />}
              {i === active && <CornerDownRight className="w-4 h-4 text-warm-red" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
