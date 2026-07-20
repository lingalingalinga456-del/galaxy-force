'use client';

import { motion } from 'framer-motion';
import { Users, Brain, HeartHandshake, Globe2 } from 'lucide-react';
import { SectionTitle, reveal } from './home-shared';

export function WhyGalaxy() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Why us" title="Why Galaxy Workforce" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Users className="w-6 h-6" />, t: 'Real Human Workers', d: 'Every profile is a real, verified person — never bots or automation.' },
            { icon: <Brain className="w-6 h-6" />, t: 'AI That Understands', d: 'Our matching reads intent, not just keywords, to find the right fit.' },
            { icon: <HeartHandshake className="w-6 h-6" />, t: 'Trust & Verification', d: 'NID, phone, and admin checks build confidence on both sides.' },
            { icon: <Globe2 className="w-6 h-6" />, t: 'Online & Offline', d: 'Hire for remote tasks or in-person work with equal safety.' },
          ].map((b, i) => (
            <motion.div key={i} {...reveal(i * 0.08)} className="rounded-[24px] bg-white border border-warm-border shadow-card p-6">
              <div className="w-12 h-12 rounded-2xl bg-warm-gold/15 text-warm-ink flex items-center justify-center mb-4">{b.icon}</div>
              <h3 className="font-semibold text-warm-ink mb-2">{b.t}</h3>
              <p className="text-sm text-warm-muted">{b.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
