import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') return redirect('/');
}

export default async function AdminOverview() {
  await requireAdmin();
  const supabase = await createClient();

  const [{ count: users }, { count: talent }, { count: jobs }, { count: contracts }, { count: transactions }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('talent_profiles').select('*', { count: 'exact', head: true }),
    supabase.from('jobs').select('*', { count: 'exact', head: true }),
    supabase.from('contracts').select('*', { count: 'exact', head: true }),
    supabase.from('transactions').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: 'Total Users', value: users || 0 },
    { label: 'Talents', value: talent || 0 },
    { label: 'Jobs', value: jobs || 0 },
    { label: 'Contracts', value: contracts || 0 },
    { label: 'Transactions', value: transactions || 0 },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Admin Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-6">
            <p className="text-sm text-warm-muted">{s.label}</p>
            <p className="text-3xl font-bold text-warm-ink">{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
