import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ReviewCardData = {
  author: string;
  role?: 'client' | 'talent';
  rating?: number;
  comment: string;
  date?: string;
};

export function ReviewCard({ review }: { review: ReviewCardData }) {
  return (
    <div className="rounded-[24px] bg-white border border-warm-border shadow-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-warm-beige flex items-center justify-center font-semibold text-warm-ink">
            {review.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-warm-ink">{review.author}</p>
            {review.role && <p className="text-xs text-warm-muted">{review.role === 'client' ? 'Client' : 'Worker'}</p>}
          </div>
        </div>
        {review.rating !== undefined && (
          <div className="flex items-center gap-0.5 text-warm-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={cn('w-3.5 h-3.5', i < review.rating! ? 'fill-warm-gold' : 'text-warm-border')} />
            ))}
          </div>
        )}
      </div>
      <p className="text-sm text-warm-muted mt-3 leading-relaxed">{review.comment}</p>
      {review.date && <p className="text-xs text-warm-muted mt-2">{review.date}</p>}
    </div>
  );
}
