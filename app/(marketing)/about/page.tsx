import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-cream pb-20 md:pb-0">
      <MarketingHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="h1 mb-4">About Galaxy Workforce</h1>
          <p className="text-warm-muted leading-relaxed mb-6">
            Galaxy Workforce is an AI-powered human workforce marketplace built for Bangladesh and the wider region.
            We connect businesses with skilled freelancers, helpers, and remote workers — making it effortless to hire,
            collaborate, and pay with confidence.
          </p>
          <h2 className="text-2xl font-semibold mt-10 mb-3">Our Mission</h2>
          <p className="text-warm-muted leading-relaxed mb-6">
            To democratize access to quality work and workers through intelligent matching, secure contracts, and transparent payments.
          </p>
          <h2 className="text-2xl font-semibold mt-10 mb-3">What makes us different</h2>
          <ul className="space-y-3 text-warm-ink">
            <li>🤖 AI-assisted job briefs, proposals, and talent matching</li>
            <li>🔒 Milestone-based contracts with escrow-style protection</li>
            <li>📱 Local payment sandbox support (bKash, Nagad, SSLCommerz)</li>
            <li>🌐 Full English & Bengali (বাংলা) experience</li>
            <li>🛡️ Built-in moderation and trust scoring</li>
          </ul>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
