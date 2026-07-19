import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ClipboardList, Star, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShopOwnerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');

  const { data: shop } = await supabase.from('shop_profiles').select('*').eq('user_id', user.id).single();
  if (!shop) return redirect('/onboarding?role=shop_owner');

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, stock_quantity, status, category')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false });

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_amount, created_at')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const totalProducts = products?.length || 0;
  const activeOrders = (orders || []).filter((o: any) => ['pending', 'confirmed', 'shipped'].includes(o.status)).length;
  const revenue = (orders || []).reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-warm-ink">{shop.shop_name}</h1>
          <p className="text-warm-muted">{shop.business_type}{shop.city ? ` · ${shop.city}` : ''}</p>
        </div>
        <Link href="/shop-owner/products/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
        </Link>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-warm-border bg-white p-4 shadow-card">
        <Star className="h-6 w-6 text-warm-gold" />
        <div>
          <p className="text-sm text-warm-muted">Trust Score</p>
          <p className="text-2xl font-bold text-warm-ink">{shop.trust_score}/100</p>
        </div>
        <span className={`ml-3 rounded-full px-3 py-1 text-xs ${shop.verification_status === 'verified' ? 'bg-warm-green/10 text-warm-green' : 'bg-warm-gold/10 text-warm-gold'}`}>
          {shop.verification_status}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6"><p className="text-sm text-warm-muted flex items-center gap-2"><Package className="w-4 h-4" /> Products</p><p className="text-3xl font-bold text-warm-ink">{totalProducts}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted flex items-center gap-2"><ClipboardList className="w-4 h-4" /> Active Orders</p><p className="text-3xl font-bold text-warm-ink">{activeOrders}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted flex items-center gap-2"><Star className="w-4 h-4" /> Revenue (BDT)</p><p className="text-3xl font-bold text-warm-ink">{revenue.toLocaleString()}</p></Card>
      </div>

      <h2 className="text-lg font-semibold text-warm-ink mb-3">Recent Orders</h2>
      {orders && orders.length > 0 ? (
        <div className="space-y-2">
          {orders.map((o: any) => (
            <Link key={o.id} href={`/shop-owner/orders/${o.id}`}>
              <Card className="p-4 hover:shadow-card-hover transition-all flex items-center justify-between">
                <div>
                  <p className="font-medium text-warm-ink">Order #{o.id.slice(0, 8)}</p>
                  <p className="text-sm text-warm-muted capitalize">{o.status}</p>
                </div>
                <span className="font-semibold text-warm-green">৳{Number(o.total_amount || 0).toLocaleString()}</span>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-6 text-sm text-warm-muted">No orders yet.</Card>
      )}
    </div>
  );
}
