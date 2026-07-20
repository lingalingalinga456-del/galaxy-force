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

export default async function Home() {
  const supabase = await createClient();
  let categories: any[] = [];
  try {
    const { data } = await supabase
      .from('categories')
      .select('slug, name_en, icon, worker_count, job_count, typical_rate_min, typical_rate_max')
      .eq('is_active', true)
      .order('sort_order')
      .limit(18);
    categories = data || [];
  } catch {}
  if (!categories.length) {
    categories = fallbackCategories;
  }

  return <HomeContent categories={categories} />;
}
