import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';
import { createTranslator, getLocale } from '@/lib/i18n/server';

export const dynamic = 'force-dynamic';

export default async function TalentProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const supabase = await createClient();
  const { username } = await params;
  const locale = await getLocale();
  const t = createTranslator(locale);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, talent_profiles(*)')
    .eq('username', username)
    .eq('role', 'talent')
    .single();

  if (!profile) notFound();

  const tp = profile.talent_profiles;
  const completion = Number(tp?.completion_score || 0);
  const rating = Number(tp?.rating || 0);
  const trustScore = Math.min(
    100,
    Math.round(completion * 0.4 + (rating / 5) * 40 + (profile.is_verified ? 20 : 0))
  );

  return (
    <div className="min-h-screen bg-warm-cream">
      <MarketingHeader />
      <section className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="p-8 rounded-2xl bg-white border border-warm-border">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-warm-beige flex items-center justify-center text-3xl font-bold text-warm-ink">
              {profile.full_name?.charAt(0) || 'T'}
            </div>
            <div className="flex-1">
              <h1 className="text-heading text-3xl font-bold">{profile.full_name}</h1>
              <p className="text-warm-muted mt-1">{tp?.headline}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-warm-muted">
                {profile.is_verified && <span className="text-warm-green">✓ Verified</span>}
                <span className="capitalize">{tp?.availability}</span>
                <span className="text-warm-gold font-medium">· {t('trustScore', { en: 'Trust Score', bn: 'ট্রাস্ট স্কোর' })}: {trustScore}/100</span>
                {tp?.country && <span>· {tp.country}</span>}
              </div>
              {tp?.hourly_rate && (
                <div className="text-warm-ink font-semibold mt-2">৳{Number(tp.hourly_rate).toLocaleString()}/hr</div>
              )}
            </div>
            <Link href="/register?role=client">
              <Button>Invite to Job</Button>
            </Link>
          </div>

          {tp?.bio && <p className="mt-6 text-warm-ink leading-relaxed">{tp.bio}</p>}

          {tp?.skills?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {tp.skills.map((s: string) => <Badge key={s} variant="gold">{s}</Badge>)}
              </div>
            </div>
          )}

          {tp?.experience_level && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-warm-beige">
                <div className="text-warm-muted">Experience</div>
                <div className="font-medium capitalize">{tp.experience_level}</div>
              </div>
              <div className="p-4 rounded-lg bg-warm-beige">
                <div className="text-warm-muted">Completion</div>
                <div className="font-medium">{tp.completion_score || 0}%</div>
              </div>
              <div className="p-4 rounded-lg bg-warm-beige">
                <div className="text-warm-muted">Availability</div>
                <div className="font-medium capitalize">{tp.availability}</div>
              </div>
            </div>
          )}
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
