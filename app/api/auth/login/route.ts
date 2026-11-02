import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body.email as string;
    const password = body.password as string;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    let redirectPath = '/';
    if (profile?.role === 'client') {
      redirectPath = '/client';
    } else if (profile?.role === 'talent') {
      redirectPath = '/talent-dashboard';
    } else if (profile?.role === 'admin') {
      redirectPath = '/admin';
    }

    return NextResponse.json({
      success: true,
      redirect: redirectPath,
      user: data.user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}