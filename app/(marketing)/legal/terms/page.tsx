import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-warm-cream pb-20 md:pb-0">
      <MarketingHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl prose">
          <h1 className="h1 mb-6">Terms of Service</h1>
          <p className="text-warm-muted">Last updated: 2026-01-01</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">1. Acceptance of Terms</h2>
          <p className="text-warm-muted leading-relaxed">By accessing Galaxy Workforce you agree to these terms. If you do not agree, do not use the platform.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">2. User Responsibilities</h2>
          <p className="text-warm-muted leading-relaxed">You are responsible for the accuracy of your profile, the legality of work posted, and compliance with local laws.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">3. Payments & Fees</h2>
          <p className="text-warm-muted leading-relaxed">Payments are processed per milestone. The sandbox environment is for testing only and moves no real funds.</p>
          <h2 className="text-2xl font-semibold mt-8 mb-2">4. Content & Conduct</h2>
          <p className="text-warm-muted leading-relaxed">All content is subject to moderation. Harmful, fraudulent, or illegal activity results in account suspension.</p>
          <p className="text-warm-muted mt-8">This is a demo document and not legal advice.</p>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
