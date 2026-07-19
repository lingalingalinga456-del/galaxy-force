import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminImpactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return redirect('/admin');

  const safeCount = async (q: any) => { try { const { count } = await q; return count || 0; } catch { return 0; } };
  const workersEmployed = await safeCount(supabase.from('talent_profiles').select('*', { count: 'exact', head: true }));
  const jobsCompleted = await safeCount(supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('status', 'completed'));
  const firstTime = await safeCount(supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_first_time_worker', true));
  const communities = await safeCount(supabase.from('talent_profiles').select('*', { count: 'exact', head: true }).not('service_radius_km', 'is', null));

  const { data: income } = await supabase.from('transactions').select('amount').eq('status', 'available');
  const incomeGenerated = income?.reduce((s: number, t: any) => s + Number(t.amount || 0), 0) || 0;

  const metrics = [
    { label: 'Workers Employed', value: workersEmployed || 0, hint: 'Skilled people onboarded' },
    { label: 'First-time Workers', value: firstTime || 0, hint: 'New to formal work' },
    { label: 'Jobs Completed', value: jobsCompleted || 0, hint: 'Across all categories' },
    { label: 'Youth (18–30)', value: '—', hint: 'Add age field to track' },
    { label: 'Female Workforce', value: '—', hint: 'Add gender field to track' },
    { label: 'Income Generated', value: '৳' + incomeGenerated.toLocaleString(), hint: 'Paid to workers' },
    { label: 'Communities Served', value: communities || 0, hint: 'Areas with active workers' },
  ];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warm-ink">Social Impact Dashboard</h1>
        <p className="text-warm-muted">Tracking Galaxy Workforce's mission: bring every skilled person online.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {metrics.map((m) => (
          <Card key={m.label} className="p-6">
            <p className="text-sm text-warm-muted">{m.label}</p>
            <p className="text-3xl font-bold text-warm-ink mt-1">{m.value}</p>
            <p className="text-xs text-warm-muted mt-1">{m.hint}</p>
          </Card>
        ))}
      </div>
      <Card className="p-6 bg-warm-beige">
        <h2 className="font-semibold text-warm-ink mb-2">Mission Progress</h2>
        <p className="text-sm text-warm-muted leading-relaxed">
          Galaxy Workforce is digitizing the informal workforce of Bangladesh. These metrics are useful for grants, NGOs,
          and government employment partnerships. Continue onboarding unemployed, informal, and skilled workers to grow impact.
        </p>
      </Card>
    </div>
  );
}
