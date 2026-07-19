import { ShopNav } from '@/components/workspace/shop-nav';

export const dynamic = 'force-dynamic';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-warm-cream">
      <ShopNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

