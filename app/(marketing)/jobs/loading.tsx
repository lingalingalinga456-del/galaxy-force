import { PageSkeleton } from '@/components/page-skeleton';

export default function Loading() {
  return <PageSkeleton title={false} cards={0} rows={6} />;
}
