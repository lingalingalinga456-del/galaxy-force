import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function TalentPortfolioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: items } = await supabase
    .from('portfolio_items')
    .select('id, title, description, image_url, project_url, created_at')
    .eq('talent_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Portfolio</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items?.map((it: any) => (
          <Card key={it.id} className="overflow-hidden">
            <div className="h-36 bg-warm-beige flex items-center justify-center text-warm-muted text-sm">
              {it.image_url ? '🖼 Image' : 'No preview'}
            </div>
            <div className="p-4">
              <div className="font-medium text-warm-ink">{it.title}</div>
              <p className="text-sm text-warm-muted mt-1 line-clamp-2">{it.description}</p>
              {it.project_url && <a href={it.project_url} className="text-sm text-warm-red hover:underline mt-2 inline-block">View project</a>}
            </div>
          </Card>
        ))}
        {!items?.length && <p className="text-warm-muted">No portfolio items yet. Add your best work to impress clients.</p>}
      </div>
    </div>
  );
}
