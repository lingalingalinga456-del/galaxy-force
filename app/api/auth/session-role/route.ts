import { NextResponse } from 'next/server';
import { getUserRole } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const role = await getUserRole();
  return NextResponse.json({ role: role ?? null, authed: !!role });
}
