import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function TalentConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: messages } = await supabase
    .from('messages')
    .select('id, message_text, created_at, sender_id, is_read')
    .eq('conversation_id', id)
    .order('created_at', { ascending: true });

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Conversation</h1>
      <div className="grid gap-3">
        {messages?.map((m: any) => (
          <Card key={m.id} className="p-4">
            <p className="text-warm-ink">{m.message_text}</p>
            <div className="text-xs text-warm-muted mt-1">{new Date(m.created_at).toLocaleString()}</div>
          </Card>
        ))}
        {!messages?.length && <p className="text-warm-muted">No messages in this conversation yet.</p>}
      </div>
    </div>
  );
}
