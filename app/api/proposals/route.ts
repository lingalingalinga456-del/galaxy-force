import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { jobId, coverLetter, bidAmount, currency, deliveryDays } = body;

    if (!jobId || !coverLetter || !bidAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('proposals')
      .insert({
        job_id: jobId,
        talent_id: user.id,
        cover_letter: coverLetter,
        bid_amount: Number(bidAmount),
        currency: currency || 'BDT',
        delivery_days: deliveryDays ? Number(deliveryDays) : null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, id: data.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
