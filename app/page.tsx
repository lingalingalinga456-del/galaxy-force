import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmoothScroll } from '@/components/home/SmoothScroll';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustTicker } from '@/components/home/TrustTicker';
import { CategoryEcosystem } from '@/components/home/CategoryEcosystem';
import { HowItWorks } from '@/components/home/HowItWorks';
import { AIMatchShowcase } from '@/components/home/AIMatchShowcase';
import { FeaturedWorkers } from '@/components/home/FeaturedWorkers';
import { LocalShopsSection } from '@/components/home/LocalShopsSection';
import { BeforeAfterSlider } from '@/components/home/BeforeAfterSlider';
import { ActivityTicker } from '@/components/home/ActivityTicker';
import { SuccessStories } from '@/components/home/SuccessStories';
import { WhyGalaxy } from '@/components/home/WhyGalaxy';
import { PricingPreview } from '@/components/home/PricingPreview';
import { FAQ } from '@/components/home/FAQ';
import { FinalCTA } from '@/components/home/FinalCTA';

export const dynamic = 'force-dynamic';

const fallbackCategories = [
  { slug: 'skilled-trades', name_en: 'Skilled Trades', icon: '🔧', job_count: 1240 },
  { slug: 'home-services', name_en: 'Home Services', icon: '🧹', job_count: 980 },
  { slug: 'automotive', name_en: 'Automotive', icon: '🚗', job_count: 720 },
  { slug: 'construction', name_en: 'Construction', icon: '🏗️', job_count: 650 },
  { slug: 'repair-maintenance', name_en: 'Repair & Maintenance', icon: '🛠️', job_count: 540 },
  { slug: 'transportation', name_en: 'Transportation', icon: '🚚', job_count: 410 },
  { slug: 'security', name_en: 'Security', icon: '🛡️', job_count: 300 },
  { slug: 'professional-services', name_en: 'Professional Services', icon: '💼', job_count: 480 },
  { slug: 'education', name_en: 'Education', icon: '📚', job_count: 760 },
  { slug: 'healthcare', name_en: 'Healthcare', icon: '⚕️', job_count: 390 },
  { slug: 'digital-services', name_en: 'Digital Services', icon: '💻', job_count: 1120 },
  { slug: 'business-services', name_en: 'Business Services', icon: '📊', job_count: 560 },
  { slug: 'hospitality', name_en: 'Hospitality', icon: '🍽️', job_count: 430 },
  { slug: 'agriculture', name_en: 'Agriculture', icon: '🌾', job_count: 280 },
  { slug: 'manufacturing', name_en: 'Manufacturing', icon: '🏭', job_count: 360 },
  { slug: 'beauty-wellness', name_en: 'Beauty & Wellness', icon: '💇', job_count: 510 },
  { slug: 'event-services', name_en: 'Event Services', icon: '🎉', job_count: 340 },
  { slug: 'retail', name_en: 'Retail', icon: '🛍️', job_count: 470 },
];

const FALLBACK_ACTIVITY = [
  { text: 'Rafi hired a mechanic in Dhanmondi', time: '2m' },
  { text: 'New job posted: AC Repair in Uttara', time: '5m' },
  { text: 'Cleaner completed 3 jobs today', time: '8m' },
  { text: 'Sara matched with 2 new students', time: '11m' },
  { text: 'Tanvir finished a construction project', time: '14m' },
  { text: 'New company joined: BuildRight Ltd', time: '18m' },
];

