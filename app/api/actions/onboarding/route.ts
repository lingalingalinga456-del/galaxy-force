import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const headline = formData.get('headline') as string;
    const skillsString = formData.get('skills') as string;
    const hourlyRate = formData.get('hourlyRate') as string;
    const country = formData.get('country') as string;
    const availability = formData.get('availability') as string;

    const supabase = await createServerClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const skills = skillsString ? skillsString.split(',').map(s => s.trim()).filter(s => s) : [];

    // Update talent profile
    const { error: updateError } = await supabase
      .from('talent_profiles')
      .upsert({
        id: user.id,
        headline,
        skills,
        hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
        country,
        availability: availability || 'available',
      });

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    // Calculate completion score
    const completionFields = [headline, skills.length > 0, hourlyRate, country].filter(Boolean).length;
    const completionScore = Math.round((completionFields / 5) * 100);

    await supabase
      .from('talent_profiles')
      .update({ completion_score: completionScore })
      .eq('id', user.id);

    return NextResponse.json({ 
      success: true, 
      redirect: '/talent-dashboard' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}