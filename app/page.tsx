import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AiRequestBar } from '@/components/ai/ai-request-bar';
import { StatsCounter } from '@/components/design-system/StatsCounter';
import { CategoryChip } from '@/components/design-system/CategoryChip';
import { FloatingAIAssistant } from '@/components/design-system/FloatingAIAssistant';
import { MobileBottomNav } from '@/components/design-system/MobileBottomNav';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();
  let categories: any[] = [];
  try {
    const { data } = await supabase
      .from('categories')
      .select('slug, name_en, icon, job_count, sort_order')
      .eq('is_active', true)
      .order('sort_order')
      .limit(18);
    categories = data || [];
  } catch {}
  if (!categories.length) {
    categories = fallbackCategories;
  }

  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-warm-border bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-warm-red flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-heading text-xl font-bold">Galaxy Workforce</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/discover" className="hover:text-warm-red">Discover Workforce</Link>
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

      {/* Hero — 55/45 split */}
      <section className="relative overflow-hidden bg-gradient-to-b from-warm-cream to-warm-beige">
        <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-[55fr_45fr] gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-warm-muted text-sm mb-6 shadow-card">
              <Sparkles className="w-4 h-4 text-warm-red" />
              AI-powered Human Resource Marketplace
            </div>
            <h1 className="text-heading text-5xl md:text-6xl font-bold mb-6 leading-[1.2]">
              Find Trusted Talent.<br />Build Without Limits.
            </h1>
            <p className="text-lg text-warm-muted mb-8 max-w-xl">
              Galaxy Workforce is a human resource marketplace that brings every skilled person online — from plumbers to programmers. Describe the job in plain language and let AI match the right person.
            </p>
            <div className="mb-8">
              <AiRequestBar />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register?role=client"><Button size="lg" className="gap-2">Hire Talent <ArrowRight className="w-4 h-4" /></Button></Link>
              <Link href="/register?role=talent"><Button size="lg" variant="secondary" className="gap-2">Find Work <ArrowRight className="w-4 h-4" /></Button></Link>
            </div>
          </div>

          {/* Floating layered cards */}
          <div className="relative hidden md:block h-[420px]">
            <FloatingProfileCard className="absolute top-0 right-4 animate-[float_6s_ease-in-out_infinite]" />
            <MatchScoreCard className="absolute top-32 -left-2 animate-[float_6s_ease-in-out_infinite_1.5s]" />
            <EarningsCard className="absolute bottom-0 right-12 animate-[float_6s_ease-in-out_infinite_3s]" />
          </div>
        </div>
      </section>

      {/* Trust Bar — animated counters */}
      <section className="py-12 bg-warm-beige">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatsCounter value={12000} label="Active Workers" suffix="+" />
          <StatsCounter value={850} label="Companies Joined" suffix="+" />
          <StatsCounter value={24000} label="Jobs Completed" suffix="+" />
          <StatsCounter value={12} label="Countries" />
        </div>
      </section>

      {/* Category Ecosystem */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-heading text-3xl font-bold mb-3 text-center">Discover the Workforce</h2>
          <p className="text-warm-muted text-center mb-10">From skilled trades to digital services — find the right person for any job</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
              <CategoryChip
                key={cat.slug}
                label={cat.name_en}
                icon={cat.icon}
                href={`/discover?category=${cat.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-warm-red">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-heading text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">Join thousands of businesses and talents already using Galaxy Workforce.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=client"><Button size="lg" variant="secondary" className="gap-2">Hire a Worker <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/register?role=talent"><Button size="lg" variant="ghost" className="gap-2 bg-white text-warm-red hover:bg-warm-beige">Join the Workforce <ArrowRight className="w-4 h-4" /></Button></Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-ink text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-warm-red flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
              <span className="text-heading text-lg font-bold">Galaxy Workforce</span>
            </div>
            <p className="text-sm text-white/70">AI-powered human workforce marketplace for Bangladesh and beyond.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/discover" className="hover:text-white">Discover Workforce</Link></li>
              <li><Link href="/jobs" className="hover:text-white">Find Work</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Partners</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="https://lead-scrape-pro-2.vibepreview.com" target="_blank" rel="noopener noreferrer" className="hover:text-white">LeadScrape Pro</a></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>support@galaxyworkforce.com</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">© 2026 Galaxy Workforce. All rights reserved.</div>
      </footer>

      <FloatingAIAssistant />
      <MobileBottomNav />
    </div>
  );
}

function FloatingProfileCard({ className = '' }: { className?: string }) {
  return (
    <div className={`w-64 rounded-[24px] bg-white shadow-card-lift p-4 border border-warm-border ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-warm-red/10 flex items-center justify-center font-bold text-warm-red">R</div>
        <div>
          <div className="font-semibold text-warm-ink">Rahim Ahmed</div>
          <div className="text-xs text-warm-muted">Electrician · Dhaka</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span className="px-2 py-0.5 rounded-full bg-warm-green/10 text-warm-green">Verified</span>
        <span className="px-2 py-0.5 rounded-full bg-warm-beige text-warm-muted">★ 4.9</span>
      </div>
    </div>
  );
}

