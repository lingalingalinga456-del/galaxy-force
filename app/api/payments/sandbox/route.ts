import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sandboxPaymentSchema } from '@/lib/validations';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = sandboxPaymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.errors }, { status: 400 });
  }

  const { provider, contractId, milestoneId, demoAccountNumber, demoAuthCode } = parsed.data;

  const { data: contract, error: contractError } = await supabase
    .from('contracts')
    .select('id, client_id, talent_id, status')
    .eq('id', contractId)
    .single();

  if (contractError || !contract) {
    return NextResponse.json({ error: 'Contract not found' }, { status: 404 });
  }

  if (contract.client_id !== user.id) {
    return NextResponse.json({ error: 'Not authorized for this contract' }, { status: 403 });
  }

  const { data: milestone, error: milestoneError } = await supabase
    .from('milestones')
    .select('id, amount, status')
    .eq('id', milestoneId)
    .eq('contract_id', contractId)
    .single();

  if (milestoneError || !milestone) {
    return NextResponse.json({ error: 'Milestone not found' }, { status: 404 });
  }

  if (milestone.status !== 'approved') {
    return NextResponse.json({ error: 'Milestone must be approved first' }, { status: 400 });
  }

  const { error: transactionError } = await supabase.from('transactions').insert({
    contract_id: contractId,
    milestone_id: milestoneId,
    user_id: user.id,
    provider,
    provider_ref: `demo_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    amount: milestone.amount,
    currency: 'BDT',
    status: 'available',
    type: 'payment',
    is_demo: true,
    metadata: {
      demo_account_number: demoAccountNumber,
      demo_auth_code: demoAuthCode,
      sandbox_simulation: true,
    },
  });

  if (transactionError) {
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Demo transaction created. No funds were moved.',
    isDemo: true,
    provider,
    amount: milestone.amount,
    reference: `demo_${Date.now()}`,
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
