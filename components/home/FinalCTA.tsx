'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reveal } from './home-shared';

export function FinalCTA() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-warm-red to-[#b53d3d] overflow-hidden">
      <div className="container mx-auto px-4 text-center relative">
        <motion.h2 {...reveal()} className="text-heading text-3xl md:text-5xl font-bold text-white mb-6 max-w-3xl mx-auto">
          Ready to find the right person for any task?
        </motion.h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/client/jobs/new"><Button size="lg" variant="secondary" className="gap-2">Hire Human Workers <ArrowRight className="w-4 h-4" /></Button></Link>
          <Link href="/discover?tab=shops"><Button size="lg" className="gap-2 bg-white text-warm-red hover:bg-warm-beige">Find Local Products <ArrowRight className="w-4 h-4" /></Button></Link>
          <Link href="/register"><Button size="lg" className="gap-2 bg-white/15 text-white border border-white/30 hover:bg-white/25">Join as Worker or Shop <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
      </div>
    </section>
  );
}
