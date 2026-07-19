import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');
  const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
  if (!shop) return redirect('/onboarding?role=shop_owner');

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at, client_id')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Orders</h1>
      {orders && orders.length > 0 ? (
        <div className="space-y-2">
          {orders.map((o: any) => (
            <Link key={o.id} href={`/shop-owner/orders/${o.id}`}>
              <Card className="p-4 hover:shadow-card-hover transition-all flex items-center justify-between">
                <div>
                  <p className="font-medium text-warm-ink">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-sm text-warm-muted capitalize">{o.status} · {new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <span className="font-semibold text-warm-green">৳{Number(o.total_amount || 0).toLocaleString()}</span>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center text-warm-muted">No orders yet.</Card>
      )}
    </div>
  );
}
