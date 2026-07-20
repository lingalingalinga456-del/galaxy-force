import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, ClipboardList, Star, Plus, ShoppingBag } from 'lucide-react';
import { SectionTitle } from '@/components/design-system/SectionTitle';
import { MetricCard } from '@/components/design-system/MetricCard';
import { StatusPill } from '@/components/design-system/StatusPill';
import { TrustVerificationRow } from '@/components/design-system/TrustVerificationRow';

export const dynamic = 'force-dynamic';

const orderStage: Record<string, { label: string; variant: 'gold' | 'blue' | 'green' | 'red' }> = {
  pending: { label: 'Pending', variant: 'gold' },
  confirmed: { label: 'Confirmed', variant: 'blue' },
  shipped: { label: 'Shipped', variant: 'blue' },
  delivered: { label: 'Delivered', variant: 'green' },
  cancelled: { label: 'Cancelled', variant: 'red' },
};

export default async function ShopOwnerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');

  const { data: shop } = await supabase.from('shop_profiles').select('*').eq('user_id', user.id).single();
  if (!shop) return redirect('/onboarding?role=shop_owner');

  const { data: products } = await supabase.from('products').select('id, name, price, stock_quantity, status, category, image_url').eq('shop_id', shop.id).order('created_at', { ascending: false }).limit(6);
  const { data: orders } = await supabase.from('orders').select('id, status, total_amount, created_at').eq('shop_id', shop.id).order('created_at', { ascending: false }).limit(5);

  const totalProducts = products?.length || 0;
  const activeOrders = (orders || []).filter((o: any) => ['pending', 'confirmed', 'shipped'].includes(o.status)).length;
  const revenue = (orders || []).reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);
  const lowStock = (products || []).filter((p: any) => Number(p.stock_quantity || 0) < 5);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Shop header banner */}
      <Card className="p-6 bg-gradient-to-br from-warm-cream to-warm-beige">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-warm-red/10 flex items-center justify-center text-2xl">🏪</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-heading text-2xl font-bold text-warm-ink">{shop.shop_name}</h1>
                <StatusPill label="Open" variant="green" />
              </div>
              <p className="text-warm-muted text-sm">{shop.business_type}{shop.city ? ` · ${shop.city}` : ''}</p>
            </div>
          </div>
          <Link href="/shop-owner/products/new"><Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button></Link>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-warm-gold" />
            <span className="text-sm text-warm-muted">Trust Score <span className="font-bold text-warm-ink">{shop.trust_score}/100</span></span>
            <StatusPill label={shop.verification_status} variant={shop.verification_status === 'verified' ? 'green' : 'gold'} />
          </div>
        </div>
        <div className="mt-3"><TrustVerificationRow verified={shop.verification_status === 'verified' ? ['nid', 'phone', 'admin'] : ['phone']} /></div>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Products" value={totalProducts} icon={<Package className="w-5 h-5" />} accent="red" />
        <MetricCard label="Active Orders" value={activeOrders} icon={<ClipboardList className="w-5 h-5" />} accent="gold" />
        <MetricCard label="Revenue (BDT)" value={revenue.toLocaleString()} icon={<Star className="w-5 h-5" />} accent="green" trend={{ value: '12%', positive: true }} />
      </div>

      {/* Product / menu cards (Foodpanda-style) */}
      <div>
        <SectionTitle action={<Link href="/shop-owner/products" className="text-sm text-warm-red hover:underline">View all</Link>}>Menu</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products?.map((p: any) => (
            <Card key={p.id} className="overflow-hidden group hover:shadow-card-hover transition-all">
              <div className="h-36 bg-gradient-to-br from-warm-beige to-warm-cream flex items-center justify-center text-4xl">
                {p.image_url ? '📦' : '🛒'}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-warm-ink">{p.name}</h3>
                    <p className="text-xs text-warm-muted capitalize">{p.category}</p>
                  </div>
                  <span className="font-semibold text-warm-red">৳{Number(p.price || 0).toLocaleString()}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <StatusPill label={Number(p.stock_quantity || 0) > 0 ? 'In stock' : 'Out of stock'} variant={Number(p.stock_quantity || 0) > 0 ? 'green' : 'red'} />
                </div>
                <Link href={`/shop-owner/products/${p.id}/edit`} className="mt-3 block">
                  <Button size="sm" variant="secondary" className="w-full opacity-0 group-hover:opacity-100 transition-opacity">Edit</Button>
                </Link>
              </div>
            </Card>
          ))}
          {!products?.length && <p className="text-sm text-warm-muted">No products yet.</p>}
        </div>
      </div>

      {/* Orders timeline */}
      <div>
        <SectionTitle action={<Link href="/shop-owner/orders" className="text-sm text-warm-red hover:underline">View all</Link>}>Recent Orders</SectionTitle>
        <div className="space-y-3">
          {orders?.map((o: any) => {
            const stage = orderStage[o.status] || { label: o.status, variant: 'gold' as const };
            return (
              <Link key={o.id} href={`/shop-owner/orders/${o.id}`}>
                <Card className="p-4 hover:shadow-card-hover transition-all flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-warm-beige flex items-center justify-center"><ShoppingBag className="w-5 h-5 text-warm-muted" /></div>
                    <div>
                      <p className="font-medium text-warm-ink">Order #{o.id.slice(0, 8)}</p>
                      <p className="text-xs text-warm-muted capitalize">{o.status}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <StatusPill label={stage.label} variant={stage.variant} />
                    <span className="font-semibold text-warm-green">৳{Number(o.total_amount || 0).toLocaleString()}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
          {!orders?.length && <Card className="p-6 text-sm text-warm-muted">No orders yet.</Card>}
        </div>
      </div>

      {/* Inventory low-stock warning */}
      {lowStock.length > 0 && (
        <div>
          <SectionTitle>Inventory Alerts</SectionTitle>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStock.map((p: any) => (
              <Card key={p.id} className="p-4 border-l-4 border-l-warm-red bg-warm-red/5">
                <p className="font-medium text-warm-ink">{p.name}</p>
                <p className="text-xs text-warm-red mt-1">Low stock: {p.stock_quantity} left</p>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
