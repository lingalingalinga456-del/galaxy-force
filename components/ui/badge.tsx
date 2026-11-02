'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-warm-beige text-warm-ink',
        success: 'bg-warm-green/10 text-warm-green',
        warning: 'bg-amber-100 text-amber-700',
        danger: 'bg-warm-red/10 text-warm-red',
        info: 'bg-blue-100 text-blue-700',
        gold: 'bg-warm-gold/20 text-warm-gold',
        outline: 'border border-warm-border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
