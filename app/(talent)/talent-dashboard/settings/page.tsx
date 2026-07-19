import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const dynamic = 'force-dynamic';

export default async function TalentSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: tp } = await supabase.from('talent_profiles').select('*').eq('id', user.id).single();

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Settings</h1>
      <Card className="p-6 space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input id="username" defaultValue={profile?.username || ''} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="availability">Availability</Label>
          <select id="availability" defaultValue={tp?.availability || 'available'} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input id="linkedin" defaultValue={tp?.linkedin_url || ''} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="github">GitHub URL</Label>
          <Input id="github" defaultValue={tp?.github_url || ''} className="mt-1" />
        </div>
        <Button>Save changes</Button>
      </Card>
    </div>
  );
}
