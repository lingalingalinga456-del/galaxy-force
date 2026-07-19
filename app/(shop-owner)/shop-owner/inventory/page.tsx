import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function InventoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');
  const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
  if (!shop) return redirect('/onboarding?role=shop_owner');

  const { data: products } = await supabase
    .from('products')
    .select('id, name, stock_quantity, category')
    .eq('shop_id', shop.id)
    .order('stock_quantity', { ascending: true });

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Inventory</h1>
      {products && products.length > 0 ? (
        <div className="space-y-2">
          {products.map((p: any) => {
            const out = p.stock_quantity <= 0;
            const low = p.stock_quantity > 0 && p.stock_quantity <= 5;
            return (
              <Card key={p.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-warm-ink">{p.name}</p>
                  <p className="text-sm text-warm-muted">{p.category}</p>
                </div>
                <span className={`text-sm font-semibold ${out ? 'text-warm-red' : low ? 'text-warm-gold' : 'text-warm-green'}`}>
                  {out ? 'Out of stock' : low ? `Low stock (${p.stock_quantity})` : `${p.stock_quantity} in stock`}
                </span>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-10 text-center text-warm-muted">No products in inventory yet.</Card>
      )}
    </div>
  );
}