function MatchScoreCard({ className = '' }: { className?: string }) {
  return (
    <div className={`w-60 rounded-[24px] bg-warm-ink text-white shadow-card-lift p-4 ${className}`}>
      <div className="text-xs text-white/60 mb-1">AI Match</div>
      <div className="text-3xl font-bold text-warm-gold">96%</div>
      <div className="text-sm text-white/80 mt-1">Rahim ↔ Your job</div>
      <div className="mt-2 h-1.5 rounded-full bg-white/15 overflow-hidden">
        <div className="h-full bg-warm-gold" style={{ width: '96%' }} />
      </div>
    </div>
  );
}

function EarningsCard({ className = '' }: { className?: string }) {
  return (
    <div className={`w-56 rounded-[24px] bg-white shadow-card-lift p-4 border border-warm-border ${className}`}>
      <div className="text-xs text-warm-muted mb-1">This month</div>
      <div className="text-2xl font-bold text-warm-red">৳48,200</div>
      <div className="text-xs text-warm-green mt-1">↑ 18% vs last month</div>
    </div>
  );
}

const fallbackCategories = [
  { slug: 'skilled-trades', name_en: 'Skilled Trades', icon: '🔧', job_count: 0 },
  { slug: 'home-services', name_en: 'Home Services', icon: '🧹', job_count: 0 },
  { slug: 'automotive', name_en: 'Automotive', icon: '🚗', job_count: 0 },
  { slug: 'construction', name_en: 'Construction', icon: '🏗️', job_count: 0 },
  { slug: 'repair-maintenance', name_en: 'Repair & Maintenance', icon: '🛠️', job_count: 0 },
  { slug: 'transportation', name_en: 'Transportation', icon: '🚚', job_count: 0 },
  { slug: 'security', name_en: 'Security', icon: '🛡️', job_count: 0 },
  { slug: 'professional-services', name_en: 'Professional Services', icon: '💼', job_count: 0 },
  { slug: 'education', name_en: 'Education', icon: '📚', job_count: 0 },
  { slug: 'healthcare', name_en: 'Healthcare', icon: '⚕️', job_count: 0 },
  { slug: 'digital-services', name_en: 'Digital Services', icon: '💻', job_count: 0 },
  { slug: 'business-services', name_en: 'Business Services', icon: '📊', job_count: 0 },
  { slug: 'hospitality', name_en: 'Hospitality', icon: '🍽️', job_count: 0 },
  { slug: 'agriculture', name_en: 'Agriculture', icon: '🌾', job_count: 0 },
  { slug: 'manufacturing', name_en: 'Manufacturing', icon: '🏭', job_count: 0 },
  { slug: 'beauty-wellness', name_en: 'Beauty & Wellness', icon: '💇', job_count: 0 },
  { slug: 'event-services', name_en: 'Event Services', icon: '🎉', job_count: 0 },
  { slug: 'retail', name_en: 'Retail', icon: '🛍️', job_count: 0 },
];
