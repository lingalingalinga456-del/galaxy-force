import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';
import { JobCard } from '@/components/design-system/JobCard';
import { CategoryChip } from '@/components/design-system/CategoryChip';
import { MobileBottomNav } from '@/components/design-system/MobileBottomNav';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string }> }) {
  const supabase = await createClient();
  const { search, category } = await searchParams;

  let query = supabase
    .from('jobs')
    .select('id, title, description, budget_type, budget_min, budget_max, experience_level, skills, status, created_at, category_id, profiles!inner(full_name, username), categories(name_en, name_bn, slug)')
    .eq('status', 'open')
    .eq('moderation_state', 'approved');

  if (search) query = query.ilike('title', `%${search}%`);
  if (category) query = query.eq('categories.slug', category);

  const { data: jobs } = await query.order('created_at', { ascending: false }).limit(30);
  const { data: categories } = await supabase.from('categories').select('*').eq('is_active', true).order('sort_order');

  return (
    <div className="min-h-screen bg-warm-cream">
      <MarketingHeader />
      <section className="py-10 bg-warm-beige">
        <div className="container mx-auto px-4">
          <h1 className="text-heading text-3xl md:text-4xl font-bold mb-2">Find Work</h1>
          <p className="text-warm-muted mb-6">Browse open jobs from clients across Bangladesh and beyond.</p>
          <form action="/jobs" method="GET" className="max-w-2xl">
            <div className="relative">
              <Input name="search" defaultValue={search || ''} placeholder="Search jobs by title or skill..." className="w-full pr-32" />
              <Button type="submit" className="absolute right-1 top-1">Search</Button>
            </div>
          </form>
          <div className="flex flex-wrap gap-2 mt-4">
            <CategoryChip label="All" active={!category} href="/jobs" />
            {(categories || []).map((c: any) => (
              <CategoryChip
                key={c.slug}
                label={c.name_en}
                icon={c.icon}
                active={category === c.slug}
                href={`/jobs?category=${c.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 grid gap-4">
          {(jobs || []).map((job: any) => (
            <JobCard
              key={job.id}
              job={{
                id: job.id,
                title: job.title,
                clientName: job.profiles?.full_name,
                budgetType: job.budget_type,
                budget: Number(job.budget_max || job.budget_min || 0),
                location: job.categories?.name_en,
                postedAt: new Date(job.created_at).toLocaleDateString(),
              }}
            />
          ))}
          {(!jobs || jobs.length === 0) && (
            <div className="text-center py-12 text-warm-muted">No jobs found. Try a different search.</div>
          )}
        </div>
      </section>

      {/* Floating Post a Job button */}
      <Link href="/client/jobs/new" className="fixed bottom-20 right-6 z-40 lg:bottom-8">
        <Button size="lg" className="rounded-full shadow-card-lift gap-2">
          <Plus className="w-5 h-5" /> Post a Job
        </Button>
      </Link>

      <MarketingFooter />
      <MobileBottomNav />
    </div>
  );
}
