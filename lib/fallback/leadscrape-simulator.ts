// LeadScrape Pro — simulated external fallback (PRD v8.0 §5.4)
// Triggered only when Talent matching fails (match < 35 or zero results).
// These businesses are NOT on Galaxy Workforce and are clearly labeled as such.

export type FallbackBusiness = {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  contact: string;
  source: 'LeadScrape Pro';
  external: true;
  externalUrl: string;
};

export const LEADSCRAPE_PRO_URL = 'https://lead-scrape-pro-2.vibepreview.com';

const POOL: Omit<FallbackBusiness, 'id' | 'source' | 'external' | 'externalUrl'>[] = [
  { name: 'Dhaka Labor Supply Co.', category: 'General Labor', location: 'Dhaka', rating: 4.2, contact: '+880 1700-111-222' },
  { name: 'QuickFix Handymen', category: 'Repairs', location: 'Gulshan', rating: 4.0, contact: '+880 1700-333-444' },
  { name: 'ProClean Services', category: 'Cleaning', location: 'Banani', rating: 4.5, contact: '+880 1700-555-666' },
  { name: 'Bangla Movers', category: 'Moving', location: 'Uttara', rating: 3.9, contact: '+880 1700-777-888' },
  { name: 'Elite Electricians', category: 'Electrical', location: 'Dhanmondi', rating: 4.3, contact: '+880 1700-999-000' },
  { name: 'Green Garden Care', category: 'Landscaping', location: 'Mirpur', rating: 4.1, contact: '+880 1700-121-343' },
  { name: 'City Plumbers', category: 'Plumbing', location: 'Mohakhali', rating: 3.8, contact: '+880 1700-454-676' },
  { name: 'Swift Carpentry', category: 'Carpentry', location: 'Tejgaon', rating: 4.4, contact: '+880 1700-787-909' },
  { name: 'Bright Painters', category: 'Painting', location: 'Bashundhara', rating: 4.0, contact: '+880 1700-101-212' },
  { name: 'Reliable Welders', category: 'Metal Work', location: 'Keraniganj', rating: 3.7, contact: '+880 1700-323-434' },
];

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getLeadScrapeFallback(query: string, location: string): FallbackBusiness[] {
  const seed = hashString(`${query}|${location}`);
  const start = seed % POOL.length;
  const count = Math.min(6, POOL.length);
  const results: FallbackBusiness[] = [];

  for (let i = 0; i < count; i++) {
    const b = POOL[(start + i) % POOL.length];
    results.push({
      ...b,
      id: `ls-${seed}-${i}`,
      source: 'LeadScrape Pro',
      external: true,
      externalUrl: LEADSCRAPE_PRO_URL,
    });
  }

  return results;
}
