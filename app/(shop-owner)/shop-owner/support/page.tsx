import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { LifeBuoy } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('id, subject, status, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Support</h1>
      {tickets && tickets.length > 0 ? (
        <div className="space-y-2">
          {tickets.map((t: any) => (
            <Card key={t.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-warm-ink">{t.subject}</p>
                <p className="text-sm text-warm-muted capitalize">{t.status}</p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center">
          <LifeBuoy className="w-10 h-10 text-warm-muted mx-auto mb-3" />
          <p className="text-warm-muted mb-4">No support tickets yet. Contact us at support@galaxyworkforce.app for help.</p>
          <a href="mailto:support@galaxyworkforce.app">
            <button className="rounded-md bg-warm-red px-4 py-2 text-white text-sm">Email Support</button>
          </a>
        </Card>
      )}
    </div>
  );
}
