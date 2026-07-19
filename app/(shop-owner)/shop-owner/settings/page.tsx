'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  shop_name: z.string().min(2),
  business_type: z.string().min(1),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  delivery_radius_km: z.coerce.number().int().min(1).max(500),
  min_order_amount: z.coerce.number().min(0),
});

type Form = z.infer<typeof schema>;

export default function ShopSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<Form>({ resolver: zodResolver(schema) });

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/shop/settings');
      const data = await res.json();
      if (data.shop) reset(data.shop);
      setLoading(false);
    })();
  }, [reset]);

  async function onSubmit(data: Form) {
    setSubmitting(true);
    setError(null);
    const res = await fetch('/api/shop/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const out = await res.json();
    if (!res.ok) { setError(out.error || 'Update failed'); setSubmitting(false); return; }
    router.push('/shop-owner');
    router.refresh();
  }

  if (loading) return <div className="p-8 text-warm-muted">Loading…</div>;

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-warm-ink mb-6">Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Label htmlFor="shop_name">Shop name</Label>
          <Input id="shop_name" {...register('shop_name')} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="business_type">Business type</Label>
          <Input id="business_type" {...register('business_type')} className="mt-1" />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register('address')} className="mt-1" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register('city')} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" {...register('phone')} className="mt-1" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="delivery_radius_km">Delivery radius (km)</Label>
            <Input id="delivery_radius_km" type="number" {...register('delivery_radius_km')} className="mt-1" />
          </div>
          <div>
            <Label htmlFor="min_order_amount">Minimum order (BDT)</Label>
            <Input id="min_order_amount" type="number" {...register('min_order_amount')} className="mt-1" />
          </div>
        </div>
        {error && <p className="text-sm text-warm-red">{error}</p>}
        <Button type="submit" disabled={submitting}>{submitting ? '...' : 'Save Changes'}</Button>
      </form>
    </div>
  );
}