export default async function Home() {
  const supabase = await createClient();
  let categories: any[] = [];
  let featuredWorkers: any[] = [];
  let stats: any = undefined;
  let activity: any[] = [];
  let shops: any[] = [];
  let products: any[] = [];

  try {
    const { data: cats } = await supabase
      .from('categories')
      .select('slug, name_en, icon, worker_count, job_count, typical_rate_min, typical_rate_max')
      .eq('is_active', true)
      .order('sort_order')
      .limit(18);
    categories = cats || [];

    const { data: talent } = await supabase
      .from('talent_profiles')
      .select('id, headline, primary_occupation, hourly_rate, completion_score, worker_status, skills, profiles!inner(id, full_name, username, is_verified, avatar_url, status, profile_visibility)')
      .eq('profiles.status', 'active')
      .eq('profiles.profile_visibility', 'public')
      .order('completion_score', { ascending: false })
      .limit(8);

    featuredWorkers = (talent || []).map((t: any) => ({
      id: t.id,
      username: t.profiles?.username,
      name: t.profiles?.full_name || 'Worker',
      role: t.primary_occupation || t.headline || 'Professional',
      photo: t.profiles?.avatar_url || undefined,
      score: Number(t.completion_score || 0) >= 5 ? (Number(t.completion_score || 0) / 20).toFixed(1) : '4.8',
      verified: !!t.profiles?.is_verified,
      rate: Number(t.hourly_rate || 0) || 400,
      jobs: Math.round(Number(t.completion_score || 0) * 10),
      location: 'Bangladesh',
      availability: t.worker_status === 'available' || t.worker_status === 'emergency_only' ? 'Available' : 'Busy',
      match: Math.min(98, Math.round(80 + (Number(t.completion_score || 0)))),
    }));

    const [{ count: verifiedWorkers }, { count: companies }, { count: jobsCompleted }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'talent').eq('is_verified', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
      supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    ]);

    stats = { verifiedWorkers: verifiedWorkers ?? 0, companies: companies ?? 0, jobsCompleted: jobsCompleted ?? 0, avgRating: 4.9 };

    const { data: shopRows } = await supabase
      .from('shop_profiles')
      .select('id, shop_name, business_type, city, trust_score, verification_status')
      .eq('verification_status', 'verified')
      .limit(6);
    shops = (shopRows || []).map((s: any) => ({
      id: s.id,
      name: s.shop_name,
      category: s.business_type || 'Shop',
      location: s.city || 'Bangladesh',
      score: Number(s.trust_score || 0) > 5 ? (Number(s.trust_score || 0) / 20).toFixed(1) : '4.8',
      products: 20,
    }));

    const { data: prodRows } = await supabase
      .from('products')
      .select('id, name, price, status, shop_profiles(shop_name)')
      .eq('status', 'published')
      .limit(10);
    products = (prodRows || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      shop: p.shop_profiles?.shop_name || 'Shop',
      price: Number(p.price || 0),
      stock: 'In stock',
    }));

    activity = FALLBACK_ACTIVITY;
  } catch (e) {
    console.error('Home fetch error:', e);
  }

  if (!categories.length) categories = fallbackCategories;

  return (
    <SmoothScroll>
      <main className="bg-[#FAF7F2]">
        <header className="sticky top-0 z-50 border-b border-warm-border bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-warm-red flex items-center justify-center"><Sparkles className="w-6 h-6 text-white" /></div>
              <span className="text-heading text-xl font-bold">Galaxy Workforce</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/discover" className="hover:text-warm-red">Discover</Link>
              <Link href="/jobs" className="hover:text-warm-red">Find Work</Link>
              <Link href="/shops" className="hover:text-warm-red">Shops</Link>
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

        <HeroSection />
        <TrustTicker stats={stats} />
        <CategoryEcosystem categories={categories} />
        <HowItWorks />
        <AIMatchShowcase />
        <FeaturedWorkers workers={featuredWorkers} />
        <LocalShopsSection shops={shops} products={products} />
        <BeforeAfterSlider />
        <ActivityTicker activity={activity} />
        <SuccessStories />
        <WhyGalaxy />
        <PricingPreview />
        <FAQ />
        <FinalCTA />

        <footer className="bg-warm-ink text-white py-12">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-warm-red flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
                <span className="text-heading text-lg font-bold">Galaxy Workforce</span>
              </div>
              <p className="text-sm text-white/70">AI-powered human workforce marketplace for Bangladesh and beyond.</p>
            </div>
            <div><h3 className="font-semibold mb-4">Product</h3><ul className="space-y-2 text-sm text-white/70"><li><Link href="/discover" className="hover:text-white">Discover</Link></li><li><Link href="/jobs" className="hover:text-white">Find Work</Link></li><li><Link href="/shops" className="hover:text-white">Shops</Link></li><li><Link href="/pricing" className="hover:text-white">Pricing</Link></li></ul></div>
            <div><h3 className="font-semibold mb-4">Support</h3><ul className="space-y-2 text-sm text-white/70"><li><Link href="/faq" className="hover:text-white">FAQ</Link></li><li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li><li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li></ul></div>
            <div><h3 className="font-semibold mb-4">Contact</h3><ul className="space-y-2 text-sm text-white/70"><li>support@galaxyworkforce.com</li><li>Dhaka, Bangladesh</li></ul></div>
          </div>
          <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">© 2026 Galaxy Workforce. All rights reserved.</div>
        </footer>
      </main>
    </SmoothScroll>
  );
}
