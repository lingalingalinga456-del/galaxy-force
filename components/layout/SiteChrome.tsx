'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-warm-border bg-white/85 backdrop-blur-sm">
      <div className="container page-px py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-warm-red flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-heading font-bold text-lg">Galaxy Workforce</span>
        </Link>

        <nav className="hidden xl:flex items-center gap-6 text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-warm-ink/80 hover:text-warm-red transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" size="sm">
              Sign in
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Get Started</Button>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="hidden xl:flex md:inline-flex items-center justify-center w-10 h-10 rounded-lg border border-warm-border text-warm-ink"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-warm-border bg-white">
          <nav className="container page-px py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-warm-ink/80 hover:bg-warm-beige hover:text-warm-red transition-colors text-sm"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex items-center gap-3 px-3 py-3 sm:hidden">
              <LanguageSwitcher />
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm text-warm-ink/80">
                Sign in
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-warm-ink text-white py-12">
      <div className="container page-px grid grid-cols-1 md:grid-cols-4 gap-8">
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
          <h3 className="font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-4">Resources</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              <Link href="/faq" className="hover:text-white">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:text-white">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/legal/privacy" className="hover:text-white">
                Privacy
              </Link>
            </li>
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
      <div className="container page-px mt-8 pt-8 border-t border-white/10 text-center text-sm text-white/50">
        © 2026 Galaxy Workforce. All rights reserved.
      </div>
    </footer>
  );
}