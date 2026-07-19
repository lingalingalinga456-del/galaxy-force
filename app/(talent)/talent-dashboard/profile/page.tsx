import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const dynamic = 'force-dynamic';

export default async function TalentProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: tp } = await supabase.from('talent_profiles').select('*').eq('id', user.id).single();

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">My Profile</h1>
      <Card className="p-6 space-y-4">
        <div>
          <Label htmlFor="headline">Professional headline</Label>
          <Input id="headline" defaultValue={tp?.headline || ''} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input id="skills" defaultValue={(tp?.skills || []).join(', ')} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" defaultValue={tp?.bio || ''} rows={5} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="rate">Hourly rate (BDT)</Label>
            <Input id="rate" type="number" defaultValue={tp?.hourly_rate || ''} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" defaultValue={tp?.country || ''} className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" defaultValue={profile?.full_name || ''} className="mt-1" />
        </div>
        <Button>Save profile</Button>
      </Card>
    </div>
  );
}
