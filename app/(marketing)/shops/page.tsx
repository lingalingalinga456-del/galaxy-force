import { createClient } from '@/lib/supabase/server';
import { ShopsDiscoverClient } from '@/components/shop/ShopsDiscoverClient';

export const dynamic = 'force-dynamic';

export default async function ShopsPage() {
  const supabase = await createClient();
  let realShops: any[] = [];
  let realProducts: any[] = [];

  try {
    const { data: shops } = await supabase
      .from('shop_profiles')
      .select('id, shop_name, business_type, city, trust_score, verification_status, banner_url')
      .eq('verification_status', 'verified')
      .limit(30);
    realShops = (shops || []).map((s: any) => ({
      id: s.id,
      name: s.shop_name,
      category: s.business_type || 'Shop',
      subcategory: s.business_type || 'Shop',
      location: s.city || 'Bangladesh',
      score: Number(s.trust_score || 0) > 5 ? (Number(s.trust_score || 0) / 20).toFixed(1) : '4.8',
      products: 20,
      banner: s.banner_url || '',
    }));

    const { data: products } = await supabase
      .from('products')
      .select('id, name, category, price, image_url, shop_profiles(shop_name)')
      .eq('status', 'published')
      .limit(100);
    realProducts = (products || []).map((p: any) => ({
      id: p.id,
      name: p.name,
      shop: p.shop_profiles?.shop_name || 'Shop',
      category: p.category || 'retail-local-shops',
      price: Number(p.price || 0),
      stock: 'In stock',
      image: p.image_url || '',
    }));
  } catch (e) {
    console.error('Shops fetch error:', e);
  }

  return <ShopsDiscoverClient realShops={realShops} realProducts={realProducts} />;
}
