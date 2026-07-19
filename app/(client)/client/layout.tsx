import { ClientNav } from '@/components/workspace/client-nav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-warm-cream">
      <ClientNav />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

