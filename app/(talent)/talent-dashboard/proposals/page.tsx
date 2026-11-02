import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function TalentProposalsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: proposals } = await supabase
    .from('proposals')
    .select('id, cover_letter, bid_amount, status, created_at, job_id, jobs(title)')
    .eq('talent_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Proposals</h1>
      <div className="grid gap-4">
        {proposals?.map((p: any) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-warm-ink">{p.jobs?.title || 'Job'}</div>
                <p className="text-sm text-warm-muted mt-1 line-clamp-2">{p.cover_letter}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="font-semibold">৳{Number(p.bid_amount || 0).toLocaleString()}</div>
                <Badge variant="outline" className="mt-1 capitalize">{p.status}</Badge>
              </div>
            </div>
          </Card>
        ))}
        {!proposals?.length && <p className="text-warm-muted">You haven't sent any proposals yet. Browse jobs to get started.</p>}
      </div>
    </div>
  );
}
