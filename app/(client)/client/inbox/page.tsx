import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ClientInboxPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, last_message_at, client_id, talent_id')
    .or(`client_id.eq.${user.id},talent_id.eq.${user.id}`)
    .order('last_message_at', { ascending: false })
    .limit(20);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Inbox</h1>
      <div className="grid gap-3">
        {conversations?.map((c: any) => (
          <Link key={c.id} href={`/client/inbox/${c.id}`}>
            <Card className="p-5 hover:shadow-card-hover transition-all">
              <div className="font-medium text-warm-ink">Conversation #{c.id.slice(0, 8)}</div>
              <div className="text-xs text-warm-muted mt-1">
                {c.last_message_at ? new Date(c.last_message_at).toLocaleString() : 'No messages yet'}
              </div>
            </Card>
          </Link>
        ))}
        {!conversations?.length && <p className="text-warm-muted">No conversations yet.</p>}
      </div>
    </div>
  );
}
