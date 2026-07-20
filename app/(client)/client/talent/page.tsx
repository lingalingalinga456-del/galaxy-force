import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SearchWithSuggestions } from '@/components/search/SearchWithSuggestions';

export const dynamic = 'force-dynamic';

export default async function ClientTalentPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const supabase = await createClient();
  const { search } = await searchParams;

  let q = supabase
    .from('talent_profiles')
    .select('id, headline, skills, hourly_rate, availability, profiles!inner(id, full_name, username, avatar_url, is_verified)')
    .eq('profiles.status', 'active');
  if (search) q = q.ilike('profiles.full_name', `%${search}%`);

  const { data: talent } = await q.limit(30);

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-warm-ink mb-2">Discover Talent</h1>
      <div className="max-w-xl mb-6">
        <SearchWithSuggestions scope="talent" defaultValue={search || ''} placeholder="Search by name or skill…" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {talent?.map((t: any) => (
          <Link key={t.id} href={`/talent/${t.profiles?.username}`}>
            <Card className="p-5 hover:shadow-card-hover transition-all h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-warm-beige flex items-center justify-center font-bold text-warm-ink">
                  {t.profiles?.full_name?.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-warm-ink">{t.profiles?.full_name}</div>
                  {t.profiles?.is_verified && <span className="text-xs text-warm-green">Verified</span>}
                </div>
              </div>
              <p className="text-sm text-warm-muted line-clamp-2">{t.headline}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {(t.skills || []).slice(0, 3).map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)}
              </div>
              <div className="mt-3 text-sm font-medium text-warm-green">৳{Number(t.hourly_rate || 0).toLocaleString()}/hr</div>
            </Card>
          </Link>
        ))}
        {!talent?.length && <p className="text-warm-muted">No talent found.</p>}
      </div>
    </div>
  );
}
