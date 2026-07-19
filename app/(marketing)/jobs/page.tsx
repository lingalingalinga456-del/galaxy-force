import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';

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
            <Link href="/jobs"><Button variant={!category ? 'secondary' : 'ghost'} size="sm">All</Button></Link>
            {(categories || []).map((c: any) => (
              <Link key={c.slug} href={`/jobs?category=${c.slug}`}>
                <Button variant={category === c.slug ? 'secondary' : 'ghost'} size="sm">{c.name_en}</Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 grid gap-4">
          {(jobs || []).map((job: any) => (
            <Link key={job.id} href={`/jobs/${job.id}`} className="block p-6 rounded-xl bg-white border border-warm-border hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-warm-ink text-lg">{job.title}</h3>
                  <p className="text-sm text-warm-muted mt-1 line-clamp-2">{job.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {(job.skills || []).slice(0, 4).map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-warm-ink">
                    ৳{Number(job.budget_max || job.budget_min || 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-warm-muted capitalize">{job.budget_type}</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-warm-muted">
                Posted by {job.profiles?.full_name} · {job.categories?.name_en} · {job.experience_level}
              </div>
            </Link>
          ))}
          {(!jobs || jobs.length === 0) && (
            <div className="text-center py-12 text-warm-muted">
              No jobs found. Try a different search.
            </div>
          )}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
