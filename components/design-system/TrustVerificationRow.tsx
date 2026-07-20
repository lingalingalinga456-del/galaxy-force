import { BadgeCheck, Phone, Fingerprint, ShieldCheck, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type VerificationType = 'nid' | 'phone' | 'face' | 'trade_license' | 'admin';

const map: Record<VerificationType, { label: string; icon: React.ReactNode }> = {
  nid: { label: 'NID Verified', icon: <Fingerprint className="w-3.5 h-3.5" /> },
  phone: { label: 'Phone Verified', icon: <Phone className="w-3.5 h-3.5" /> },
  face: { label: 'Face Verified', icon: <BadgeCheck className="w-3.5 h-3.5" /> },
  trade_license: { label: 'Trade License', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  admin: { label: 'Admin Approved', icon: <UserCheck className="w-3.5 h-3.5" /> },
};

export function TrustVerificationRow({ verified = [] }: { verified?: VerificationType[] }) {
  const all = Object.keys(map) as VerificationType[];
  return (
    <div className="flex flex-wrap gap-2">
      {all.map((t) => {
        const has = verified.includes(t);
        return (
          <span
            key={t}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border',
              has ? 'bg-warm-green/10 text-warm-green border-warm-green/20' : 'bg-warm-beige text-warm-muted border-warm-border line-through opacity-60'
            )}
          >
            {map[t].icon}
            {map[t].label}
          </span>
        );
      })}
    </div>
  );
}
