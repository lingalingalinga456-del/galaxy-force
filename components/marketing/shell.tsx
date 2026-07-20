import { SiteHeader, SiteFooter } from '@/components/layout/SiteChrome';
import { MobileBottomNav } from '@/components/design-system/MobileBottomNav';

export function MarketingHeader() {
  return (
    <>
      <SiteHeader />
      <MobileBottomNav />
    </>
  );
}

export function MarketingFooter() {
  return <SiteFooter />;
}
