'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function NavProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), 650);
    return () => clearTimeout(t);
  }, [pathname]);

  return <div className={`nav-progress${active ? ' active' : ''}`} aria-hidden="true" />;
}
