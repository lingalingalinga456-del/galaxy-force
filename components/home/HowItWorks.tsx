'use client';

import { motion } from 'framer-motion';
import { SectionTitle, reveal, Img, IMG } from './home-shared';

export function HowItWorks() {
  return (
    <section className="py-20 bg-warm-beige/60">
      <div className="container mx-auto px-4">
        <SectionTitle kicker="Simple by design" title="How It Works" />
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-semibold text-warm-red mb-5">For Clients</h3>
            <div className="space-y-4">
              {[['Describe your need', 'Tell the AI what you need in plain language.', IMG.electrician], ['AI matches workers', 'Get matched with verified, available talent.', IMG.mechanic], ['Hire & pay safely', 'Pay through escrow and confirm completion.', IMG.cleaner]].map((s, i) => (
                <motion.div key={i} {...reveal(i * 0.1)} className="flex items-center gap-4 rounded-[24px] bg-white border border-warm-border shadow-card p-4">
                  <div className="w-10 h-10 rounded-full bg-warm-red text-white flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                  <div className="flex-1"><div className="font-semibold text-warm-ink">{s[0]}</div><div className="text-sm text-warm-muted">{s[1]}</div></div>
                  <Img src={s[2] as string} alt="" className="w-14 h-14 rounded-xl object-cover hidden sm:block" />
                </motion.div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-warm-gold mb-5">For Workers & Shops</h3>
            <div className="space-y-4">
              {[['Create your profile', 'Showcase skills or products with verification.', IMG.tutor], ['Get matched', 'Receive jobs that fit your location and skill.', IMG.construction], ['Earn with trust', 'Build your score and grow your income.', IMG.shop]].map((s, i) => (
                <motion.div key={i} {...reveal(i * 0.1)} className="flex items-center gap-4 rounded-[24px] bg-white border border-warm-border shadow-card p-4">
                  <div className="w-10 h-10 rounded-full bg-warm-gold text-warm-ink flex items-center justify-center font-bold shrink-0">{i + 1}</div>
                  <div className="flex-1"><div className="font-semibold text-warm-ink">{s[0]}</div><div className="text-sm text-warm-muted">{s[1]}</div></div>
                  <Img src={s[2] as string} alt="" className="w-14 h-14 rounded-xl object-cover hidden sm:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
