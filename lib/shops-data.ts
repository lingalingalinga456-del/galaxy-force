// Demo shops + products for the standalone /shops discovery page.
import { IMG } from '@/components/home/home-shared';

export const SHOP_CATS = [
  { slug: 'skilled-trades', emoji: '🔧', name: 'Skilled Trades', subcategories: ['Hardware Store', 'Tools & Equipment', 'Electrical Parts'], priority: 'High' as const },
  { slug: 'home-services', emoji: '🏠', name: 'Home Services', subcategories: ['Cleaning Supplies', 'Appliance Parts', 'Gardening'], priority: 'High' as const },
  { slug: 'automotive-repair', emoji: '🚗', name: 'Automotive & Repair', subcategories: ['Auto Parts', 'Tyre Shop', 'Car Wash'], priority: 'High' as const },
  { slug: 'construction-renovation', emoji: '🏗️', name: 'Construction & Renovation', subcategories: ['Building Materials', 'Paint & Tiles', 'Sanitary'], priority: 'High' as const },
  { slug: 'security-safety', emoji: '🛡️', name: 'Security & Safety', subcategories: ['CCTV & Locks', 'Fire Safety'], priority: 'Medium' as const },
  { slug: 'professional-services', emoji: '💼', name: 'Professional Services', subcategories: ['Office Supplies'], priority: 'Medium' as const },
  { slug: 'hospitality-events', emoji: '🍽️', name: 'Hospitality & Events', subcategories: ['Catering Supply', 'Event Decor'], priority: 'Low' as const },
  { slug: 'retail-local-shops', emoji: '🛍️', name: 'Retail & Local Shops', subcategories: ['General Store', 'Electronics'], priority: 'Medium' as const },
];

export function buildDemoShops(): any[] {
  const data = [
    ['Dhanmondi Hardware Mart', 'skilled-trades', 'Hardware', 'Dhanmondi', IMG.hardware],
    ['Uttara Auto Parts', 'automotive-repair', 'Automotive', 'Uttara', IMG.autoparts],
    ['Gulshan Building Supply', 'construction-renovation', 'Construction', 'Gulshan', IMG.shop],
    ['Banani Paint House', 'construction-renovation', 'Painting', 'Banani', IMG.shop],
    ['Mirpur Plumbing World', 'skilled-trades', 'Plumbing', 'Mirpur', IMG.plumber],
    ['Mohakhali Repair Center', 'skilled-trades', 'Repair', 'Mohakhali', IMG.shop],
    ['Savar Tools & Co', 'skilled-trades', 'Tools', 'Savar', IMG.hardware],
    ['Chittagong Electricals', 'skilled-trades', 'Electrical', 'Chittagong', IMG.hardware],
    ['Sylhet Garden Store', 'home-services', 'Gardening', 'Sylhet', IMG.shop],
    ['Metro AC Solutions', 'home-services', 'Appliances', 'Dhanmondi', IMG.shop],
    ['City Tyre & Lube', 'automotive-repair', 'Tyres', 'Gulshan', IMG.autoparts],
    ['Secure CCTV Hub', 'security-safety', 'Security', 'Uttara', IMG.shop],
  ];
  return data.map((d, i) => {
    const [name, cat, subcat, loc, banner] = d as [string, string, string, string, string];
    return { id: `shop-${i + 1}`, name, category: cat, subcategory: subcat, location: loc, score: (4.4 + (i % 6) / 10).toFixed(1), products: 12 + (i % 30), banner };
  });
}

export function buildDemoProducts(): any[] {
  const base = [
    ['Cordless Drill 18V', 'skilled-trades', 3200, IMG.hardware],
    ['Brake Pads Set', 'automotive-repair', 1450, IMG.autoparts],
    ['Cement 50kg Bag', 'construction-renovation', 540, IMG.shop],
    ['Exterior Paint 4L', 'construction-renovation', 2100, IMG.shop],
    ['PVC Pipe 1 inch', 'skilled-trades', 180, IMG.plumber],
    ['Socket Wrench Kit', 'skilled-trades', 1850, IMG.hardware],
    ['Engine Oil 4L', 'automotive-repair', 2600, IMG.autoparts],
    ['Tile Adhesive 20kg', 'construction-renovation', 720, IMG.shop],
    ['LED Work Light', 'skilled-trades', 950, IMG.shop],
    ['Paint Roller Set', 'construction-renovation', 420, IMG.shop],
    ['Copper Wire 10m', 'skilled-trades', 650, IMG.hardware],
    ['Car Battery 60Ah', 'automotive-repair', 5200, IMG.autoparts],
    ['Gardening Shears', 'home-services', 350, IMG.shop],
    ['Sanitary Fitting Kit', 'construction-renovation', 890, IMG.plumber],
    ['CCTV Camera 2MP', 'security-safety', 2400, IMG.shop],
    ['Air Filter Set', 'automotive-repair', 600, IMG.autoparts],
    ['Power Tool Combo', 'skilled-trades', 6700, IMG.hardware],
    ['Wall Putty 5kg', 'construction-renovation', 480, IMG.shop],
    ['Door Lock Smart', 'security-safety', 3200, IMG.shop],
    ['Water Pump 1HP', 'skilled-trades', 4500, IMG.plumber],
  ];
  const shops = buildDemoShops();
  const out: any[] = [];
  for (let s = 0; s < shops.length; s++) {
    base.forEach((b, j) => {
      const [name, cat, price, image] = b as [string, string, number, string];
      out.push({
        id: `prod-${s}-${j}`,
        name: s % 2 === 0 ? name : `${name} (${shops[s].subcategory})`,
        shop: shops[s].name,
        category: cat,
        price,
        stock: j % 5 === 0 ? 'Low stock' : 'In stock',
        image,
      });
    });
  }
  return out;
}
