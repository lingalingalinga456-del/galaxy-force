'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation, useLocale } from '@/lib/i18n/client';

const CATEGORIES = ['Automotive', 'Tools', 'Electronics', 'General', 'Hardware', 'Spare Parts', 'Accessories'];

const schema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Select a category'),
  price: z.coerce.number().min(0, 'Price must be >= 0'),
  stock_quantity: z.coerce.number().int().min(0).default(0),
  delivery_days: z.coerce.number().int().min(1).max(60).default(3),
  status: z.enum(['draft', 'published']).default('draft'),
});

type Form = z.infer<typeof schema>;

export default function NewProductPage() {
  const { t } = useTranslation();
  const locale = useLocale();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { status: 'draft', stock_quantity: 0, delivery_days: 3, category: '' },
  });

  async function onSubmit(data: Form) {
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        language: locale,
      }),
    });
    const out = await res.json();
    if (!res.ok) {
      setError(out.error || 'Failed to create product');
      setSubmitting(false);
      return;
    }
    router.push('/shop-owner/products');
    router.refresh();
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">{t('shopOwner.addProduct', { en: 'Add Product', bn: 'পণ্য যোগ করুন' })}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="name">{t('shopOwner.productName', { en: 'Product name', bn: 'পণ্যের নাম' })}</Label>
          <Input id="name" {...register('name')} className="mt-1" />
          {errors.name && <p className="text-sm text-warm-red mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">{t('shopOwner.productDescription', { en: 'Description', bn: 'বিবরণ' })}</Label>
          <Textarea id="description" {...register('description')} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">{t('shopOwner.category', { en: 'Category', bn: 'বিভাগ' })}</Label>
            <select id="category" {...register('category')} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
              <option value="">{t('shopOwner.select', { en: 'Select…', bn: 'নির্বাচন করুন…' })}</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-sm text-warm-red mt-1">{errors.category.message}</p>}
          </div>
          <div>
            <Label htmlFor="price">{t('shopOwner.price', { en: 'Price (BDT)', bn: 'মূল্য (BDT)' })}</Label>
            <Input id="price" type="number" {...register('price')} className="mt-1" />
            {errors.price && <p className="text-sm text-warm-red mt-1">{errors.price.message}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock_quantity">{t('shopOwner.stock', { en: 'Stock quantity', bn: 'স্টক পরিমাণ' })}</Label>
            <Input id="stock_quantity" type="number" {...register('stock_quantity')} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="delivery_days">{t('shopOwner.deliveryDays', { en: 'Delivery days', bn: 'ডেলিভারি দিন' })}</Label>
            <Input id="delivery_days" type="number" {...register('delivery_days')} className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="status">{t('shopOwner.published', { en: 'Status', bn: 'অবস্থা' })}</Label>
          <select id="status" {...register('status')} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
            <option value="draft">{t('shopOwner.draft', { en: 'Draft', bn: 'ড্রাফট' })}</option>
            <option value="published">{t('shopOwner.published', { en: 'Published', bn: 'প্রকাশিত' })}</option>
          </select>
        </div>
        {error && <p className="text-sm text-warm-red">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>{t('shopOwner.back', { en: 'Back', bn: 'ফিরে যান' })}</Button>
          <Button type="submit" disabled={submitting}>{submitting ? '...' : t('shopOwner.addProduct', { en: 'Add Product', bn: 'পণ্য যোগ করুন' })}</Button>
        </div>
      </form>
    </div>
  );
}
