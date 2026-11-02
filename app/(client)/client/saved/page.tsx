import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ClientSavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: saved } = await supabase
    .from('saved_talent')
    .select('talent_id, profiles!inner(full_name, username, avatar_url)')
    .eq('client_id', user.id)
    .limit(20);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Saved Talent</h1>
      <div className="grid gap-3">
        {saved?.map((s: any) => (
          <Link key={s.talent_id} href={`/talent/${s.profiles?.username}`}>
            <Card className="p-5 hover:shadow-card-hover transition-all">
              <div className="font-medium text-warm-ink">{s.profiles?.full_name}</div>
              <div className="text-xs text-warm-muted">@{s.profiles?.username}</div>
            </Card>
          </Link>
        ))}
        {!saved?.length && <p className="text-warm-muted">You haven't saved any talent yet.</p>}
      </div>
    </div>
  );
}
