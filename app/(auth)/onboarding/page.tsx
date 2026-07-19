'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation, useLocale } from '@/lib/i18n/client';

const BUSINESS_TYPES = ['Automotive Parts', 'Hardware', 'Electronics', 'General Store', 'Other'];
const PRODUCT_CATEGORIES = ['Automotive', 'Tools', 'Electronics', 'General', 'Hardware', 'Spare Parts', 'Accessories'];

const shopSchema = z.object({
  shop_name: z.string().min(2, 'Shop name is required'),
  business_type: z.string().min(1, 'Select a business type'),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  years_in_operation: z.coerce.number().int().min(0).max(200).optional(),
  categories: z.array(z.string()).optional(),
  delivery_radius_km: z.coerce.number().int().min(1).max(500).default(10),
  min_order_amount: z.coerce.number().min(0).default(0),
  language: z.enum(['en', 'bn']).default('en'),
});

type ShopForm = z.infer<typeof shopSchema>;

function OnboardingInner() {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = (searchParams.get('role') as 'talent' | 'shop_owner') || 'talent';
  const [step, setStep] = useState(role === 'shop_owner' ? 1 : 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ShopForm>({
    resolver: zodResolver(shopSchema),
    defaultValues: { language: locale, delivery_radius_km: 10, min_order_amount: 0, categories: [] },
  });

  const selectedCategories = watch('categories') || [];

  function toggleCategory(cat: string) {
    const current = selectedCategories;
    const next = current.includes(cat) ? current.filter((c) => c !== cat) : [...current, cat];
    setValue('categories', next, { shouldValidate: true });
  }

  async function submitShop(data: ShopForm) {
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/actions/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'shop_owner', ...data }),
    });
    const out = await res.json();
    if (!res.ok) {
      setError(out.error || 'Onboarding failed');
      setSubmitting(false);
      return;
    }
    router.push(out.redirect || '/shop-owner');
    router.refresh();
  }

  // Talent flow (simple)
  if (role === 'talent') {
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
            <h2 className="mt-6 text-3xl font-bold text-warm-ink">{t('completeProfile', { en: 'Complete your profile', bn: 'আপনার প্রোফাইল পূর্ণ করুন' })}</h2>
          </div>
          <form action="/api/actions/onboarding" method="POST" className="space-y-6">
            <input type="hidden" name="role" value="talent" />
            <div>
              <Label htmlFor="headline">{t('headline', { en: 'Professional headline', bn: 'পেশাগত হেডলাইন' })}</Label>
              <Input id="headline" name="headline" required className="mt-1" placeholder="Electrician | Plumber | Cleaner" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="primary_occupation">{t('occupation', { en: 'Primary Occupation', bn: 'প্রধান পেশা' })}</Label>
                <Input id="primary_occupation" name="primary_occupation" className="mt-1" placeholder="Electrician" />
              </div>
              <div>
                <Label htmlFor="trade">{t('trade', { en: 'Trade', bn: 'ট্রেড' })}</Label>
                <Input id="trade" name="trade" className="mt-1" placeholder="Electrical" />
              </div>
            </div>
            <div>
              <Label htmlFor="skills">{t('skills', { en: 'Skills (comma separated)', bn: 'দক্ষতা (কমা বিচ্ছিন্ন)' })}</Label>
              <Input id="skills" name="skills" className="mt-1" placeholder="Wiring, Repair, Installation" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="experience_years">{t('experienceYears', { en: 'Experience (years)', bn: 'অভিজ্ঞতা (বছর)' })}</Label>
                <Input id="experience_years" name="experience_years" type="number" min={0} className="mt-1" placeholder="5" />
              </div>
              <div>
                <Label htmlFor="hourlyRate">{t('hourlyRate', { en: 'Hourly rate (BDT)', bn: 'ঘন্টায় হার (BDT)' })}</Label>
                <Input id="hourlyRate" name="hourlyRate" type="number" min={0} className="mt-1" placeholder="500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="service_radius_km">{t('serviceRadius', { en: 'Service radius (km)', bn: 'সেবা রেঞ্জ (কিমি)' })}</Label>
                <Input id="service_radius_km" name="service_radius_km" type="number" min={0} className="mt-1" placeholder="10" />
              </div>
              <div>
                <Label htmlFor="max_travel_km">{t('maxTravel', { en: 'Max travel (km)', bn: 'সর্বোচ্চ ভ্রমণ (কিমি)' })}</Label>
                <Input id="max_travel_km" name="max_travel_km" type="number" min={0} className="mt-1" placeholder="25" />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" name="own_vehicle" value="true" /> {t('ownVehicle', { en: 'Own vehicle', bn: 'নিজস্ব যানবাহন' })}</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="own_tools" value="true" /> {t('ownTools', { en: 'Own tools', bn: 'নিজস্ব সরঞ্জাম' })}</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="emergency_available" value="true" /> {t('emergencyAvail', { en: 'Emergency available', bn: 'জরুরি সেবা' })}</label>
            </div>
            <div>
              <Label htmlFor="employment_types">{t('employmentTypes', { en: 'Employment types (comma separated)', bn: 'কর্মসংস্থানের ধরন (কমা বিচ্ছিন্ন)' })}</Label>
              <Input id="employment_types" name="employment_types" className="mt-1" placeholder="one_time, hourly, daily, emergency" />
            </div>
            <div>
              <Label htmlFor="warranty_offered">{t('warranty', { en: 'Warranty offered', bn: 'ওয়ারেন্টি' })}</Label>
              <select id="warranty_offered" name="warranty_offered" className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
                <option value="none">No warranty</option>
                <option value="7d">7 days</option>
                <option value="15d">15 days</option>
                <option value="30d">30 days</option>
              </select>
            </div>
            <div>
              <Label htmlFor="country">{t('country', { en: 'Country', bn: 'দেশ' })}</Label>
              <Input id="country" name="country" className="mt-1" placeholder="Bangladesh" />
            </div>
            <Button type="submit" className="w-full" size="lg">{t('completeProfile', { en: 'Complete Profile', bn: 'প্রোফাইল পূর্ণ করুন' })}</Button>
          </form>
        </div>
      </div>
    );
  }

  // Shop owner 3-step flow
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-cream py-12 px-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-warm-red flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-heading text-2xl font-bold">Galaxy Workforce</span>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-warm-ink">{t('shopOnboarding', { en: 'Set up your shop', bn: 'আপনার দোকান সেট আপ করুন' })}</h2>
          <div className="mt-4 flex justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <span key={s} className={`h-2 w-8 rounded-full ${s <= step ? 'bg-warm-red' : 'bg-warm-border'}`} />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(submitShop)} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="shop_name">{t('shopName', { en: 'Shop name', bn: 'দোকানের নাম' })}</Label>
                <Input id="shop_name" {...register('shop_name')} className="mt-1" placeholder="Auto Parts BD" />
                {errors.shop_name && <p className="text-sm text-warm-red mt-1">{errors.shop_name.message}</p>}
              </div>
              <div>
                <Label htmlFor="business_type">{t('businessType', { en: 'Business type', bn: 'ব্যবসার ধরন' })}</Label>
                <select id="business_type" {...register('business_type')} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
                  <option value="">{t('select', { en: 'Select…', bn: 'নির্বাচন করুন…' })}</option>
                  {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.business_type && <p className="text-sm text-warm-red mt-1">{errors.business_type.message}</p>}
              </div>
              <div>
                <Label htmlFor="address">{t('address', { en: 'Shop address', bn: 'দোকানের ঠিকানা' })}</Label>
                <Input id="address" {...register('address')} className="mt-1" placeholder="123 Main Road" />
              </div>
              <div>
                <Label htmlFor="city">{t('city', { en: 'City', bn: 'শহর' })}</Label>
                <Input id="city" {...register('city')} className="mt-1" placeholder="Dhaka" />
              </div>
              <div>
                <Label htmlFor="phone">{t('phone', { en: 'Phone number', bn: 'ফোন নম্বর' })}</Label>
                <Input id="phone" {...register('phone')} className="mt-1" placeholder="01XXXXXXXXX" />
              </div>
              <Button type="button" className="w-full" size="lg" onClick={() => setStep(2)}>{t('next', { en: 'Next', bn: 'পরবর্তী' })}</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="years_in_operation">{t('yearsOperation', { en: 'Years in operation', bn: 'কত বছর ধরে ব্যবসা' })}</Label>
                <Input id="years_in_operation" type="number" {...register('years_in_operation')} className="mt-1" placeholder="5" />
              </div>
              <div>
                <Label>{t('mainCategories', { en: 'Main product categories', bn: 'প্রধান পণ্য বিভাগ' })}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PRODUCT_CATEGORIES.map((c) => (
                    <label key={c} className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${selectedCategories.includes(c) ? 'border-warm-red bg-warm-red/5' : 'border-warm-border'}`}>
                      <Checkbox checked={selectedCategories.includes(c)} onCheckedChange={() => toggleCategory(c)} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => setStep(1)}>{t('back', { en: 'Back', bn: 'ফিরে যান' })}</Button>
                <Button type="button" className="w-full" onClick={() => setStep(3)}>{t('next', { en: 'Next', bn: 'পরবর্তী' })}</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="delivery_radius_km">{t('deliveryRadius', { en: 'Delivery radius (km)', bn: 'ডেলিভারি রেঞ্জ (কিমি)' })}</Label>
                <Input id="delivery_radius_km" type="number" {...register('delivery_radius_km')} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="min_order_amount">{t('minOrder', { en: 'Minimum order amount', bn: 'সর্বনিম্ন অর্ডার পরিমাণ' })}</Label>
                <Input id="min_order_amount" type="number" {...register('min_order_amount')} className="mt-1" placeholder="0" />
              </div>
              <div>
                <Label htmlFor="language">{t('language', { en: 'Language preference', bn: 'ভাষার পছন্দ' })}</Label>
                <select id="language" {...register('language')} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="w-full" onClick={() => setStep(2)}>{t('back', { en: 'Back', bn: 'ফিরে যান' })}</Button>
                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? t('common.loading', { en: 'Loading...', bn: 'লোড হচ্ছে...' }) : t('finishSetup', { en: 'Finish Setup', bn: 'সেটআপ শেষ করুন' })}
                </Button>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-warm-red">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingInner />
    </Suspense>
  );
}
