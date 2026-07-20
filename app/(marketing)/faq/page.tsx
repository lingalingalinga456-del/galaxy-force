import { MarketingHeader, MarketingFooter } from '@/components/marketing/shell';

const faqs = [
  { q: 'How do I hire a freelancer?', a: 'Post a job from your client workspace, review proposals, and award a contract. Work is split into milestones with secure payments.' },
  { q: 'Is Galaxy Workforce free to join?', a: 'Yes. Browsing talent and creating an account is free. Paid plans unlock advanced features for businesses that hire regularly.' },
  { q: 'How are payments handled?', a: 'Payments are released per milestone once you approve the delivery. A sandbox mode lets you simulate local payment methods safely.' },
  { q: 'Can I use the platform in Bengali?', a: 'Absolutely. Galaxy Workforce supports both English and বাংলা across the entire interface.' },
  { q: 'How does AI matching work?', a: 'Our AI estimates a match score between a talent’s skills, rate, and availability and your job requirements, helping you shortlist faster.' },
  { q: 'What if something goes wrong?', a: 'Every contract includes dispute support and admin moderation. Our support team is here to help.' },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-warm-cream pb-20 md:pb-0">
      <MarketingHeader />
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="h1 mb-8 text-center">Frequently Asked Questions</h1>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="p-6 rounded-xl bg-white border border-warm-border">
                <h3 className="font-semibold text-warm-ink mb-2">{f.q}</h3>
                <p className="text-sm text-warm-muted leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
