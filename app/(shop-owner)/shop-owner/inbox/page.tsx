import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShopInboxPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'shop_owner') return redirect('/login');

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Inbox</h1>
      <Card className="p-10 text-center">
        <MessageSquare className="w-10 h-10 text-warm-muted mx-auto mb-3" />
        <p className="text-warm-muted">Your messages with customers will appear here once an order is placed.</p>
      </Card>
    </div>
  );
}
