import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ClientDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || profile.role !== 'client') return redirect('/login');

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, status, created_at, description')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: contracts } = await supabase
    .from('contracts')
    .select('id, agreed_amount, status, talent_id')
    .eq('client_id', user.id)
    .eq('status', 'active')
    .limit(5);

  const openJobs = jobs?.filter((j: any) => j.status === 'open')?.length || 0;
  const activeContracts = contracts?.length || 0;
  const totalSpend = contracts?.reduce((sum: number, c: any) => sum + Number(c.agreed_amount || 0), 0) || 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warm-ink">Good morning, {profile.full_name?.split(' ')[0]}</h1>
        <p className="text-warm-muted">Manage your jobs, contracts, and talent</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6"><p className="text-sm text-warm-muted">Total Spend</p><p className="text-3xl font-bold text-warm-ink">৳{totalSpend.toLocaleString()}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted">Active Contracts</p><p className="text-3xl font-bold text-warm-ink">{activeContracts}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted">Open Jobs</p><p className="text-3xl font-bold text-warm-ink">{openJobs}</p></Card>
        <Card className="p-6"><p className="text-sm text-warm-muted">New Proposals</p><p className="text-3xl font-bold text-warm-ink">0</p></Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Jobs</h2>
          <Link href="/client/jobs" className="text-sm text-warm-red hover:underline">View all</Link>
        </div>
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

      <Card className="p-6 bg-warm-gold/20 border-warm-gold/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-warm-gold flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-warm-ink" />
          </div>
          <div>
            <h3 className="font-semibold text-warm-ink">AI Project Starter</h3>
            <p className="text-sm text-warm-muted mt-1">Describe your project and let AI help create a detailed job posting.</p>
            <Link href="/client/jobs/new" className="inline-block mt-4">
              <Button variant="ghost" size="sm" className="bg-white">Create with AI</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
