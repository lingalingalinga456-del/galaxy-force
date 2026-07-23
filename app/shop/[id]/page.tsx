'use client';

import { createClient } from '@/lib/supabase/server';
import { SectionTitle } from '@/components/design-system/SectionTitle';
import ProductCard from '@/components/design-system/ProductCard';
import { TrustBadge } from '@/components/design-system/TrustBadge';
import { Img } from '@/components/home/home-shared';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
const safeProducts = products ?? [];
  const safeReviews = reviews ?? [];

type Shop = {
  id: string;
  shop_name: string;
  business_type: string;
  city: string;
  trust_score: number;
  verification_status: string;
  banner_url: string;
  description: string;
  years_active: number;
  delivery_radius_km: number;
  total_orders: number;
  average_rating: number;
  reviews_count: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: string;
  image_url: string;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user: {
    full_name: string;
    avatar_url: string;
  };
};

export default async function ShopProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: shop, error: shopError } = await supabase
    .from('shop_profiles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (shopError || !shop) {
    return <div className="p-4 text-center text-warm-red">Shop not found</div>;
  }

  // Fetch products
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shop.id);

  // Fetch reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('rating, comment, created_at, user: full_name, avatar_url')
    .eq('shop_id', shop.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Calculate average rating and format delivery time
  const avgRating = shop.average_rating?.toFixed(1) || '0';
  const deliveryTime = `${shop.delivery_radius_km}km radius`;
  const statusLabel = shop.verification_status === 'verified' ? 'Open' : 'Closed';
  const statusVariant = shop.verification_status === 'verified' ? 'green' : 'gold';

  return (
    <div className="min-h-screen bg-warm-cream pb-20 md:pb-0">
      {/* Shop Header */}
      <div className="container mx-auto px-4 py-10">
        <div className="relative h-80 md:h-96 rounded-[24px] bg-gradient-to-br from-warm-beige to-warm-cream overflow-hidden">
          <Img
            src={shop.banner_url || '/default-banner.jpg'}
            alt={shop.shop_name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-white/80 rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1">
            <span className="text-warm-blue">🏪</span> {shop.shop_name}
          </div>
        </div>

        <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:items-start">
            <h1 className="text-3xl md:text-4xl font-bold text-warm-ink">{shop.shop_name}</h1>
            <StatusPill label={statusLabel} variant={statusVariant} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-warm-yellow">{shop.trust_score}/100</span>
              <span className="text-sm text-warm-muted">Trust Score</span>
            </div>
            <Badge variant={shop.verification_status === 'verified' ? 'success' : 'warning'}>
              {shop.verification_status === 'verified' ? 'Verified' : 'Pending'}
            </Badge>
          </div>
        </div>

        <div className="mt-3 flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-warm-muted">📍</span>
            <span className="text-sm text-warm-ink">{shop.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-warm-muted">🚚</span>
            <span className="text-sm text-warm-ink">{deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* About Shop */}
      <div className="container mx-auto px-4 py-8">
        <SectionTitle>About {shop.shop_name}</SectionTitle>
        <p className="text-warm-muted mt-2">{shop.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { label: shop.years_active, unit: 'Years Active', icon: '📅' },
            { label: `${shop.delivery_radius_km}km`, unit: 'Delivery Radius', icon: '🚚' },
            { label: shop.total_orders, unit: 'Total Orders', icon: '📦' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-warm-ink">{stat.label}</div>
              <p className="text-sm text-warm-muted">{stat.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Catalog */}
      <div className="container mx-auto px-4 py-10">
        <SectionTitle>Products</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {safeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

{/* Reviews Section (Premium) */}
<div className="container mx-auto px-4 py-10 bg-gradient-to-b from-warm-beige to-warm-cream rounded-[24px]">
  <SectionTitle>Customer Reviews</SectionTitle>
  <div className="space-y-6 max-w-3xl mx-auto">
    {safeReviews.map((review) => (
      <div key={review.id} className="p-4 rounded-xl bg-white border border-warm-border shadow-sm hover:shadow-card-lift">
        <div className="flex items-center gap-3">
          <Img
            src={review.avatar_url || '/default-avatar.png'}
            alt={review.user.full_name}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-warm-yellow font-bold">
                {Array.from({length: review.rating}, (_, i) => '★').join('')}{Array.from({length: 5-review.rating}, (_, i) => '☆').join('')}</span>
            </div>
            <p className="mt-1 text-sm text-warm-muted truncate">{review.comment}</p>
          </div>
        </div>
        <div className="mt-2 text-xs text-warm-muted flex justify-between">
          <span>
            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          <span className="text-warm-yellow" className="mx-1">
            — {review.user.full_name}
          </span>
        </div>
      </div>
    ))}
    {safeReviews.length === 0 && (
      <p className="text-sm text-warm-muted">No reviews yet. Be the first to review!</p>
    )}
  </div>
</div>

      {/* Trust & Verification */}
      <div className="container mx-auto px-4 py-10">
        <SectionTitle>Verification & Trust</SectionTitle>
        <div className="flex flex-wrap gap-2 justify-start">
          {[ 'NID', 'Admin Approved', 'Trade License' ].map((badge) => (
            <TrustBadge key={badge} label={badge} />
          ))}
        </div>
      </div>

      {/* Fallback for empty state */}
      {products.length === 0 && (
        <div className="container mx-auto px-4 py-10 text-center">
          <p className="text-warm-muted">No products listed yet.</p>
        </div>
      )}
    </div>
  );
}

// Helper component for status pill
function StatusPill({ label, variant }: { label: string; variant: 'green' | 'gold' | 'red' }) {
  const variants: Record<string, string> = {
    green: 'bg-green-100 text-green-800',
    gold: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>{label}</span>;
}