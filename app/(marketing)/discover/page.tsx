import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string }> }) {
  const supabase = await createClient();
  const { search, category } = await searchParams;
  const query = search || '';
  const categorySlug = category || '';

  let talentProfiles: any[] = [];
  let categories: any[] = [];

  try {
    const talentQuery = supabase
      .from('talent_profiles')
      .select(`
        *,
        profiles!inner(id, full_name, avatar_url, username, role, status, is_verified)
      `)
      .eq('profiles.status', 'active')
      .eq('profiles.profile_visibility', 'public');

    const { data } = await talentQuery.limit(20);
    talentProfiles = data || [];

    const { data: cats } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    categories = cats || [];
  } catch (e) {
    console.error('Error fetching talent:', e);
  }

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
            <Link href="/discover" className="text-warm-red font-medium">Discover</Link>
            <Link href="/jobs" className="hover:text-warm-red">Jobs</Link>
            <Link href="/pricing" className="hover:text-warm-red">Pricing</Link>
            <Link href="/login" className="hover:text-warm-red">Sign in</Link>
          </nav>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-heading text-4xl md:text-5xl font-bold mb-4">
            Discover Talent
          </h1>
          <p className="text-warm-muted max-w-2xl mx-auto mb-8">
            Find skilled freelancers and remote workers ready to help with your projects
          </p>
          <form action="/discover" method="GET" className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                name="search"
                placeholder="Search by skill, role, or keyword..."
                className="w-full pr-32"
                defaultValue={query}
              />
              <Button type="submit" className="absolute right-1 top-1">
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-8 bg-warm-beige">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/discover">
              <Button variant="ghost" size="sm" className={!categorySlug ? 'bg-white' : ''}>
                All Categories
              </Button>
            </Link>
            {categories.map(cat => (
              <Link key={cat.slug} href={`/discover?category=${cat.slug}`}>
                <Button variant="ghost" size="sm" className={categorySlug === cat.slug ? 'bg-white' : ''}>
                  {cat.name_en}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {talentProfiles.map((talent: any) => (
              <div key={talent.profiles?.id} className="p-6 rounded-xl bg-white border border-warm-border">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-warm-beige flex items-center justify-center text-warm-ink font-bold text-xl">
                    {talent.profiles?.full_name?.charAt(0) || 'T'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-warm-ink">
                      {talent.profiles?.full_name}
                    </h3>
                    <p className="text-sm text-warm-muted">{talent.headline}</p>
                    {talent.profiles?.is_verified && (
                      <span className="text-xs text-warm-green">Verified</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {talent.skills?.slice(0, 3).map((skill: string) => (
                    <span key={skill} className="px-2 py-1 text-xs rounded-full bg-warm-beige text-warm-muted">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-warm-green">
                    Available
                  </span>
                  <Link href={`/talent/${talent.profiles?.username || talent.profiles?.id}`}>
                    <Button size="sm" variant="secondary">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {!talentProfiles.length && (
            <div className="text-center py-12">
              <p className="text-warm-muted mb-4">No talents found matching your criteria</p>
              <Button variant="secondary">Clear filters</Button>
            </div>
          )}
        </div>
      </section>

      <footer className="bg-warm-ink text-white py-12">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Galaxy Workforce</h3>
            <p className="text-sm text-white/70">AI-powered human workforce marketplace for Bangladesh and beyond.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/discover" className="hover:text-white">Discover</Link></li>
              <li><Link href="/jobs" className="hover:text-white">Jobs</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
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
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          © 2026 Galaxy Workforce
        </div>
      </footer>
    </div>
  );
}
