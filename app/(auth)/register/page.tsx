'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation, useLocale } from '@/lib/i18n/client';
import { createClient } from '@/lib/supabase/client';

function RegisterInner() {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole: 'client' | 'talent' | 'shop_owner' =
    (searchParams.get('role') as 'client' | 'talent' | 'shop_owner') || 'client';
  const [role, setRole] = useState<'client' | 'talent' | 'shop_owner'>(initialRole);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    const payload: Record<string, any> = {
      role,
      email: fd.get('email'),
      password: fd.get('password'),
      fullName: fd.get('fullName'),
      username: fd.get('username'),
      language: fd.get('language') || locale,
      country: fd.get('country') || 'Bangladesh',
    };
    if (role === 'client') {
      payload.organizationName = fd.get('organizationName');
      payload.businessType = fd.get('businessType');
    } else {
      payload.headline = fd.get('headline');
      payload.skills = fd.get('skills');
      payload.hourlyRate = fd.get('hourlyRate');
      payload.availability = fd.get('availability') || 'available';
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        setSubmitting(false);
        return;
      }
      // Sign in the new user
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (signInError) {
        router.push('/login');
        return;
      }
      router.push(
        role === 'talent'
          ? '/onboarding?role=talent'
          : role === 'shop_owner'
          ? '/onboarding?role=shop_owner'
          : '/client'
      );
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream py-12 px-4">
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
          <h2 className="mt-6 text-3xl font-bold text-warm-ink">{t('signUp', { en: 'Create your account', bn: 'আপনার অ্যাকাউন্ট তৈরি করুন' })}</h2>
          <p className="mt-2 text-sm text-warm-muted">{t('signUpDescription', { en: 'Join the future of work with AI-powered talent matching', bn: 'AI চালিত ট্যালেন্ট মেলকরে কাজের ভবিষ্যেতে যুক্ত হন' })}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-warm-ink">{t('whoAreYou', { en: 'Who are you?', bn: 'আপনি কে?' })}</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { value: 'client', title: t('hire', { en: 'I want to hire talent', bn: 'আমি ট্যালেন্ট নিয়োগ করতে চাই' }), desc: t('hireDesc', { en: 'Post jobs, hire freelancers', bn: 'জব দিন, ফ্রিল্যান্সার নিয়োগ করুন' }) },
                { value: 'talent', title: t('findWork', { en: 'I want to find work', bn: 'আমি কাজ খুঁজি চাই' }), desc: t('findWorkDesc', { en: 'Offer your skills & services', bn: 'আপনার দক্ষতা ও সেবা দিন' }) },
                { value: 'shop_owner', title: t('sellProducts', { en: 'I want to sell products', bn: 'আমি পণ্য বিক্রি করতে চাই' }), desc: t('sellProductsDesc', { en: 'Run your shop on Galaxy', bn: 'গ্যালাক্সিতে আপনার দোকান চালান' }) },
              ] as const).map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setRole(opt.value)}
                  className={`rounded-2xl border p-4 text-left transition-all ${role === opt.value ? 'border-warm-red bg-warm-red/5 ring-1 ring-warm-red' : 'border-warm-border bg-white hover:border-warm-red/40'}`}
                >
                  <span className="block text-sm font-semibold text-warm-ink">{opt.title}</span>
                  <span className="mt-1 block text-xs text-warm-muted">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium">{t('fullName', { en: 'Full name', bn: 'পূর্ণ নাম' })}</Label>
              <Input id="fullName" name="fullName" required className="mt-1" placeholder={t('fullName', { en: 'Full name', bn: 'পূর্ণ নাম' })} />
            </div>
            <div>
              <Label htmlFor="username" className="text-sm font-medium">{t('username', { en: 'Username', bn: 'ব্যবহারকারীর নাম' })}</Label>
              <Input id="username" name="username" required pattern="[a-z0-9_]+" title="Lowercase letters, numbers, and underscores only" className="mt-1" placeholder="yourusername" />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium">{t('email', { en: 'Email address', bn: 'ইমেইল ঠিকানা' })}</Label>
              <Input id="email" name="email" type="email" required className="mt-1" placeholder="you@example.com" />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">{t('password', { en: 'Password', bn: 'পাসওয়ার্ড' })}</Label>
              <Input id="password" name="password" type="password" required minLength={8} className="mt-1" placeholder="••••••••" />
            </div>
            <div>
              <Label htmlFor="language" className="text-sm font-medium">{t('language', { en: 'Language', bn: 'ভাষা' })}</Label>
              <select id="language" name="language" defaultValue={locale} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
                <option value="en">English</option>
                <option value="bn">বাংলা</option>
              </select>
            </div>
          </div>

          {role === 'client' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="organizationName" className="text-sm font-medium">{t('organization', { en: 'Organization name', bn: 'সংগঠন নাম' })}</Label>
                <Input id="organizationName" name="organizationName" required className="mt-1" placeholder="Your company name" />
              </div>
              <div>
                <Label htmlFor="businessType" className="text-sm font-medium">{t('businessType', { en: 'Business type', bn: 'ব্যবসার প্রকার' })}</Label>
                <Input id="businessType" name="businessType" className="mt-1" placeholder="e.g., Restaurant, Retail, Agency" />
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium">{t('country', { en: 'Country', bn: 'দেশ' })}</Label>
                <Input id="country" name="country" className="mt-1" placeholder="Bangladesh" />
              </div>
            </div>
          )}

          {role === 'talent' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="headline" className="text-sm font-medium">{t('headline', { en: 'Professional headline', bn: 'পেশাগত হেডলাইন' })}</Label>
                <Input id="headline" name="headline" required className="mt-1" placeholder="Web Developer | Designer | Writer" />
              </div>
              <div>
                <Label htmlFor="skills" className="text-sm font-medium">{t('skills', { en: 'Skills (comma separated)', bn: 'দক্ষতা (কমা বিচ্ছিন্ন)' })}</Label>
                <Input id="skills" name="skills" className="mt-1" placeholder="JavaScript, React, Node.js, UI/UX" />
              </div>
              <div>
                <Label htmlFor="hourlyRate" className="text-sm font-medium">{t('hourlyRate', { en: 'Hourly rate (BDT)', bn: 'ঘন্টায় হার (BDT)' })}</Label>
                <Input id="hourlyRate" name="hourlyRate" type="number" min={0} step={1} className="mt-1" placeholder="500" />
              </div>
              <div>
                <Label htmlFor="availability" className="text-sm font-medium">{t('availability', { en: 'Availability', bn: 'উপলব্ধতা' })}</Label>
                <select id="availability" name="availability" defaultValue="available" className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
                  <option value="available">{t('available', { en: 'Available', bn: 'উপলব্ধ' })}</option>
                  <option value="busy">{t('busy', { en: 'Busy', bn: 'ব্যস্ত' })}</option>
                  <option value="unavailable">{t('unavailable', { en: 'Unavailable', bn: 'অনুপলব্ধ' })}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="country" className="text-sm font-medium">{t('country', { en: 'Country', bn: 'দেশ' })}</Label>
                <Input id="country" name="country" className="mt-1" placeholder="Bangladesh" />
              </div>
            </div>
          )}

          <div className="flex items-start space-x-3">
            <Checkbox id="terms" name="terms" required />
            <div className="text-sm leading-none">
              <span className="text-warm-muted">{t('agreeTerms', { en: 'I agree to the', bn: 'আমি সম্মতি করি' })}{' '}
                <Link href="/legal/terms" className="text-warm-red hover:underline">{t('termsOfService', { en: 'Terms of Service', bn: 'সেবার শর্তাবলী' })}</Link>{' '}
                {t('and', { en: 'and', bn: 'এবং' })}{' '}
                <Link href="/legal/privacy" className="text-warm-red hover:underline">{t('privacyPolicy', { en: 'Privacy Policy', bn: 'গোপনীয়তা নীতি' })}</Link>
              </span>
            </div>
          </div>

          {error && <p className="text-sm text-warm-red">{error}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting
              ? t('common.loading', { en: 'Loading...', bn: 'লোড হচ্ছে...' })
              : role === 'shop_owner'
              ? t('createShopOwner', { en: 'Create Shop Owner Account', bn: 'শপ ওনার অ্যাকাউন্ট তৈরি করুন' })
              : t('createAccount', { en: 'Create Account', bn: 'অ্যাকাউন্ট তৈরি করুন' })}
          </Button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-warm-muted">
            {t('alreadyHave', { en: 'Already have an account?', bn: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?' })}{' '}
            <Link href="/login" className="font-medium text-warm-red hover:text-warm-red-hover">{t('signIn', { en: 'Sign in', bn: 'সাইন ইন' })}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterInner />
    </Suspense>
  );
}
