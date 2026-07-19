'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [display, setDisplay] = useState(children);
  const [stage, setStage] = useState<'in' | 'out'>('in');

  useEffect(() => {
    setDisplay(children);
    setStage('out');
    const raf = requestAnimationFrame(() => setStage('in'));
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, children]);

  return (
    <div className="route-fade" data-stage={stage} key={pathname}>
      {display}
    </div>
  );
}
