import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { proposalId, agreedAmount, currency, firstMilestoneTitle, firstMilestoneAmount, firstMilestoneDueDate } = body;

    if (!proposalId || !agreedAmount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: proposal } = await supabase
      .from('proposals')
      .select('id, job_id, talent_id, jobs!inner(owner_id, title)')
      .eq('id', proposalId)
      .single() as any;

    if (!proposal) return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    if (proposal.jobs.owner_id !== user.id) {
      return NextResponse.json({ error: 'Not authorized' }, { status: 403 });
    }

    const { data: contract, error: contractError } = await supabase
      .from('contracts')
      .insert({
        job_id: proposal.job_id,
        client_id: user.id,
        talent_id: proposal.talent_id,
        agreed_amount: Number(agreedAmount),
        currency: currency || 'BDT',
        status: 'active',
      })
      .select('id')
      .single();

    if (contractError) return NextResponse.json({ error: contractError.message }, { status: 400 });

    if (firstMilestoneTitle && firstMilestoneAmount) {
      await supabase.from('milestones').insert({
        contract_id: contract.id,
        title: firstMilestoneTitle,
        amount: Number(firstMilestoneAmount),
        currency: currency || 'BDT',
        due_date: firstMilestoneDueDate || null,
        status: 'pending',
        order_index: 1,
      });
    }

    await supabase.from('proposals').update({ status: 'accepted' }).eq('id', proposalId);
    await supabase.from('jobs').update({ status: 'in_progress' }).eq('id', proposal.job_id);

    return NextResponse.json({ ok: true, contractId: contract.id });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
