import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-warm-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-warm-border bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-warm-red flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-heading text-xl font-bold">Galaxy Workforce</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/discover" className="hover:text-warm-red">Discover Talent</Link>
            <Link href="/jobs" className="hover:text-warm-red">Find Work</Link>
            <Link href="/pricing" className="hover:text-warm-red">Pricing</Link>
            <Link href="/about" className="hover:text-warm-red">About</Link>
            <Link href="/faq" className="hover:text-warm-red">FAQ</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-beige text-warm-muted text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            AI-powered human workforce marketplace
          </div>
          <h1 className="text-heading text-5xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto">
            Find the right talent for every task
          </h1>
          <p className="text-lg text-warm-muted mb-8 max-w-2xl mx-auto">
            Connect with skilled freelancers, helpers, and remote workers. Get AI-assisted matching, secure contracts, and seamless collaboration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=client">
              <Button size="lg" className="gap-2">
                Hire Talent <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register?role=talent">
              <Button size="lg" variant="secondary" className="gap-2">
                Join as Talent <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-warm-muted mt-4">No credit card required to explore.</p>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="py-12 bg-warm-beige">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-warm-red">12K+</div>
            <div className="text-sm text-warm-muted">Verified Talents</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-warm-red">8K+</div>
            <div className="text-sm text-warm-muted">Completed Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-warm-red">98%</div>
            <div className="text-sm text-warm-muted">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-warm-red">৳2.5Cr</div>
            <div className="text-sm text-warm-muted">Paid to Talents</div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-heading text-3xl font-bold mb-4 text-center">Explore by Category</h2>
          <p className="text-warm-muted text-center mb-12">Find talent across all major skill areas</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/discover?category=${cat.slug}`}>
                <div className="p-6 rounded-card bg-white border border-warm-border shadow-card hover:shadow-card-hover transition-all">
                  <div className="text-2xl mb-3">{cat.icon}</div>
                  <div className="font-medium mb-1">{cat.name_en}</div>
                  <div className="text-xs text-warm-muted">{cat.jobCount} jobs</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-warm-red">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-heading text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses and talents already using Galaxy Workforce.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register?role=client">
              <Button size="lg" variant="secondary" className="gap-2">
                Hire Talent <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/register?role=talent">
              <Button size="lg" variant="ghost" className="gap-2 bg-white text-warm-red hover:bg-warm-beige">
                Join as Talent <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warm-ink text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-warm-red flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-heading text-lg font-bold">Galaxy Workforce</span>
            </div>
            <p className="text-sm text-white/70">AI-powered human workforce marketplace for Bangladesh and beyond.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/discover" className="hover:text-white">Discover Talent</Link></li>
              <li><Link href="/jobs" className="hover:text-white">Find Work</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/about" className="hover:text-white">About</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-white">Cookies</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>support@galaxyworkforce.com</li>
              <li>Dhaka, Bangladesh</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">
          © 2026 Galaxy Workforce. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const categories = [
  { slug: 'web-development', name_en: 'Web Development', icon: '🌐', jobCount: 1203 },
  { slug: 'mobile-development', name_en: 'Mobile Development', icon: '📱', jobCount: 856 },
  { slug: 'ui-ux-design', name_en: 'UI/UX Design', icon: '🎨', jobCount: 642 },
  { slug: 'graphic-design', name_en: 'Graphic Design', icon: '✏️', jobCount: 934 },
  { slug: 'digital-marketing', name_en: 'Digital Marketing', icon: '📈', jobCount: 745 },
  { slug: 'content-writing', name_en: 'Content Writing', icon: '📝', jobCount: 521 },
  { slug: 'video-animation', name_en: 'Video & Animation', icon: '🎬', jobCount: 388 },
  { slug: 'data-entry', name_en: 'Data Entry', icon: '📊', jobCount: 421 },
  { slug: 'virtual-assistant', name_en: 'Virtual Assistant', icon: '💼', jobCount: 289 },
  { slug: 'translation', name_en: 'Translation', icon: '🌍', jobCount: 167 },
];