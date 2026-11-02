import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';

const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    tagline: 'For individuals exploring the platform',
    features: ['Browse talent', 'Post up to 3 jobs', 'Basic AI matching', 'Community support'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '৳499',
    period: '/mo',
    tagline: 'For growing businesses hiring regularly',
    features: ['Unlimited job posts', 'Advanced AI matching', 'Priority support', 'Analytics dashboard', 'Saved talent lists'],
    cta: 'Start Growth',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    tagline: 'For agencies and large teams',
    features: ['Everything in Growth', 'Dedicated account manager', 'API access', 'Custom contracts', 'SLA & compliance'],
    cta: 'Contact Sales',
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-warm-cream">
      <MarketingHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-heading text-4xl font-bold mb-3">Simple, transparent pricing</h1>
          <p className="text-warm-muted max-w-xl mx-auto mb-12">Choose the plan that fits your hiring needs. No hidden fees.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {tiers.map((tier) => (
              <div key={tier.name} className={`p-8 rounded-2xl border bg-white ${tier.highlight ? 'border-warm-red shadow-card-hover' : 'border-warm-border'}`}>
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-warm-ink">{tier.price}</span>
                  {tier.period && <span className="text-warm-muted">{tier.period}</span>}
                </div>
                <p className="text-sm text-warm-muted mb-6">{tier.tagline}</p>
                <ul className="space-y-2 text-sm text-warm-ink mb-8 text-left">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-warm-green">✓</span>{f}</li>
                  ))}
                </ul>
                <Link href="/register" className="block">
                  <Button className="w-full" variant={tier.highlight ? 'default' : 'outline'}>{tier.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
