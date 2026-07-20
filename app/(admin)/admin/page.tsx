import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Users, Briefcase, FileText, Handshake, Receipt, Activity, Sparkles, HeartHandshake } from 'lucide-react';
import { SectionTitle } from '@/components/design-system/SectionTitle';

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
    { label: 'Total Users', value: users || 0, icon: <Users className="w-5 h-5" />, accent: 'red' as const },
    { label: 'Talents', value: talent || 0, icon: <Briefcase className="w-5 h-5" />, accent: 'gold' as const },
    { label: 'Jobs', value: jobs || 0, icon: <FileText className="w-5 h-5" />, accent: 'green' as const },
    { label: 'Contracts', value: contracts || 0, icon: <Handshake className="w-5 h-5" />, accent: 'red' as const },
    { label: 'Transactions', value: transactions || 0, icon: <Receipt className="w-5 h-5" />, accent: 'gold' as const },
  ];

  const pulse = [
    { text: 'New talent registered in Dhaka', time: '2m ago' },
    { text: 'Contract completed — Electrical repair', time: '14m ago' },
    { text: 'Shop verified: Green Garden Care', time: '1h ago' },
    { text: 'Job posted: Office deep cleaning', time: '2h ago' },
    { text: 'Payment released to worker', time: '3h ago' },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-heading text-2xl font-bold text-warm-ink">Admin Overview</h1>
        <p className="text-warm-muted">Marketplace health and operations at a glance.</p>
      </div>

      {/* Gradient metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[24px] bg-gradient-to-br from-warm-cream to-warm-beige border border-warm-border shadow-card p-6">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-warm-red mb-3">{s.icon}</div>
            <p className="text-sm text-warm-muted">{s.label}</p>
            <p className="text-3xl font-bold text-warm-ink tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Marketplace health + platform pulse */}
      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <Card className="p-6 bg-gradient-to-br from-warm-red/5 to-warm-gold/5">
          <SectionTitle>Marketplace Health</SectionTitle>
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28">
              <div className="absolute inset-0 rounded-full bg-warm-beige" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-warm-red to-warm-gold flex items-center justify-center text-white text-2xl font-bold">92</div>
            </div>
            <div className="text-sm text-warm-muted space-y-1">
              <p>• Verification coverage: 78%</p>
              <p>• Dispute rate: 1.2%</p>
              <p>• Avg. match score: 88%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 text-warm-ink mb-4">
            <Activity className="w-5 h-5 text-warm-red" />
            <h3 className="font-semibold">Platform Pulse</h3>
          </div>
          <div className="space-y-3">
            {pulse.map((p, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-warm-gold" />
                <div className="flex-1">
                  <p className="text-sm text-warm-ink">{p.text}</p>
                  <p className="text-xs text-warm-muted">{p.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* AI usage summary */}
      <div>
        <SectionTitle>AI Usage Summary</SectionTitle>
        <div className="grid sm:grid-cols-3 gap-4">
          <Card className="p-6 border-l-4 border-l-warm-gold bg-warm-gold/5">
            <div className="flex items-center gap-2 text-warm-ink"><Sparkles className="w-5 h-5 text-warm-gold" /><h4 className="font-semibold">Matches Today</h4></div>
            <p className="text-3xl font-bold text-warm-ink mt-2">1,284</p>
            <p className="text-xs text-warm-muted">across all categories</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-warm-red bg-warm-red/5">
            <div className="flex items-center gap-2 text-warm-ink"><Sparkles className="w-5 h-5 text-warm-red" /><h4 className="font-semibold">Assistant Chats</h4></div>
            <p className="text-3xl font-bold text-warm-ink mt-2">412</p>
            <p className="text-xs text-warm-muted">client + worker sessions</p>
          </Card>
          <Card className="p-6 border-l-4 border-l-warm-green bg-warm-green/5">
            <div className="flex items-center gap-2 text-warm-ink"><HeartHandshake className="w-5 h-5 text-warm-green" /><h4 className="font-semibold">Cost Estimations</h4></div>
            <p className="text-3xl font-bold text-warm-ink mt-2">967</p>
            <p className="text-xs text-warm-muted">shown before booking</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
