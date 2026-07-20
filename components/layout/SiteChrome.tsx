import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/language-switcher';

const NAV = [
  { href: '/discover', label: 'Discover' },
  { href: '/jobs', label: 'Find Work' },
  { href: '/shops', label: 'Shops' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-warm-border bg-white/85 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-warm-red flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
          <span className="text-heading font-bold text-lg">Galaxy Workforce</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-warm-ink/80 hover:text-warm-red transition-colors">{n.label}</Link>
          ))}
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

export function SiteFooter() {
  return (
    <footer className="bg-warm-ink text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-warm-red flex items-center justify-center"><Sparkles className="w-5 h-5 text-white" /></div>
            <span className="text-heading text-lg font-bold">Galaxy Workforce</span>
          </div>
          <p className="text-sm text-white/70">AI-powered human workforce marketplace for Bangladesh and beyond.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {NAV.map((n) => (<li key={n.href}><Link href={n.href} className="hover:text-white">{n.label}</Link></li>))}
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
      <div className="container mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">© 2026 Galaxy Workforce. All rights reserved.</div>
    </footer>
  );
}
