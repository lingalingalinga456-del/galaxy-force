'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';

interface WorkerCardProps {
  id: string;
  avatar: string;
  name: string;
  role: string;
  location: string;
  distance: string;
  hourlyRate: number;
  completedJobs: number;
  trustScore: number;
  availability: 'available' | 'busy' | 'emergency' | string;
}

export function WorkerCard({
  id,
  avatar,
  name,
  role,
  location,
  distance,
  hourlyRate,
  completedJobs,
  trustScore,
  availability,
}: WorkerCardProps) {
  const isAvailable = availability === 'available';
  const isEmergency = availability === 'emergency';

  return (
    <div className="bg-white border border-warm-border rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-1 w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-shrink-0">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-white"
            loading="lazy"
          />
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
              isAvailable
                ? 'bg-warm-green'
                : isEmergency
                ? 'bg-warm-red'
                : 'bg-warm-gold'
            }`}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-lg truncate text-warm-ink">{name}</h3>
              <p className="text-sm text-warm-muted">{role}</p>
            </div>
            <div className="bg-warm-beige border border-warm-gold text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 whitespace-nowrap">
              <Star className="w-3 h-3 text-warm-gold fill-warm-gold" />
              {trustScore}
            </div>
          </div>

          <p className="text-sm text-warm-muted mt-1">
            {location} • {distance}
          </p>

          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-xl font-semibold text-warm-ink">৳{hourlyRate}</span>
              <span className="text-sm text-warm-muted">/hr</span>
            </div>
            <span className="text-sm text-warm-muted">{completedJobs} jobs</span>
          </div>
        </div>
      </div>

      <Link href={`/talent/${id}`}>
        <button className="mt-4 w-full bg-warm-red hover:bg-warm-red-hover text-white py-2.5 rounded-2xl font-semibold transition-colors text-sm touch-target">
          View Profile
        </button>
      </Link>
    </div>
  );
}