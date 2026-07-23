'use client';

import Link from 'next/link';

interface ShopCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  coverImage: string;
}

export function ShopCard({
  id,
  name,
  location,
  rating,
  reviewCount,
  deliveryTime,
  coverImage,
}: ShopCardProps) {
  return (
    <div className="bg-white border border-warm-border rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all w-full">
      <img
        src={coverImage}
        alt={name}
        className="h-36 w-full object-cover"
        loading="lazy"
      />
      
      <div className="p-5">
        <div className="flex justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-lg truncate text-warm-ink">{name}</h3>
            <p className="text-sm text-warm-muted">{location}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-warm-muted justify-end">⭐ {rating}</div>
            <p className="text-xs text-warm-muted">{reviewCount} reviews</p>
          </div>
        </div>

        <p className="text-sm text-warm-muted mt-2">🚚 {deliveryTime} delivery</p>

        <Link href={`/shop/${id}`}>
          <button className="mt-4 w-full border border-warm-red text-warm-red hover:bg-warm-red hover:text-white py-2 rounded-2xl text-sm touch-target transition-colors">
            Browse Store
          </button>
        </Link>
      </div>
    </div>
  );
}