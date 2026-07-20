'use client';

import { SectionTitle, FAQS } from './home-shared';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

export function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionTitle kicker="Questions" title="Frequently Asked Questions" />
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`f${i}`} className="rounded-[20px] bg-white border border-warm-border px-5 shadow-card">
              <AccordionTrigger className="text-left font-medium text-warm-ink">{f.q}</AccordionTrigger>
              <AccordionContent className="text-warm-muted">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
