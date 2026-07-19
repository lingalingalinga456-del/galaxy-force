import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
    if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .eq('shop_id', shop.id)
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ product: data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, category, price, stock_quantity, delivery_days, status } = body;

    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
    if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });

    const { data, error } = await supabase
      .from('products')
      .insert({
        shop_id: shop.id,
        name,
        description: description || null,
        category,
        price: Number(price),
        stock_quantity: Number(stock_quantity || 0),
        delivery_days: Number(delivery_days || 3),
        status: status || 'draft',
      })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ success: true, id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...fields } = body;
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

    const { data: shop } = await supabase.from('shop_profiles').select('id').eq('user_id', user.id).single();
    if (!shop) return NextResponse.json({ error: 'Shop not found' }, { status: 404 });

    const { error } = await supabase
      .from('products')
      .update({
        ...fields,
        price: fields.price !== undefined ? Number(fields.price) : undefined,
        stock_quantity: fields.stock_quantity !== undefined ? Number(fields.stock_quantity) : undefined,
        delivery_days: fields.delivery_days !== undefined ? Number(fields.delivery_days) : undefined,
      })
      .eq('id', id)
      .eq('shop_id', shop.id);

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
