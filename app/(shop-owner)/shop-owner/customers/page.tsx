import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Users } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');
  const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
  if (!shop) return redirect('/onboarding?role=shop_owner');

  const { data: orders } = await supabase
    .from('orders')
    .select('client_id, profiles(full_name, email)')
    .eq('shop_id', shop.id);

  const seen = new Map<string, any>();
  (orders || []).forEach((o: any) => {
    if (o.client_id && !seen.has(o.client_id)) seen.set(o.client_id, o.profiles);
  });
  const customers = Array.from(seen.values());

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Customers</h1>
      {customers.length > 0 ? (
        <div className="space-y-2">
          {customers.map((c: any, i: number) => (
            <Card key={i} className="p-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-warm-muted" />
              <div>
                <p className="font-medium text-warm-ink">{c?.full_name || 'Customer'}</p>
                <p className="text-sm text-warm-muted">{c?.email || ''}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center text-warm-muted">No customers yet. They will appear here after placing orders.</Card>
      )}
    </div>
  );
}
