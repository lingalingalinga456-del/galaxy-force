import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

function BarChartSimple({ data }: { data: { name: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-3">
      {data.map((d) => (
        <div key={d.name}>
          <div className="flex justify-between text-xs text-warm-muted mb-1">
            <span>{d.name}</span>
            <span>{d.value}</span>
          </div>
          <div className="h-3 rounded-full bg-warm-beige overflow-hidden">
            <div className="h-full bg-warm-red" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutSimple({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;
  const radius = 60;
  const circ = 2 * Math.PI * radius;
  return (
    <svg viewBox="0 0 160 160" className="w-48 h-48 mx-auto">
      <circle cx="80" cy="80" r={radius} fill="none" stroke="#eee" strokeWidth="20" />
      {data.map((d) => {
        const len = (d.value / total) * circ;
        const seg = (
          <circle
            key={d.name}
            cx="80" cy="80" r={radius}
            fill="none" stroke={d.color} strokeWidth="20"
            strokeDasharray={`${len} ${circ - len}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 80 80)"
          />
        );
        offset += len;
        return seg;
      })}
    </svg>
  );
}

export default async function ClientAnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: jobs } = await supabase.from('jobs').select('status, created_at').eq('owner_id', user.id);
  const { data: contracts } = await supabase.from('contracts').select('status, agreed_amount').eq('client_id', user.id);

  const open = jobs?.filter((j: any) => j.status === 'open').length || 0;
  const closed = jobs?.filter((j: any) => j.status === 'closed').length || 0;
  const active = contracts?.filter((c: any) => c.status === 'active').length || 0;
  const completed = contracts?.filter((c: any) => c.status === 'completed').length || 0;

  const barData = [
    { name: 'Open Jobs', value: open },
    { name: 'Closed Jobs', value: closed },
    { name: 'Active', value: active },
    { name: 'Completed', value: completed },
  ];
  const pieData = [
    { name: 'Active', value: active, color: '#5FA777' },
    { name: 'Completed', value: completed, color: '#D94F4F' },
  ];
  const totalSpend = contracts?.reduce((s: number, c: any) => s + Number(c.agreed_amount || 0), 0) || 0;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Analytics</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-5"><p className="text-sm text-warm-muted">Total Spend</p><p className="text-2xl font-bold">৳{totalSpend.toLocaleString()}</p></Card>
        <Card className="p-5"><p className="text-sm text-warm-muted">Open Jobs</p><p className="text-2xl font-bold">{open}</p></Card>
        <Card className="p-5"><p className="text-sm text-warm-muted">Active Contracts</p><p className="text-2xl font-bold">{active}</p></Card>
        <Card className="p-5"><p className="text-sm text-warm-muted">Completed</p><p className="text-2xl font-bold">{completed}</p></Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Activity</h3>
          <BarChartSimple data={barData} />
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Contract Mix</h3>
          <DonutSimple data={pieData} />
          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="text-warm-green">● Active: {active}</span>
            <span className="text-warm-red">● Completed: {completed}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
