import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/';

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Get user role and redirect appropriately
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        let redirectPath = '/';
        if (profile?.role === 'client') {
          redirectPath = '/client';
        } else if (profile?.role === 'talent') {
          redirectPath = '/talent-dashboard';
        } else if (profile?.role === 'admin') {
          redirectPath = '/admin';
        }
        
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
    }
  }

  // If there's an error or no code, redirect to login
  return NextResponse.redirect(new URL(next, request.url));
}