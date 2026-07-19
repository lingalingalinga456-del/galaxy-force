import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');
  const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
  if (!shop) return redirect('/onboarding?role=shop_owner');

  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(id, quantity, unit_price, product_id, products(name))')
    .eq('id', id)
    .eq('shop_id', shop.id)
    .single();

  if (error || !order) return redirect('/shop-owner/orders');

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link href="/shop-owner/orders" className="text-sm text-warm-red hover:underline">← Back to Orders</Link>
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-warm-ink">Order #{order.id.slice(0, 8)}</h1>
        <span className="rounded-full bg-warm-gold/10 px-3 py-1 text-sm text-warm-gold capitalize">{order.status}</span>
      </div>

      <Card className="p-6 mt-4">
        <p className="text-sm text-warm-muted">Total</p>
        <p className="text-2xl font-bold text-warm-ink">৳{Number(order.total_amount || 0).toLocaleString()}</p>
        {order.delivery_address && (
          <p className="mt-3 text-sm text-warm-muted">Delivery: {order.delivery_address}</p>
        )}
      </Card>

      <h2 className="text-lg font-semibold text-warm-ink mt-6 mb-3">Items</h2>
      <div className="space-y-2">
        {(order.order_items || []).map((it: any) => (
          <Card key={it.id} className="p-4 flex items-center justify-between">
            <span className="font-medium text-warm-ink">{it.products?.name || 'Product'}</span>
            <span className="text-sm text-warm-muted">x{it.quantity} · ৳{Number(it.unit_price).toLocaleString()}</span>
          </Card>
        ))}
      </div>

      {order.status === 'pending' && (
        <div className="mt-6 flex gap-3">
          <form action={`/api/orders/${order.id}/confirm`} method="POST">
            <Button type="submit">Confirm Order</Button>
          </form>
        </div>
      )}
    </div>
  );
}
