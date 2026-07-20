import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-warm-cream pb-20 md:pb-0">
      <MarketingHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl prose">
          <h1 className="h1 mb-6">Cookie Policy</h1>
          <p className="text-warm-muted">Last updated: 2026-01-01</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">What cookies we use</h2>
          <p className="text-warm-muted leading-relaxed">We use essential cookies for authentication and a preference cookie to remember your language choice.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">Managing cookies</h2>
          <p className="text-warm-muted leading-relaxed">You can clear or block cookies in your browser settings. This may affect your signed-in experience.</p>
          <p className="text-warm-muted mt-8">This is a demo document and not legal advice.</p>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
