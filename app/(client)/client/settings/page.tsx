import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const dynamic = 'force-dynamic';

export default async function ClientSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: client } = await supabase.from('client_profiles').select('*').eq('id', user.id).single();

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Settings</h1>
      <Card className="p-6 space-y-4">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" defaultValue={profile?.full_name || ''} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue={profile?.username || ''} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="org">Organization</Label>
          <Input id="org" defaultValue={client?.organization_name || ''} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="bio">About</Label>
          <Textarea id="bio" defaultValue={client?.description || ''} rows={4} className="mt-1" />
        </div>
        <Button>Save changes</Button>
      </Card>
    </div>
  );
}
