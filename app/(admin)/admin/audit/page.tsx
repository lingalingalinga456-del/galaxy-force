import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  const supabase = await createClient();
  const { data: logs } = await supabase
    .from('admin_audit_logs')
    .select('id, action, entity_type, reason, created_at, admin_id')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Audit Log</h1>
      <div className="grid gap-3">
        {logs?.map((l: any) => (
          <Card key={l.id} className="p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium text-warm-ink capitalize">{l.action} · {l.entity_type}</div>
              <div className="text-xs text-warm-muted">{new Date(l.created_at).toLocaleString()}</div>
            </div>
            {l.reason && <p className="text-sm text-warm-muted mt-1">{l.reason}</p>}
          </Card>
        ))}
        {!logs?.length && <p className="text-warm-muted">No audit entries yet.</p>}
      </div>
    </div>
  );
}
