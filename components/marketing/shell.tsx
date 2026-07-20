import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';

export function MarketingHeader() {
  return (
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
          <Link href="/shops" className="hover:text-warm-red">Shops</Link>
          <Link href="/pricing" className="hover:text-warm-red">Pricing</Link>
          <Link href="/about" className="hover:text-warm-red">About</Link>
          <Link href="/faq" className="hover:text-warm-red">FAQ</Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link href="/register"><Button size="sm">Get Started</Button></Link>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
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
            <li><Link href="/shops" className="hover:text-white">Shops</Link></li>
            <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/legal/terms" className="hover:text-white">Terms</Link></li>
            <li><Link href="/legal/privacy" className="hover:text-white">Privacy</Link></li>
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
  );
}
