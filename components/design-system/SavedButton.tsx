'use client';
import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SavedButton({ initial = false }: { initial?: boolean }) {
  const [saved, setSaved] = useState(initial);
  return (
    <button
      type="button"
      aria-label={saved ? 'Saved' : 'Save to collection'}
      onClick={(e) => { e.preventDefault(); setSaved((s) => !s); }}
      className={cn('inline-flex items-center justify-center w-9 h-9 rounded-full border transition-colors', saved ? 'bg-warm-red/10 border-warm-red text-warm-red' : 'bg-white/80 border-warm-border text-warm-muted hover:text-warm-red')}
    >
      <Bookmark className={cn('w-4 h-4', saved && 'fill-warm-red')} />
    </button>
  );
}
