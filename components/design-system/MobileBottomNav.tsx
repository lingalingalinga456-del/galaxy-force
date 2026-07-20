'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Briefcase, Inbox, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/profile', label: 'Profile', icon: User },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-warm-border bg-white/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch justify-around">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== '/' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors',
                active ? 'text-warm-red' : 'text-warm-muted'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'fill-warm-red/10')} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
