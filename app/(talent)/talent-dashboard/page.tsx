import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Sparkles, TrendingUp, Wallet, Send, CircleUser } from 'lucide-react';
import { SectionTitle } from '@/components/design-system/SectionTitle';
import { MetricCard } from '@/components/design-system/MetricCard';
import { TrustScoreRing } from '@/components/design-system/TrustScoreRing';
import { AvailabilityToggle } from '@/components/design-system/AvailabilityToggle';
import { ReviewCard } from '@/components/design-system/ReviewCard';
import { JobCard } from '@/components/design-system/JobCard';

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
  const { data: jobs } = await supabase.from('jobs').select('id, title, budget_type, budget_max, description, created_at').eq('status', 'open').order('created_at', { ascending: false }).limit(4);

  const totalEarned = earnings?.reduce((s: number, t: any) => s + Number(t.amount || 0), 0) || 0;
  const completion = Number(tp?.completion_score || 0);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Hero greeting + profile completion */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <Card className="p-6 bg-gradient-to-br from-warm-cream to-warm-beige">
          <h1 className="text-heading text-2xl font-bold text-warm-ink">Welcome back, {profile.full_name?.split(' ')[0]}</h1>
          <p className="text-warm-muted mt-1">{tp?.headline || 'Complete your profile to attract clients'}</p>
          <div className="mt-5">
            <p className="text-sm text-warm-muted mb-2">Availability</p>
            <AvailabilityToggle value={tp?.worker_status || 'available'} />
          </div>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center">
          <TrustScoreRing score={completion} />
          <p className="mt-2 text-sm text-warm-muted">Profile Completion</p>
          <p className="text-2xl font-bold text-warm-ink">{completion}%</p>
          <Link href="/talent-dashboard/profile" className="mt-3 text-sm text-warm-red hover:underline">Improve profile →</Link>
        </Card>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total Earned" value={`৳${totalEarned.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} accent="green" trend={{ value: '18%', positive: true }} />
        <MetricCard label="Active Contracts" value={activeContracts || 0} icon={<CircleUser className="w-5 h-5" />} accent="red" />
        <MetricCard label="Open Proposals" value={openProposals || 0} icon={<Send className="w-5 h-5" />} accent="gold" />
      </div>

      {/* Recommended jobs + AI career panel */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <SectionTitle action={<Link href="/jobs" className="text-sm text-warm-red hover:underline">View all</Link>}>Recommended Jobs</SectionTitle>
          <div className="space-y-4">
            {jobs?.map((job: any) => (
              <JobCard key={job.id} job={{ id: job.id, title: job.title, budgetType: job.budget_type, budget: Number(job.budget_max || 0), postedAt: new Date(job.created_at).toLocaleDateString() }} />
            ))}
            {!jobs?.length && <p className="text-sm text-warm-muted">No open jobs right now.</p>}
          </div>
        </div>

        <Card className="p-6 border-l-4 border-l-warm-gold bg-warm-gold/5 h-fit">
          <div className="flex items-center gap-2 text-warm-ink">
            <Sparkles className="w-5 h-5 text-warm-gold" />
            <h3 className="font-semibold">AI Career Assistant</h3>
          </div>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-warm-ink flex items-center gap-1"><TrendingUp className="w-4 h-4 text-warm-red" /> Skill Demand Trends</p>
              <ul className="mt-1 text-sm text-warm-muted space-y-1">
                <li>• Electrical repair — high demand</li>
                <li>• AC installation — rising</li>
                <li>• Home cleaning — steady</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-warm-ink">Suggested Rates</p>
              <p className="text-sm text-warm-muted mt-1">৳600–1200/hr for emergency electrical work in your area.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Trust breakdown + reviews */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <SectionTitle>Trust Score Breakdown</SectionTitle>
          <div className="space-y-3">
            {[
              { k: 'Identity & verification', v: completion },
              { k: 'Jobs completed', v: 78 },
              { k: 'Client ratings', v: 92 },
              { k: 'Response time', v: 85 },
            ].map((row) => (
              <div key={row.k}>
                <div className="flex justify-between text-sm mb-1"><span className="text-warm-muted">{row.k}</span><span className="font-medium text-warm-ink">{row.v}</span></div>
                <div className="h-2 rounded-full bg-warm-beige overflow-hidden">
                  <div className="h-full bg-warm-gold" style={{ width: `${row.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <div>
          <SectionTitle>Recent Reviews</SectionTitle>
          <div className="space-y-4">
            <ReviewCard review={{ author: 'Ayesha K.', role: 'client', rating: 5, comment: 'Arrived on time and fixed the wiring professionally. Highly recommended!', date: '2 days ago' }} />
            <ReviewCard review={{ author: 'Rahman M.', role: 'client', rating: 4, comment: 'Good work, clear communication throughout the job.', date: '1 week ago' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
