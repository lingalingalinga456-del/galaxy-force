import { Card } from '@/components/ui/card';

export function SkeletonCard({ className = '' }: { className?: string }) {
  return <div className={`skeleton h-24 w-full ${className}`} />;
}

export function PageSkeleton({
  title = true,
  cards = 3,
  rows = 0,
}: {
  title?: boolean;
  cards?: number;
  rows?: number;
}) {
  return (
    <div className="p-6 lg:p-8">
      {title && <div className="skeleton h-8 w-64 mb-2 rounded-md" />}
      {title && <div className="skeleton h-4 w-80 mb-6 rounded-md" />}
      <div className={`grid gap-4 ${cards === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {Array.from({ length: cards }).map((_, i) => (
          <SkeletonCard key={i} className={i === 0 ? 'h-28' : 'h-28'} />
        ))}
      </div>
      {rows > 0 && (
        <div className="mt-8 space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <Card key={i} className="p-5">
              <div className="skeleton h-5 w-1/2 mb-2 rounded-md" />
              <div className="skeleton h-4 w-3/4 rounded-md" />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
