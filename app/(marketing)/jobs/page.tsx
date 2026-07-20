import { createClient } from '@/lib/supabase/server';
import { FindWorkClient } from '@/components/talent/FindWorkClient';

export const dynamic = 'force-dynamic';

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string }> }) {
  const supabase = await createClient();
  const { search, category } = await searchParams;

  let jobs: any[] = [];
  try {
    let query = supabase
      .from('jobs')
      .select('id, title, description, budget_type, budget_min, budget_max, experience_level, skills, status, created_at, category_id, owner_id, profiles!inner(full_name, username, is_verified), categories(name_en, slug)')
      .eq('status', 'open')
      .eq('moderation_state', 'approved');

    if (search) query = query.ilike('title', `%${search}%`);
    if (category) query = query.eq('categories.slug', category);

    const { data } = await query.order('created_at', { ascending: false }).limit(30);
    jobs = (data || []).map((j: any) => ({
      id: j.id,
      title: j.title,
      description: j.description,
      subcategory: (j.skills && j.skills[0]) || j.categories?.name_en || 'General',
      category: j.categories?.slug || 'skilled-trades',
      clientName: j.profiles?.full_name || 'Client',
      clientVerified: !!j.profiles?.is_verified,
      budgetType: j.budget_type || 'fixed',
      budget: Number(j.budget_max || j.budget_min || 0),
      location: j.categories?.name_en || 'Bangladesh',
      distanceKm: 5,
      jobType: j.experience_level === 'expert' ? 'One-time' : 'One-time',
      proposalsCount: 0,
      postedAt: '1d',
      matchScore: 80,
      skills: j.skills || [],
      experienceLevel: j.experience_level || 'intermediate',
      workersNeeded: 1,
      urgent: false,
      timeline: j.timeline_days ? `${j.timeline_days} days` : '3 days',
    }));
  } catch (e) {
    console.error('Jobs fetch error:', e);
  }

  return <FindWorkClient realJobs={jobs} />;
}
