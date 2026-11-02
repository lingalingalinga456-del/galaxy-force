import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminModerationPage() {
  const supabase = await createClient();
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, moderation_state, owner_id, profiles!inner(full_name)')
    .neq('moderation_state', 'approved')
    .order('created_at', { ascending: false })
    .limit(30);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Moderation Queue</h1>
      <div className="grid gap-3">
        {jobs?.map((j: any) => (
          <Card key={j.id} className="p-5 flex items-center justify-between">
            <div>
              <div className="font-medium text-warm-ink">{j.title}</div>
              <div className="text-xs text-warm-muted">by {j.profiles?.full_name}</div>
            </div>
            <Badge variant="warning" className="capitalize">{j.moderation_state}</Badge>
          </Card>
        ))}
        {!jobs?.length && <p className="text-warm-muted">No items pending moderation.</p>}
      </div>
    </div>
  );
}
