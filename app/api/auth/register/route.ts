import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      fullName,
      username,
      language = 'en',
      role = 'client',
      organizationName,
      businessType,
      country,
      headline,
      skills,
      hourlyRate,
      availability,
    } = body;

    if (!email || !password || !fullName || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, username, role, language },
    });

    if (signUpError) {
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }
    if (!data.user) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 400 });
    }

    const uid = data.user.id;

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: uid, full_name: fullName, username, role, language, profile_visibility: 'public' });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    if (role === 'client') {
      await supabaseAdmin
        .from('client_profiles')
        .upsert({ id: uid, organization_name: organizationName, business_type: businessType, country });
    } else {
      const skillArr = typeof skills === 'string'
        ? skills.split(',').map((s: string) => s.trim()).filter(Boolean)
        : Array.isArray(skills) ? skills : [];
      await supabaseAdmin
        .from('talent_profiles')
        .upsert({
          id: uid,
          headline,
          skills: skillArr,
          hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
          country,
          availability: availability || 'available',
        });
    }

    return NextResponse.json({ ok: true, userId: uid });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
