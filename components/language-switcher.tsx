'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function setLocale(locale: string) {
    await fetch('/api/i18n/set-locale', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale }),
    });
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-sm text-warm-muted hover:text-warm-red"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        EN/বাং
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-lg border border-warm-border bg-white shadow-card py-1 z-50">
          <button onClick={() => setLocale('en')} className="block w-full text-left px-3 py-2 text-sm hover:bg-warm-beige">English</button>
          <button onClick={() => setLocale('bn')} className="block w-full text-left px-3 py-2 text-sm hover:bg-warm-beige">বাংলা</button>
        </div>
      )}
    </div>
  );
}
