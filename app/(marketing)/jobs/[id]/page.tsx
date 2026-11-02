import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';

export const dynamic = 'force-dynamic';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: job } = await supabase
    .from('jobs')
    .select('*, profiles!inner(full_name, username, avatar_url), categories(name_en, name_bn, slug)')
    .eq('id', id)
    .single();

  if (!job) notFound();

  return (
    <div className="min-h-screen bg-warm-cream">
      <MarketingHeader />
      <section className="container mx-auto px-4 py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Link href="/jobs" className="text-sm text-warm-red hover:underline">← Back to jobs</Link>
          <h1 className="text-heading text-3xl font-bold mt-4">{job.title}</h1>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge>{job.categories?.name_en}</Badge>
            <Badge variant="outline" className="capitalize">{job.budget_type}</Badge>
            <Badge variant="outline" className="capitalize">{job.experience_level}</Badge>
          </div>
          <p className="mt-6 text-warm-ink whitespace-pre-wrap leading-relaxed">{job.description}</p>
          <div className="flex flex-wrap gap-2 mt-6">
            {(job.skills || []).map((s: string) => <Badge key={s} variant="gold">{s}</Badge>)}
          </div>
        </div>
        <aside className="lg:col-span-1">
          <div className="p-6 rounded-xl bg-white border border-warm-border sticky top-24">
            <div className="text-2xl font-bold text-warm-ink">
              ৳{Number(job.budget_max || job.budget_min || 0).toLocaleString()}
            </div>
            <div className="text-sm text-warm-muted capitalize mb-4">{job.budget_type} budget</div>
            <Link href={`/talent`} className="block">
              <Button className="w-full">Apply / Propose</Button>
            </Link>
            <div className="mt-4 text-sm text-warm-muted">
              Posted by <span className="text-warm-ink font-medium">{job.profiles?.full_name}</span>
            </div>
            {job.timeline_days && (
              <div className="mt-1 text-xs text-warm-muted">Estimated {job.timeline_days} days</div>
            )}
          </div>
        </aside>
      </section>
      <MarketingFooter />
    </div>
  );
}
