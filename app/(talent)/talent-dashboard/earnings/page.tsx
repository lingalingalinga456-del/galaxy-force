import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function TalentEarningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: transactions } = await supabase
    .from('transactions')
    .select('id, amount, currency, status, type, created_at, is_demo')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(30);

  const available = transactions?.filter((t: any) => t.status === 'available').reduce((s: number, t: any) => s + Number(t.amount || 0), 0) || 0;
  const total = transactions?.reduce((s: number, t: any) => s + Number(t.amount || 0), 0) || 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card className="p-6"><p className="text-sm text-warm-muted">Available balance</p><p className="text-3xl font-bold text-warm-ink">৳{available.toLocaleString()}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted">Lifetime earnings</p><p className="text-3xl font-bold text-warm-ink">৳{total.toLocaleString()}</p></Card>
      </div>
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>
      <div className="grid gap-3">
        {transactions?.map((t: any) => (
          <Card key={t.id} className="p-5 flex items-center justify-between">
            <div>
              <div className="font-medium text-warm-ink capitalize">{t.type}</div>
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
        {!transactions?.length && <p className="text-warm-muted">No earnings yet.</p>}
      </div>
    </div>
  );
}
