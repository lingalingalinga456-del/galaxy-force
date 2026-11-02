import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function ClientJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, status, created_at, budget_type, budget_max, description')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-warm-ink">My Jobs</h1>
          <p className="text-warm-muted">Manage postings and review proposals</p>
        </div>
        <Link href="/client/jobs/new"><Button>Post a Job</Button></Link>
      </div>

      <div className="grid gap-4">
        {jobs?.map((job: any) => (
          <Link key={job.id} href={`/client/jobs/${job.id}`}>
            <Card className="p-6 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-warm-ink">{job.title}</h3>
                  <p className="text-sm text-warm-muted mt-1 line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-warm-muted">
                    <Badge variant="outline" className="capitalize">{job.status.replace('_', ' ')}</Badge>
                    <span>৳{Number(job.budget_max || 0).toLocaleString()} · {job.budget_type}</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
        {!jobs?.length && (
          <Card className="p-12 text-center">
            <p className="text-warm-muted mb-4">You haven't posted any jobs yet.</p>
            <Link href="/client/jobs/new"><Button>Post your first job</Button></Link>
          </Card>
        )}
      </div>
    </div>
  );
}
