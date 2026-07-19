'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CATEGORIES = ['Automotive', 'Tools', 'Electronics', 'General', 'Hardware', 'Spare Parts', 'Accessories'];

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.string().min(1),
  price: z.coerce.number().min(0),
  stock_quantity: z.coerce.number().int().min(0),
  delivery_days: z.coerce.number().int().min(1).max(60),
  status: z.enum(['draft', 'published', 'paused', 'archived']),
});

type Form = z.infer<typeof schema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/products?id=${id}`);
      const data = await res.json();
      if (data.product) reset(data.product);
      setLoading(false);
    })();
  }, [id, reset]);

  async function onSubmit(data: Form) {
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    });
    const out = await res.json();
    if (!res.ok) { setError(out.error || 'Update failed'); setSubmitting(false); return; }
    router.push('/shop-owner/products');
    router.refresh();
  }

  if (loading) return <div className="p-8 text-warm-muted">Loading…</div>;

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Edit Product</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="name">Product name</Label>
          <Input id="name" {...register('name')} className="mt-1" />
          {errors.name && <p className="text-sm text-warm-red mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register('description')} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Category</Label>
            <select id="category" {...register('category')} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="price">Price (BDT)</Label>
            <Input id="price" type="number" {...register('price')} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock_quantity">Stock quantity</Label>
            <Input id="stock_quantity" type="number" {...register('stock_quantity')} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="delivery_days">Delivery days</Label>
            <Input id="delivery_days" type="number" {...register('delivery_days')} className="mt-1" />
          </div>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select id="status" {...register('status')} className="mt-1 block w-full rounded-md border-warm-border bg-white px-3 py-2 text-sm ring-1 ring-warm-border">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="paused">Paused</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        {error && <p className="text-sm text-warm-red">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Back</Button>
          <Button type="submit" disabled={submitting}>{submitting ? '...' : 'Save Changes'}</Button>
        </div>
      </form>
    </div>
  );
}
