import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles, Wallet, ClipboardList, Briefcase, Plus, FileText, Star, ShieldCheck } from 'lucide-react';
import { SectionTitle } from '@/components/design-system/SectionTitle';
import { MetricCard } from '@/components/design-system/MetricCard';
import { WorkerCard } from '@/components/design-system/WorkerCard';
import { WarrantyBadge } from '@/components/design-system/WarrantyBadge';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export const dynamic = 'force-dynamic';

export default async function ClientDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || profile.role !== 'client') return redirect('/login');

  const { data: contracts } = await supabase.from('contracts').select('id, agreed_amount, status, talent_id').eq('client_id', user.id).eq('status', 'active').limit(5);
  const { data: jobs } = await supabase.from('jobs').select('id, title, status, created_at, description').eq('owner_id', user.id).order('created_at', { ascending: false }).limit(5);
  const { data: talent } = await supabase
    .from('talent_profiles')
    .select('id, headline, primary_occupation, hourly_rate, completion_score, profiles!inner(id, full_name, username, is_verified)')
    .eq('profiles.status', 'active')
    .limit(4);

  const openJobs = jobs?.filter((j: any) => j.status === 'open')?.length || 0;
  const activeContracts = contracts?.length || 0;
  const totalSpend = contracts?.reduce((sum: number, c: any) => sum + Number(c.agreed_amount || 0), 0) || 0;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Hero greeting */}
      <Card className="p-6 bg-gradient-to-br from-warm-cream to-warm-beige flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-heading text-2xl font-bold text-warm-ink">{greeting()}, {profile.full_name?.split(' ')[0]}</h1>
          <p className="text-warm-muted mt-1">Manage your jobs, contracts, and talent in one calm space.</p>
        </div>
        <Link href="/client/jobs/new"><Button className="gap-2"><Plus className="w-4 h-4" /> Post a Job</Button></Link>
      </Card>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Spend" value={`৳${totalSpend.toLocaleString()}`} icon={<Wallet className="w-5 h-5" />} accent="red" />
        <MetricCard label="Active Contracts" value={activeContracts} icon={<ClipboardList className="w-5 h-5" />} accent="gold" />
        <MetricCard label="Open Jobs" value={openJobs} icon={<Briefcase className="w-5 h-5" />} accent="green" />
        <MetricCard label="New Proposals" value={0} icon={<FileText className="w-5 h-5" />} accent="red" />
      </div>

      {/* AI recommended + suggested talent */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <SectionTitle>AI Recommended for You</SectionTitle>
          <div className="flex flex-wrap gap-6">
{talent?.map((t: any) => (
               <WorkerCard
                 key={t.id}
                 id={t.id}
                 name={t.profiles?.full_name || 'Worker'}
                 role={t.primary_occupation || t.headline}
                 location="Bangladesh"
                 distance="5km"
                 hourlyRate={Number(t.hourly_rate || 0)}
                 trustScore={Number(t.completion_score || 0) >= 5 ? (Number(t.completion_score || 0) / 20) : 4.8}
                 completedJobs={Math.round(Number(t.completion_score || 0) * 10)}
                 availability={t.profiles?.status === 'online' ? 'available' : 'busy'}
                 avatar={t.profiles?.avatar_url || '/placeholder-avatar.png'}
               />
             ))}
            {!talent?.length && <p className="text-sm text-warm-muted">No recommendations yet.</p>}
          </div>
        </div>

        <Card className="p-6 border-l-4 border-l-warm-gold bg-warm-gold/5 h-fit">
          <div className="flex items-center gap-2 text-warm-ink">
            <Sparkles className="w-5 h-5 text-warm-gold" />
            <h3 className="font-semibold">Smart Suggestions</h3>
          </div>
          <div className="mt-4 space-y-3">
            {(talent || []).slice(0, 3).map((t: any) => (
              <Link key={t.id} href={`/talent/${t.profiles?.username || t.id}`} className="flex items-center gap-3 p-2 rounded-card-sm hover:bg-white transition-all">
                <div className="w-9 h-9 rounded-full bg-warm-beige flex items-center justify-center font-semibold text-warm-ink">{t.profiles?.full_name?.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-warm-ink truncate">{t.profiles?.full_name}</p>
                  <p className="text-xs text-warm-muted truncate">{t.primary_occupation || t.headline}</p>
                </div>
                <Star className="w-4 h-4 text-warm-gold fill-warm-gold" />
              </Link>
            ))}
            {!talent?.length && <p className="text-sm text-warm-muted">Add a job to get suggestions.</p>}
          </div>
        </Card>
      </div>

      {/* Active projects */}
      {contracts && contracts.length > 0 && (
        <div>
          <SectionTitle>Active Projects</SectionTitle>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {contracts.map((c: any) => (
              <Card key={c.id} className="p-5 min-w-[260px] shrink-0">
                <p className="font-medium text-warm-ink">Contract #{c.id.slice(0, 8)}</p>
                <div className="mt-3 h-1.5 rounded-full bg-warm-beige overflow-hidden">
                  <div className="h-full bg-warm-red" style={{ width: '60%' }} />
                </div>
                <p className="text-xs text-warm-muted mt-2">Next milestone: Inspection</p>
                <WarrantyBadge days={15} />
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent jobs */}
      <div>
        <SectionTitle action={<Link href="/client/jobs" className="text-sm text-warm-red hover:underline">View all</Link>}>Recent Jobs</SectionTitle>
        <div className="grid gap-4">
          {jobs?.map((job: any) => (
            <Link key={job.id} href={`/client/jobs/${job.id}`}>
              <Card className="p-6 hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-warm-ink">{job.title}</h3>
                    <p className="text-sm text-warm-muted mt-1 line-clamp-2">{job.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 rounded-full bg-warm-beige text-xs capitalize">{job.status.replace('_', ' ')}</span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-warm-green" />
                </div>
              </Card>
            </Link>
          ))}
          {!jobs?.length && (
            <Card className="p-12 text-center">
              <p className="text-warm-muted mb-4">No jobs yet. Post your first job to get started.</p>
              <Link href="/client/jobs/new"><Button>Post a Job</Button></Link>
            </Card>
          )}
        </div>
      </div>

      {/* Quick actions floating bar */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-warm-ink/95 backdrop-blur px-4 py-2 shadow-card-lift md:hidden">
        <Link href="/client/jobs/new" className="text-white text-sm px-3 py-1.5 rounded-full bg-warm-red">Post Job</Link>
        <Link href="/discover" className="text-white/80 text-sm px-3 py-1.5">Discover</Link>
        <Link href="/client/contracts" className="text-white/80 text-sm px-3 py-1.5">Contracts</Link>
      </div>
    </div>
  );
}
