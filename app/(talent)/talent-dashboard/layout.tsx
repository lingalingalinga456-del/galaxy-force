import { TalentNav } from '@/components/workspace/talent-nav';

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-warm-cream">
      <TalentNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
