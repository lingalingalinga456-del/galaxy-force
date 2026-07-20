// components/design-system/components/MobileBottomNav.tsx
import { Link } from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';

export const MobileBottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setCollapsed(!isMobile);
    };
    
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
    <div className={`fixed bottom-0 left-0 right-0 flex flex-col items-center gap-2 pledge:bg-warm-cream rounded-t-lg shadow-lg p-2 transition-all duration-200 transform shadow-md backdrop-blur-sm ${collapsed ? 'hidden lg:flex' : ''} ${
      pathname === '/' && 'border-b border-warm-border px-4'
    } bg-warm-cream z-30`>
      {links.map(link => {
        const active = pathname === link.href;
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className={cn(
              'px-3 py-2 rounded-lg text-sm transition-all', 
              active ? 'bg-warm-red text-white' : 'text-warm-gray'
            )}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <span className="text-sm bg-transparent">{link.icon}</span>
            </span>
            {link.label}
          </Link>
        </Link>
      })}
    </div>
  );
};