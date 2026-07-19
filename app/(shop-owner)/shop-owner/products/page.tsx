import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');
  const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
  if (!shop) return redirect('/onboarding?role=shop_owner');

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, stock_quantity, status, category, delivery_days')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-warm-ink">My Products</h1>
        <Link href="/shop-owner/products/new"><Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button></Link>
      </div>

      {products && products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p: any) => (
            <Link key={p.id} href={`/shop-owner/products/${p.id}/edit`}>
              <Card className="p-5 hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-warm-ink">{p.name}</h3>
                    <p className="text-sm text-warm-muted">{p.category}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.status === 'published' ? 'bg-warm-green/10 text-warm-green' : 'bg-warm-gold/10 text-warm-gold'}`}>{p.status}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-warm-green">৳{Number(p.price).toLocaleString()}</span>
                  <span className="text-warm-muted">Stock: {p.stock_quantity}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center">
          <Package className="w-10 h-10 text-warm-muted mx-auto mb-3" />
          <p className="text-warm-muted mb-4">You have no products yet. Add your first product to get started.</p>
          <Link href="/shop-owner/products/new"><Button>Add Product</Button></Link>
        </Card>
      )}
    </div>
  );
}
