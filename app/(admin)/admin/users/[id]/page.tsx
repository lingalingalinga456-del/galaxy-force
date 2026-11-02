import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const dynamic = 'force-dynamic';

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();

  if (!profile) return <div className="p-8 text-warm-muted">User not found.</div>;

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink">{profile.full_name}</h1>
      <div className="flex items-center gap-2 mt-2">
        <Badge className="capitalize">{profile.role}</Badge>
        <Badge variant={profile.status === 'active' ? 'success' : 'danger'} className="capitalize">{profile.status}</Badge>
      </div>
      <Card className="p-6 mt-6 space-y-2 text-sm">
        <div><span className="text-warm-muted">Username:</span> @{profile.username}</div>
        <div><span className="text-warm-muted">Email:</span> {profile.email || '—'}</div>
        <div><span className="text-warm-muted">Country:</span> {profile.country || '—'}</div>
        <div><span className="text-warm-muted">Language:</span> {profile.language}</div>
        <div><span className="text-warm-muted">Verified:</span> {profile.is_verified ? 'Yes' : 'No'}</div>
        <div><span className="text-warm-muted">Joined:</span> {new Date(profile.created_at).toLocaleString()}</div>
      </Card>
    </div>
  );
}
