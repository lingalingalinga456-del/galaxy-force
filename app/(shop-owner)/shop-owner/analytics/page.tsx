import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function ShopAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');
  const { data: shop } = await supabase.from('shop_profiles').select('id, trust_score').eq('user_id', user.id).single();
  if (!shop) return redirect('/onboarding?role=shop_owner');

  const { data: products } = await supabase.from('products').select('id, status, category, price').eq('shop_id', shop.id);
  const { data: orders } = await supabase.from('orders').select('id, total_amount, status').eq('shop_id', shop.id);

  const published = (products || []).filter((p: any) => p.status === 'published').length;
  const revenue = (orders || []).reduce((s: number, o: any) => s + Number(o.total_amount || 0), 0);
  const byCategory: Record<string, number> = {};
  (products || []).forEach((p: any) => { byCategory[p.category] = (byCategory[p.category] || 0) + 1; });

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6"><p className="text-sm text-warm-muted">Trust Score</p><p className="text-3xl font-bold text-warm-ink">{shop.trust_score}/100</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted">Published Products</p><p className="text-3xl font-bold text-warm-ink">{published}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted">Total Revenue (BDT)</p><p className="text-3xl font-bold text-warm-ink">{revenue.toLocaleString()}</p></Card>
      </div>
      <h2 className="text-lg font-semibold text-warm-ink mb-3">Products by Category</h2>
      <div className="space-y-2">
        {Object.entries(byCategory).map(([cat, count]) => (
          <Card key={cat} className="p-4 flex items-center justify-between">
            <span className="font-medium text-warm-ink">{cat}</span>
            <span className="text-warm-muted">{count as number}</span>
          </Card>
        ))}
        {Object.keys(byCategory).length === 0 && <Card className="p-6 text-sm text-warm-muted">No products yet.</Card>}
      </div>
    </div>
  );
}
