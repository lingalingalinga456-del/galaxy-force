import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const { data: shop } = await supabase.from('shop_profiles').select('*').eq('user_id', user.id).single();
  if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
  return NextResponse.json({ shop });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
    if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });

    const { error } = await supabase
      .from('shop_profiles')
      .update({
        shop_name: body.shop_name,
        business_type: body.business_type,
        address: body.address,
        city: body.city,
        phone: body.phone,
        delivery_radius_km: body.delivery_radius_km !== undefined ? Number(body.delivery_radius_km) : undefined,
        min_order_amount: body.min_order_amount !== undefined ? Number(body.min_order_amount) : undefined,
      })
      .eq('id', shop.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
