import { cn } from '@/lib/utils';

type CategoryChipProps = {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
  href?: string;
};

export function CategoryChip({ label, icon, active, onClick, href }: CategoryChipProps) {
  const className = cn(
    'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm border transition-all duration-150',
    active
      ? 'bg-warm-red text-white border-warm-red'
      : 'bg-white text-warm-ink border-warm-border hover:border-warm-red hover:text-warm-red hover:scale-[1.05]'
  );
  const content = (
    <>
      {icon && <span className="text-base leading-none">{icon}</span>}
      <span>{label}</span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
