import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function ClientJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: job } = await supabase
    .from('jobs')
    .select('*, proposals(id, cover_letter, bid_amount, status, talent_id, profiles!inner(full_name, username))')
    .eq('id', id)
    .single();

  if (!job) return <div className="p-8 text-warm-muted">Job not found.</div>;
  const proposals = job.proposals || [];

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-warm-ink">{job.title}</h1>
      <div className="flex items-center gap-3 mt-2">
        <Badge variant="outline" className="capitalize">{job.status.replace('_', ' ')}</Badge>
        <span className="text-sm text-warm-muted">৳{Number(job.budget_max || job.budget_min || 0).toLocaleString()} · {job.budget_type}</span>
      </div>
      <p className="mt-6 whitespace-pre-wrap text-warm-ink leading-relaxed">{job.description}</p>

      <h2 className="text-lg font-semibold mt-10 mb-4">Proposals ({proposals.length})</h2>
      <div className="grid gap-4">
        {proposals.map((p: any) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-warm-ink">{p.profiles?.full_name}</div>
                <p className="text-sm text-warm-muted mt-1 line-clamp-3">{p.cover_letter}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold">৳{Number(p.bid_amount || 0).toLocaleString()}</div>
                <Badge variant="outline" className="mt-1 capitalize">{p.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
        {proposals.length === 0 && <p className="text-warm-muted">No proposals yet.</p>}
      </div>
    </div>
  );
}
