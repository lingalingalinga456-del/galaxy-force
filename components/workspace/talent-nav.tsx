'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, LayoutDashboard, FileText, Send, ClipboardCheck, MessageSquare, Wallet, FolderOpen, Settings, LogOut, Home, Compass, Briefcase, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/talent-dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/talent-dashboard/proposals', label: 'Proposals', icon: Send },
  { href: '/talent-dashboard/contracts', label: 'Contracts', icon: ClipboardCheck },
  { href: '/talent-dashboard/inbox', label: 'Inbox', icon: MessageSquare },
  { href: '/talent-dashboard/earnings', label: 'Earnings', icon: Wallet },
  { href: '/talent-dashboard/portfolio', label: 'Portfolio', icon: FolderOpen },
  { href: '/talent-dashboard/profile', label: 'Profile', icon: FileText },
  { href: '/talent-dashboard/growth', label: 'Growth', icon: TrendingUp },
  { href: '/talent-dashboard/settings', label: 'Settings', icon: Settings },
];

const siteLinks = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/jobs', label: 'Find Work', icon: Briefcase },
  { href: '/discover', label: 'Discover', icon: Compass },
  { href: '/pricing', label: 'Pricing', icon: Wallet },
];

export function TalentNav() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="flex flex-col sticky top-0 h-screen bg-warm-ink text-white w-60 shrink-0 overflow-y-auto">
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-warm-red flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold">Talent</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link key={l.href} href={l.href} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm', active ? 'bg-warm-red text-white' : 'text-white/70 hover:bg-white/10 hover:text-white')}>
              <Icon className="w-4 h-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 pb-1">
        <div className="text-xs uppercase tracking-wide text-white/40 px-3 pt-2 pb-1">On the site</div>
        {siteLinks.map((l) => {
          const Icon = l.icon;
          return (
            <Link key={l.href} href={l.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:bg-white/10 hover:text-white">
              <Icon className="w-4 h-4" />
              {l.label}
            </Link>
          );
        })}
      </div>
      <div className="p-3 border-t border-white/10">
        <Button variant="ghost" size="sm" className="w-full justify-start text-white/70 hover:text-white" onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); router.push('/'); router.refresh(); }}>
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </Button>
      </div>
    </div>
  );
}

