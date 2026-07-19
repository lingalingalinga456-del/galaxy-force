import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

const SITUATIONS = [
  { label: 'Emergency Repairs', q: 'emergency electrical repair', icon: '🚨' },
  { label: 'Moving House', q: 'need a truck and movers', icon: '📦' },
  { label: 'Wedding Services', q: 'wedding decorator and photographer', icon: '💍' },
  { label: 'Home Renovation', q: 'painter and mason for renovation', icon: '🏠' },
  { label: 'Office Setup', q: 'office cleaning and IT setup', icon: '🏢' },
  { label: 'Vehicle Breakdown', q: 'car mechanic and towing', icon: '🚗' },
  { label: 'House Cleaning', q: 'home deep cleaning', icon: '🧹' },
  { label: 'AC Installation', q: 'split AC installation', icon: '❄️' },
  { label: 'Exam Preparation', q: 'math tutor for exam', icon: '📚' },
  { label: 'Business Startup', q: 'accountant and lawyer for business', icon: '🚀' },
];

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string; view?: string }> }) {
  const supabase = await createClient();
  const { search, category, view } = await searchParams;
  const query = search || '';
  const categorySlug = category || '';
  const activeView = view || 'individuals';

  let talentProfiles: any[] = [];
  let categories: any[] = [];
  let products: any[] = [];
  let shops: any[] = [];

  try {
    let talentQuery = supabase
      .from('talent_profiles')
      .select(`*, profiles!inner(id, full_name, avatar_url, username, role, status, is_verified), shop_profiles(id, shop_name, verification_status)`)
      .eq('profiles.status', 'active')
      .eq('profiles.profile_visibility', 'public');

    if (categorySlug) {
      talentQuery = talentQuery.eq('primary_occupation', categorySlug);
    }
    if (query) {
      talentQuery = talentQuery.or(`headline.ilike.%${query}%,skills.cs.{${query}}`);
    }
    const { data } = await talentQuery.limit(24);
    talentProfiles = data || [];

    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    categories = cats || [];

    if (query) {
      const { data: prods } = await supabase
        .from('products')
        .select('id, name, description, category, price, shop_profiles(shop_name)')
        .eq('status', 'published')
        .or(`name.ilike.%${query}%,category.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(12);
      products = prods || [];
    }

    const { data: shopRows } = await supabase
      .from('shop_profiles')
      .select('id, shop_name, business_type, city, trust_score, verification_status')
      .eq('verification_status', 'verified')
      .limit(12);
    shops = shopRows || [];
  } catch (e) {
    console.error('Error fetching discover data:', e);
  }

  const badgeFor = (t: any) => {
    const b: string[] = [];
    if (t.profiles?.is_verified) b.push('Verified');
    if (t.worker_meta?.emergencyAvailable) b.push('Emergency');
    if ((t.completion_score || 0) >= 80) b.push('Top Rated');
    if ((t.worker_meta?.experienceYears || 0) >= 5) b.push('Experienced');
    if (t.worker_meta?.ownTools) b.push('Has Tools');
    return b.slice(0, 3);
  };

  return (
    <div className="min-h-screen bg-warm-cream">
      <header className="border-b border-warm-border bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warm-red flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-heading font-bold text-xl">Galaxy Workforce</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/discover" className="text-warm-red font-medium">Discover Workforce</Link>
            <Link href="/jobs" className="hover:text-warm-red">Find Work</Link>
            <Link href="/pricing" className="hover:text-warm-red">Pricing</Link>
            <Link href="/login" className="hover:text-warm-red">Sign in</Link>
          </nav>
          <Link href="/register"><Button>Get Started</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-beige text-warm-muted text-sm mb-4">
            🔧 AI-powered Human Resource Marketplace
          </span>
          <h1 className="text-heading text-4xl md:text-5xl font-bold mb-3">Discover the Workforce</h1>
          <p className="text-warm-muted max-w-2xl mx-auto mb-6">From plumbers to programmers — one AI marketplace connecting skills with opportunity.</p>
          <form action="/discover" method="GET" className="max-w-2xl mx-auto">
            <div className="relative">
              <Input name="search" placeholder="Describe your need — “fix my refrigerator”, “need a truck tomorrow”…" className="w-full pr-32" defaultValue={query} />
              <Button type="submit" className="absolute right-1 top-1">Search</Button>
            </div>
          </form>
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {SITUATIONS.map((s) => (
              <Link key={s.label} href={`/discover?search=${encodeURIComponent(s.q)}`}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-warm-border bg-white px-3 py-1.5 text-sm text-warm-muted hover:border-warm-red hover:text-warm-red">
                  <span>{s.icon}</span>{s.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* View tabs */}
      <section className="border-y border-warm-border bg-white">
        <div className="container mx-auto px-4 flex flex-wrap gap-2 justify-center py-3">
          {[['individuals', 'Individuals'], ['teams', 'Teams'], ['businesses', 'Businesses'], ['shops', 'Shops']].map(([v, label]) => (
            <Link key={v} href={`/discover?view=${v}`}>
              <Button variant="ghost" size="sm" className={activeView === v ? 'bg-warm-cream text-warm-red' : ''}>{label}</Button>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-warm-beige">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/discover"><Button variant="ghost" size="sm" className={!categorySlug ? 'bg-white' : ''}>All</Button></Link>
            {categories.map(cat => (
              <Link key={cat.slug} href={`/discover?category=${cat.slug}`}>
                <Button variant="ghost" size="sm" className={categorySlug === cat.slug ? 'bg-white' : ''}>
                  <span className="mr-1">{cat.icon}</span>{cat.name_en}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Workforce content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {activeView === 'shops' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((s: any) => (
                <div key={s.id} className="p-6 rounded-card bg-white border border-warm-border shadow-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-warm-ink">{s.shop_name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warm-green/10 text-warm-green">Verified</span>
                  </div>
                  <p className="text-sm text-warm-muted mt-1">{s.business_type}{s.city ? ` · ${s.city}` : ''}</p>
                  <p className="text-sm text-warm-muted mt-2">Trust Score: {s.trust_score}/100</p>
                </div>
              ))}
              {!shops.length && <p className="text-warm-muted">No verified shops yet.</p>}
            </div>
          )}

          {activeView !== 'shops' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {talentProfiles.map((talent: any) => (
                <div key={talent.profiles?.id} className="p-6 rounded-card bg-white border border-warm-border shadow-card hover:shadow-card-hover transition-all">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-warm-beige flex items-center justify-center text-warm-ink font-bold text-lg">
                      {talent.profiles?.full_name?.charAt(0) || 'W'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-warm-ink">{talent.profiles?.full_name}</h3>
                      <p className="text-sm text-warm-muted">{talent.headline || talent.primary_occupation || 'Skilled worker'}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        {talent.worker_status === 'available' || talent.worker_status === 'emergency_only'
                          ? <span className="text-warm-green font-medium">● Available now</span>
                          : <span className="text-warm-muted">○ {talent.worker_status?.replace('_', ' ') || 'Busy'}</span>}
                        {(talent.worker_meta?.experienceYears || 0) > 0 && <span className="text-warm-muted">· {talent.worker_meta?.experienceYears}y exp</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {badgeFor(talent).map((b) => (
                      <span key={b} className="px-2 py-0.5 text-xs rounded-full bg-warm-cream text-warm-ink border border-warm-border">{b}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    {talent.hourly_rate > 0 && <span className="text-sm font-semibold text-warm-red">৳{Number(talent.hourly_rate).toLocaleString()}/hr</span>}
                    <Link href={`/talent/${talent.profiles?.username || talent.profiles?.id}`} className="ml-auto">
                      <Button size="sm" variant="secondary">View Profile</Button>
                    </Link>
                  </div>
                </div>
              ))}
              {!talentProfiles.length && (
                <div className="col-span-full text-center py-12">
                  <p className="text-warm-muted mb-4">No workers found. Try a different situation or category.</p>
                  <Link href="/discover"><Button variant="secondary">Clear filters</Button></Link>
                </div>
              )}
            </div>
          )}

          {products.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-warm-ink mb-4">Materials & Tools from Shops</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p: any) => (
                  <div key={p.id} className="p-6 rounded-card bg-white border border-warm-border shadow-card">
                    <h3 className="font-semibold text-warm-ink">{p.name}</h3>
                    <p className="text-sm text-warm-muted mb-2">{p.shop_profiles?.shop_name}</p>
                    <span className="font-semibold text-warm-gold">৳{Number(p.price).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-warm-ink text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Galaxy Workforce</h3>
            <p className="text-sm text-white/70">Bringing every skilled person online and connecting them with opportunities through AI.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Workforce</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/discover" className="hover:text-white">Discover Workforce</Link></li>
              <li><Link href="/jobs" className="hover:text-white">Find Work</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Partners</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="https://lead-scrape-pro-2.vibepreview.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">LeadScrape Pro</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-white">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">© 2026 Galaxy Workforce</div>
      </footer>
    </div>
  );
}
