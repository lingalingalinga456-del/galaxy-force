import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, username, role, status, is_verified, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Users</h1>
      <div className="grid gap-3">
        {profiles?.map((p: any) => (
          <Card key={p.id} className="p-5 flex items-center justify-between">
            <div>
              <Link href={`/admin/users/${p.id}`} className="font-medium text-warm-ink hover:underline">{p.full_name}</Link>
              <div className="text-xs text-warm-muted">@{p.username} · {new Date(p.created_at).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="capitalize">{p.role}</Badge>
              <Badge variant={p.status === 'active' ? 'success' : 'danger'} className="capitalize">{p.status}</Badge>
              {p.is_verified && <Badge variant="gold">Verified</Badge>}
            </div>
          </Card>
        ))}
        {!profiles?.length && <p className="text-warm-muted">No users found.</p>}
      </div>
    </div>
  );
}
