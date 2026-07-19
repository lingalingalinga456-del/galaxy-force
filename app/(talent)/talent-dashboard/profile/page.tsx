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
          <div>
            <Label htmlFor="occupation">Primary Occupation</Label>
            <Input id="occupation" defaultValue={tp?.primary_occupation || ''} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="trade">Trade</Label>
            <Input id="trade" defaultValue={tp?.trade || ''} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="exp">Experience (years)</Label>
            <Input id="exp" type="number" defaultValue={tp?.experience_years || ''} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="radius">Service radius (km)</Label>
            <Input id="radius" type="number" defaultValue={tp?.service_radius_km || ''} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="warranty">Warranty offered</Label>
            <select id="warranty" defaultValue={tp?.warranty_offered || 'none'} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
              <option value="none">No warranty</option>
              <option value="7d">7 days</option>
              <option value="15d">15 days</option>
              <option value="30d">30 days</option>
            </select>
          </div>
          <div>
            <Label htmlFor="status">Availability status</Label>
            <select id="status" defaultValue={tp?.worker_status || 'available'} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="on_job">On Job</option>
              <option value="offline">Offline</option>
              <option value="vacation">Vacation</option>
              <option value="emergency_only">Emergency Only</option>
              <option value="appointment_only">Appointment Only</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="own_vehicle" defaultChecked={tp?.own_vehicle} /> Own vehicle</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="own_tools" defaultChecked={tp?.own_tools} /> Own tools</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="emergency_available" defaultChecked={tp?.emergency_available} /> Emergency available</label>
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
