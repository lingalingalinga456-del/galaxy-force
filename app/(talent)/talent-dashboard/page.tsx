import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function TalentDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || profile.role !== 'talent') return redirect('/login');
  const { data: tp } = await supabase.from('talent_profiles').select('*').eq('id', user.id).single();

  const { count: activeContracts } = await supabase.from('contracts').select('*', { count: 'exact', head: true }).eq('talent_id', user.id).eq('status', 'active');
  const { count: openProposals } = await supabase.from('proposals').select('*', { count: 'exact', head: true }).eq('talent_id', user.id).eq('status', 'pending');
  const { data: earnings } = await supabase.from('transactions').select('amount').eq('user_id', user.id).eq('status', 'available');

  const totalEarned = earnings?.reduce((s: number, t: any) => s + Number(t.amount || 0), 0) || 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warm-ink">Welcome, {profile.full_name?.split(' ')[0]}</h1>
        <p className="text-warm-muted">{tp?.headline || 'Complete your profile to attract clients'}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="p-6"><p className="text-sm text-warm-muted">Total Earned</p><p className="text-3xl font-bold text-warm-ink">৳{totalEarned.toLocaleString()}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted">Active Contracts</p><p className="text-3xl font-bold text-warm-ink">{activeContracts || 0}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted">Open Proposals</p><p className="text-3xl font-bold text-warm-ink">{openProposals || 0}</p></Card>
      </div>
      <div className="grid gap-4">
        <Link href="/jobs"><Card className="p-6 hover:shadow-card-hover transition-all"><h3 className="font-semibold text-warm-ink">Browse jobs & send proposals</h3><p className="text-sm text-warm-muted mt-1">Find work that matches your skills.</p></Card></Link>
        <Link href="/talent-dashboard/profile"><Card className="p-6 hover:shadow-card-hover transition-all"><h3 className="font-semibold text-warm-ink">Improve your profile</h3><p className="text-sm text-warm-muted mt-1">Completion score: {tp?.completion_score || 0}%</p></Card></Link>
      </div>
    </div>
  );
}
