import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

function Img({ src, alt, className }: { src: string; alt: string; className?: string }) {
  if (!src) return <div className={`${className} flex items-center justify-center text-5xl font-bold text-warm-red/30 bg-warm-beige`}>{alt?.charAt(0)}</div>;
  return <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" loading="lazy" onError={(e) => { const el = e.currentTarget; if (el.dataset.fb) return; el.dataset.fb = '1'; el.src = `https://picsum.photos/seed/${encodeURIComponent((alt||'gw').slice(0,20))}/600/400`; }} />;
}

export default async function TalentProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  let profile: any = null;
  try {
    const { data } = await supabase
      .from('talent_profiles')
      .select('*, profiles!inner(id, full_name, avatar_url, username, is_verified, bio)')
      .eq('profiles.username', username)
      .maybeSingle();
    profile = data;
  } catch (e) { console.error(e); }

  const name = profile?.profiles?.full_name || username;
  const photo = profile?.profiles?.avatar_url || '';
  const role = profile?.primary_occupation || profile?.headline || 'Professional';
  const rate = Number(profile?.hourly_rate || 0);
  const score = Number(profile?.completion_score || 4.5).toFixed(1);
  const bio = profile?.profiles?.bio || 'Verified skilled professional on Galaxy Workforce ready to help with your task.';
  const skills = profile?.skills || [role, 'Reliable', 'Punctual'];

  return (
    <div className="min-h-screen bg-warm-cream">
      <header className="border-b border-warm-border bg-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-warm-red" /><span className="text-heading font-bold">Galaxy Workforce</span></Link>
          <Link href="/discover"><Button size="sm" variant="ghost">Discover</Button></Link>
        </div>
      </header>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <div className="rounded-[28px] bg-white border border-warm-border shadow-card p-8">
          <div className="flex items-center gap-5">
            <Img src={photo} alt={name} className="w-24 h-24 rounded-full object-cover" />
            <div>
              <h1 className="text-heading text-2xl font-bold text-warm-ink">{name}</h1>
              <p className="text-warm-muted">{role}</p>
              <div className="flex items-center gap-3 mt-1 text-sm">
                <span className="inline-flex items-center gap-1 text-warm-gold">{score} star</span>
                {profile?.profiles?.is_verified && <span className="text-warm-green text-xs">NID verified</span>}
                <span className="text-warm-red font-semibold">BDT {rate}/hr</span>
              </div>
            </div>
          </div>
          <p className="text-warm-muted mt-5">{bio}</p>
          <div className="flex flex-wrap gap-2 mt-4">{skills.map((s: string, i: number) => <span key={i} className="px-3 py-1 rounded-full bg-warm-beige text-sm text-warm-ink">{s}</span>)}</div>
          <div className="flex gap-3 mt-6">
            <Button className="flex-1">Hire {name.split(' ')[0]}</Button>
            <Link href="/discover" className="flex-1"><Button variant="secondary" className="w-full">Back to Discover</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
