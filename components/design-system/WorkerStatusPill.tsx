// components/design-system/components/WorkerStatusPill.tsx
import { styled } from '@stitches/react';
export const WorkerStatusPill = styled.div`
  background-color: var(--color-warm-beige);
  border-radius: 20px;
  padding: 4px 12px;
  font-size: 0.8rem;
  color: var(--color-warm-ink);
  border: 1px solid var(--color-warm-beige);

  &.active {
    background-color: var(--color-warm-red);
    border: 2px solid var(--color-warm-red);
    color: #fff;
  }

  &.unverified {
    background-color: var(--color-warm-border);
    color: var(--color-warm-muted);
    border: 1px solid var(--color-warm-border);
  }
`;