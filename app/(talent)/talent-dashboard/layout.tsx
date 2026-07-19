import { TalentNav } from '@/components/workspace/talent-nav';

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-warm-cream">
      <TalentNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
