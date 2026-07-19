'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, LayoutDashboard, Briefcase, FileText, MessageSquare, Wallet, BarChart3, Star, Users, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const links = [
  { href: '/client', label: 'Overview', icon: LayoutDashboard },
  { href: '/client/jobs', label: 'My Jobs', icon: Briefcase },
  { href: '/client/contracts', label: 'Contracts', icon: FileText },
  { href: '/client/inbox', label: 'Inbox', icon: MessageSquare },
  { href: '/client/payments', label: 'Payments', icon: Wallet },
  { href: '/client/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/client/saved', label: 'Saved Talent', icon: Star },
  { href: '/client/talent', label: 'Discover Talent', icon: Users },
  { href: '/client/settings', label: 'Settings', icon: Settings },
];

export function ClientNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col h-full min-h-screen bg-warm-ink text-white w-60 shrink-0">
      <div className="flex items-center gap-2 p-4 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-warm-red flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold">Client</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          const Icon = l.icon;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm',
                active ? 'bg-warm-red text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="w-4 h-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-white/70 hover:text-white"
          onClick={async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/');
            router.refresh();
          }}
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign out
        </Button>
      </div>
    </div>
  );
}
