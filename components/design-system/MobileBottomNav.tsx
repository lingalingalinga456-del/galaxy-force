// components/design-system/components/MobileBottomNav.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setCollapsed(!isMobile);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const links = [
    { href: '/', label: 'Home', icon: 'Home' },
    { href: '/jobs', label: 'Find Work', icon: 'Briefcase' },
    { href: '/discover', label: 'Discover', icon: 'Compass' },
    { href: '/wallet', label: 'Money', icon: 'Wallet' },
    { href: '/profile', label: 'Profile', icon: 'User' }
  ];

  return (
    <div className={cn(
      'fixed bottom-0 left-0 right-0 flex flex-col items-center gap-2 bg-warm-cream rounded-t-lg shadow-lg p-2 transition-all duration-200 transform shadow-md backdrop-blur-sm border-t border-warm-border mx-auto',
      collapsed && 'hidden lg:flex'
    )}>
      {links.map(link => {
        const active = pathname === link.href;
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={cn(
              'px-3 py-2 rounded-lg text-sm transition-all', 
              active ? 'bg-warm-red text-white' : 'text-warm-muted'
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
};