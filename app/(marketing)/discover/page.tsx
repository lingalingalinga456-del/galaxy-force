import { createClient } from '@/lib/supabase/server';
import { DiscoverClient } from '@/components/discover/DiscoverClient';

export const dynamic = 'force-dynamic';

export default async function DiscoverPage() {
  const supabase = await createClient();

  let realWorkers: any[] = [];
  let realTeams: any[] = [];
  let realShops: any[] = [];
  let realProducts: any[] = [];
  let categories: any[] = [];

  try {
    const { data: talentRows } = await supabase
      .from('talent_profiles')
      .select(`id, headline, primary_occupation, hourly_rate, completion_score, skills, worker_status, worker_meta, profiles!inner(id, full_name, username, avatar_url, is_verified)`)
      .eq('profiles.status', 'active')
      .eq('profiles.profile_visibility', 'public')
      .limit(60);
    realWorkers = (talentRows || []).map((t: any) => ({
      id: t.profiles?.id,
      username: t.profiles?.username,
      name: t.profiles?.full_name || 'Worker',
      role: t.primary_occupation || t.headline,
      category: slugify(t.primary_occupation || t.headline),
      photo: t.profiles?.avatar_url || '',
      score: Number(t.completion_score || 4.5).toFixed(1),
      verified: !!t.profiles?.is_verified,
      rate: Number(t.hourly_rate || 0),
      jobs: Number(t.completion_score || 0) * 10,
      distance: 1 + ((Number(t.completion_score) || 1) % 9),
      availability: t.worker_status === 'available' ? 'Available' : t.worker_status === 'emergency_only' ? 'Emergency' : t.worker_status === 'appointment' ? 'By Appt' : 'Busy',
      match: 70 + (Number(t.completion_score) || 1) % 28,
      skills: t.skills || [],
    }));

    const { data: teams } = await supabase.from('teams').select('id, name, leader_name, member_count, rating, location, category, banner_url').limit(30);
    realTeams = (teams || []).map((t: any) => ({
      id: t.id, name: t.name, leaderName: t.leader_name, memberCount: t.member_count, rating: Number(t.rating || 4.5).toFixed(1), location: t.location, category: t.category, photo: t.banner_url || '',
    }));

    const { data: shops } = await supabase.from('shop_profiles').select('id, shop_name, business_type, city, trust_score, banner_url').eq('verification_status', 'verified').limit(30);
    realShops = (shops || []).map((s: any) => ({
      id: s.id, name: s.shop_name, category: s.business_type, location: s.city, score: Number(s.trust_score || 4.5).toFixed(1), products: 8, banner: s.banner_url || '',
    }));

    const { data: products } = await supabase.from('products').select('id, name, category, price, image_url, shop_profiles(shop_name)').eq('status', 'published').limit(100);
    realProducts = (products || []).map((p: any) => ({
      id: p.id, name: p.name, category: p.category, price: Number(p.price || 0), image: p.image_url || '', shop: p.shop_profiles?.shop_name || 'Shop',
    }));

    const { data: cats } = await supabase.from('categories').select('slug, name_en, icon').eq('is_active', true).order('sort_order');
    categories = cats || [];
  } catch (e) {
    console.error('Error fetching discover data:', e);
  }

  return (
    <DiscoverClient
      categories={categories}
      realWorkers={realWorkers}
      realTeams={realTeams}
      realShops={realShops}
      realProducts={realProducts}
    />
  );
}

function slugify(s: string) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
}
