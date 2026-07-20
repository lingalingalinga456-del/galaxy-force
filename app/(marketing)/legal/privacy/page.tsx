import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-warm-cream pb-20 md:pb-0">
      <MarketingHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl prose">
          <h1 className="h1 mb-6">Privacy Policy</h1>
          <p className="text-warm-muted">Last updated: 2026-01-01</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">Data we collect</h2>
          <p className="text-warm-muted leading-relaxed">We collect account information, profile details, and activity necessary to operate the marketplace.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">How we use data</h2>
          <p className="text-warm-muted leading-relaxed">To match talent with jobs, secure contracts, and improve our AI features. We never sell your personal data.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">Your rights</h2>
          <p className="text-warm-muted leading-relaxed">You may request export or deletion of your data at any time via support.</p>
          <p className="text-warm-muted mt-8">This is a demo document and not legal advice.</p>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
