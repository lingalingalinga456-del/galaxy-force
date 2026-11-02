import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminTransactionsPage() {
  const supabase = await createClient();
  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, amount, currency, status, type, provider, is_demo, created_at, user_id')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Transactions</h1>
      <div className="grid gap-3">
        {transactions?.map((t: any) => (
          <Card key={t.id} className="p-5 flex items-center justify-between">
            <div>
              <div className="font-medium text-warm-ink capitalize">{t.type} · {t.provider || 'manual'}</div>
              <div className="text-xs text-warm-muted">{new Date(t.created_at).toLocaleString()}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">৳{Number(t.amount || 0).toLocaleString()}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="capitalize">{t.status}</Badge>
                {t.is_demo && <Badge variant="gold">Demo</Badge>}
              </div>
            </div>
          </Card>
        ))}
        {!transactions?.length && <p className="text-warm-muted">No transactions.</p>}
      </div>
    </div>
  );
}
