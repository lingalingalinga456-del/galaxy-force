import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createTranslator, getLocale } from '@/lib/i18n/server';

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ role?: 'client' | 'talent' }> }) {
  const supabase = await createServerClient();
  const locale = await getLocale();
  const t = createTranslator(locale);
  const { role: queryRole } = await searchParams;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, language')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return redirect('/login');
  }

  if (profile.role !== 'talent') {
    return redirect(getDashboardPath(profile.role));
  }

  const role = queryRole || profile.role;

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-warm-red flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-heading text-2xl font-bold">Galaxy Workforce</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-warm-ink">
            {t('completeProfile', { en: 'Complete your profile', bn: 'আপনার প্রোফাইল পূর্ণ করুন' })}
          </h2>
          <p className="mt-2 text-sm text-warm-muted">
            {t('onboardingDesc', { en: 'Let\'s set up your account to get started', bn: 'শুরু করার জন্য আপনার অ্যাকাউন্ট সেট আপ করুন' })}
          </p>
        </div>

        <div className="space-y-6">
          <form action="/api/actions/onboarding" method="POST" className="space-y-6">
            <input type="hidden" name="role" value={role} />
            
            <div>
              <Label htmlFor="headline" className="text-sm font-medium">
                {t('headline', { en: 'Professional headline', bn: 'পেশাগত হেডলাইন' })}
              </Label>
              <Input
                id="headline"
                name="headline"
                type="text"
                autoComplete="organization"
                required
                className="mt-1"
                placeholder="Web Developer | Designer | Writer"
                defaultValue={profile.full_name}
              />
            </div>

            <div>
              <Label htmlFor="skills" className="text-sm font-medium">
                {t('skills', { en: 'Skills (comma separated)', bn: 'দক্ষতা (কমা বিচ্ছিন্ন)' })}
              </Label>
              <Input
                id="skills"
                name="skills"
                type="text"
                autoComplete="organization"
                className="mt-1"
                placeholder="JavaScript, React, Node.js, UI/UX"
              />
            </div>

            <div>
              <Label htmlFor="hourlyRate" className="text-sm font-medium">
                {t('hourlyRate', { en: 'Hourly rate (BDT)', bn: 'ঘন্টায় হার (বিডি' })}
              </Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                autoComplete="tel"
                className="mt-1"
                placeholder="500"
                min="0"
                step="1"
              />
            </div>

            <div>
              <Label htmlFor="country" className="text-sm font-medium">
                {t('country', { en: 'Country', bn: 'দেশ' })}
              </Label>
              <Input
                id="country"
                name="country"
                type="text"
                autoComplete="country"
                className="mt-1"
                placeholder="Bangladesh"
              />
            </div>

            <div>
              <Label htmlFor="availability" className="text-sm font-medium">
                {t('availability', { en: 'Availability', bn: 'উপলব্ধতা' })}
              </Label>
              <select
                id="availability"
                name="availability"
                className="mt-1 block w-full rounded-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border focus:border-warm-red focus:ring-warm-red focus:ring-offset-0 disabled:opacity-50 disabled:pointer-events-none"
              >
                <option value="available">{t('available', { en: 'Available', bn: 'উপলব্ধ' })}</option>
                <option value="busy">{t('busy', { en: 'Busy', bn: 'ব্যস্ত' })}</option>
                <option value="unavailable">{t('unavailable', { en: 'Unavailable', bn: 'অনুপলব্ধ' })}</option>
              </select>
            </div>

            <Button type="submit" className="w-full" size="lg">
              {t('completeProfile', { en: 'Complete Profile', bn: 'প্রোফাইল পূর্ণ করুন' })}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function getDashboardPath(role?: string | null): string {
  switch (role) {
    case 'client': return '/client';
    case 'talent': return '/talent-dashboard';
    case 'admin': return '/admin';
    default: return '/';
  }
}

export const dynamic = 'force-dynamic';