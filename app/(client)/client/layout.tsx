import { ClientNav } from '@/components/workspace/client-nav';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-warm-cream">
      <ClientNav />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
