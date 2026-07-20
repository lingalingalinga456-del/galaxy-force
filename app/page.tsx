import { createClient } from '@/lib/supabase/server';
import HomeContent from '@/components/home/HomeContent';

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
      availability: t.worker_status === 'available' || t.worker_status === 'emergency_only' ? 'Available' : 'Busy',
      match: Math.min(98, Math.round(80 + (Number(t.completion_score || 0)))),
    }));

    const [{ count: verifiedWorkers }, { count: companies }, { count: jobsCompleted }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'talent').eq('is_verified', true),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'client'),
      supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
    ]);

    stats = {
      verifiedWorkers: verifiedWorkers ?? 0,
      companies: companies ?? 0,
      jobsCompleted: jobsCompleted ?? 0,
      avgRating: 4.9,
    };

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

  return <HomeContent categories={categories} stats={stats} featuredWorkers={featuredWorkers} activity={activity} shops={shops} products={products} />;
}
