import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function TalentGrowthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile || profile.role !== 'talent') return redirect('/login');
  const { data: tp } = await supabase.from('talent_profiles').select('*').eq('id', user.id).single();

  const wm = (tp as any)?.worker_meta || {};
  // Profile strength (§16)
  const checks = [
    { label: 'Primary occupation set', done: !!wm.primaryOccupation },
    { label: 'Trade / skill listed', done: (wm.trade || (tp as any)?.skills?.length > 0) },
    { label: 'Experience added', done: (wm.experienceYears ?? 0) > 0 },
    { label: 'Service radius set', done: (wm.serviceRadiusKm ?? 0) > 0 },
    { label: 'Languages added', done: (wm.languages?.length || 0) > 0 },
    { label: 'Certifications added', done: (wm.certifications?.length || 0) > 0 },
    { label: 'Profile photo', done: !!profile.avatar_url },
    { label: 'Availability set', done: !!wm.workerStatus },
  ];
  const strength = Math.round((checks.filter((c) => c.done).length / checks.length) * 100);

  const { count: jobsOpen } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'open');

  const marketDemand = [
    { skill: 'Electrical repair', demand: 92, rate: '৳600–1200/hr' },
    { skill: 'AC installation', demand: 88, rate: '৳500–1000/hr' },
    { skill: 'Home cleaning', demand: 81, rate: '৳300–700/hr' },
    { skill: 'Plumbing', demand: 85, rate: '৳500–900/hr' },
    { skill: 'Tutoring', demand: 74, rate: '৳400–800/hr' },
  ];

  const certs = ['NSDC Skill Certificate', 'Trade License', 'Electrical Safety Training', 'First Aid Certification'];
  const training = ['Customer communication', 'Pricing your services', 'Using the AI Workforce Assistant', 'Safety on the job'];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-warm-ink">Worker Growth Dashboard</h1>
        <p className="text-warm-muted">Grow your skills, demand, and income with AI suggestions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="p-6 lg:col-span-1">
          <h2 className="font-semibold text-warm-ink mb-2">Profile Strength</h2>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-warm-red">{strength}</span>
            <span className="text-warm-muted mb-1">/100</span>
          </div>
          <div className="w-full h-3 rounded-full bg-warm-beige mt-3 overflow-hidden">
            <div className="h-full bg-warm-red" style={{ width: `${strength}%` }} />
          </div>
          <ul className="mt-4 space-y-1.5 text-sm">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <span className={c.done ? 'text-warm-green' : 'text-warm-muted'}>{c.done ? '✓' : '○'}</span>
                <span className={c.done ? 'text-warm-ink' : 'text-warm-muted'}>{c.label}</span>
              </li>
            ))}
          </ul>
          <Link href="/talent-dashboard/profile" className="inline-block mt-4"><Badge className="bg-warm-red text-white">Improve profile</Badge></Link>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="font-semibold text-warm-ink mb-4">Market Demand & Suggested Rates</h2>
          <div className="space-y-3">
            {marketDemand.map((m) => (
              <div key={m.skill}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-warm-ink font-medium">{m.skill}</span>
                  <span className="text-warm-muted">{m.rate}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-warm-beige overflow-hidden">
                  <div className="h-full bg-warm-gold" style={{ width: `${m.demand}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-warm-muted mt-4">{jobsOpen || 0} jobs currently open on the marketplace.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold text-warm-ink mb-3">Suggested Certifications</h2>
          <ul className="space-y-2 text-sm text-warm-muted">
            {certs.map((c) => <li key={c} className="flex items-center gap-2"><span className="text-warm-green">◆</span>{c}</li>)}
          </ul>
        </Card>
        <Card className="p-6">
          <h2 className="font-semibold text-warm-ink mb-3">Recommended Training</h2>
          <ul className="space-y-2 text-sm text-warm-muted">
            {training.map((c) => <li key={c} className="flex items-center gap-2"><span className="text-warm-red">▶</span>{c}</li>)}
          </ul>
        </Card>
        <Card className="p-6 bg-warm-ink text-white">
          <h2 className="font-semibold mb-3">AI Career Suggestion</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Based on your profile, you are well positioned for <span className="text-warm-gold font-medium">emergency and home-service jobs</span>.
            Adding a trade license and an Electrical Safety certificate could lift your visibility by up to 40% in your area.
          </p>
        </Card>
      </div>
    </div>
  );
}
