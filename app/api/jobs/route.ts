import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const {
      title,
      description,
      categoryId,
      skills,
      budgetType,
      budgetMin,
      budgetMax,
      experienceLevel,
      timelineDays,
      visibility,
      timezone,
    } = body;

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('jobs')
      .insert({
        owner_id: user.id,
        title,
        description,
        category_id: categoryId || null,
        skills: Array.isArray(skills) ? skills : [],
        budget_type: budgetType || 'fixed',
        budget_min: budgetMin ? Number(budgetMin) : null,
        budget_max: budgetMax ? Number(budgetMax) : null,
        experience_level: experienceLevel || null,
        timeline_days: timelineDays ? Number(timelineDays) : null,
        visibility: visibility || 'public',
        timezone: timezone || null,
        status: 'open',
        moderation_state: 'approved',
        published_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
