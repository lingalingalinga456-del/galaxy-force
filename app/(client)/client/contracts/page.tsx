import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HourlyJobTimer } from '@/components/contracts/hourly-job-timer';
import { OfflineLifecycle } from '@/components/design-system/OfflineLifecycle';
import { EscrowIndicator } from '@/components/design-system/EscrowIndicator';
import { WarrantyBadge } from '@/components/design-system/WarrantyBadge';
import { SectionTitle } from '@/components/design-system/SectionTitle';

export const dynamic = 'force-dynamic';

const STATUS_TO_STEP: Record<string, any> = {
  active: 'started',
  completed: 'completed',
  awaiting_approval: 'inspection',
  cancelled: 'booked',
  disputed: 'inspection',
};

export default async function ClientContractsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: contracts } = await supabase
    .from('contracts')
    .select('id, agreed_amount, currency, status, created_at, talent_id, budget_type, hourly_rate, profiles!inner(full_name, username)')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <h1 className="text-heading text-2xl font-bold text-warm-ink">Contracts</h1>
      <div className="grid gap-6">
        {contracts?.map((c: any) => (
          <Card key={c.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium text-warm-ink">{c.profiles?.full_name}</div>
                <div className="text-sm text-warm-muted mt-1">Contract #{c.id.slice(0, 8)}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold">৳{Number(c.agreed_amount || 0).toLocaleString()}</div>
                <Badge variant="outline" className="mt-1 capitalize">{c.status}</Badge>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <SectionTitle>Job Lifecycle</SectionTitle>
                <OfflineLifecycle current={STATUS_TO_STEP[c.status] || 'booked'} />
              </div>
              <div className="space-y-4">
                <EscrowIndicator percent={90} />
                <div className="flex items-center gap-3">
                  <span className="text-sm text-warm-muted">Warranty:</span>
                  <WarrantyBadge days={15} />
                </div>
                {c.budget_type === 'hourly' && (
                  <HourlyJobTimer contractId={c.id} hourlyRate={Number(c.hourly_rate || 0)} isClient />
                )}
              </div>
            </div>
          </Card>
        ))}
        {!contracts?.length && <p className="text-warm-muted">No contracts yet.</p>}
      </div>
    </div>
  );
}
