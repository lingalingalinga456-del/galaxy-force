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

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, budget_type, budget_max, description, created_at')
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(5);

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

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-warm-ink">Recommended Jobs</h2>
          <Link href="/jobs" className="text-sm text-warm-red hover:underline">View all</Link>
        </div>
        <div className="grid gap-3">
          {jobs?.map((job: any) => (
            <Link key={job.id} href={`/jobs/${job.id}`}>
              <Card className="p-5 hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-warm-ink">{job.title}</h3>
                    <p className="text-sm text-warm-muted mt-1 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-semibold text-warm-green">৳{Number(job.budget_max || 0).toLocaleString()}</div>
                    <span className="text-xs text-warm-muted capitalize">{job.budget_type}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {!jobs?.length && (
            <p className="text-sm text-warm-muted">No open jobs right now. Check back soon!</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/jobs"><Card className="p-6 hover:shadow-card-hover transition-all"><h3 className="font-semibold text-warm-ink">Browse all jobs & send proposals</h3><p className="text-sm text-warm-muted mt-1">Find work that matches your skills.</p></Card></Link>
        <Link href="/talent-dashboard/profile"><Card className="p-6 hover:shadow-card-hover transition-all"><h3 className="font-semibold text-warm-ink">Improve your profile</h3><p className="text-sm text-warm-muted mt-1">Completion score: {tp?.completion_score || 0}%</p></Card></Link>
      </div>
    </div>
  );
}

