import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8').split('\n');
const get = (k) => { const l = env.find(x => x.startsWith(k + '=')); return l ? l.slice(k.length + 1).trim() : ''; };
const url = get('NEXT_PUBLIC_SUPABASE_URL'), key = get('SUPABASE_SERVICE_ROLE_KEY');

const CATS = [
  ['skilled-trades', 'Skilled Trades', 'দক্ষ ট্রেড', '🔧', 'Electricians, plumbers, welders, carpenters', 'দক্ষ কারিগর', 1],
  ['home-services', 'Home Services', 'হোম সার্ভিস', '🧹', 'Cleaning, pest control, laundry, handywork', 'পরিষ্কার ও গৃহসেবা', 2],
  ['automotive', 'Automotive', 'অটোমোবাইল', '🚗', 'Mechanics, brake repair, battery, towing', 'মেকানিক ও গাড়ি সার্ভিস', 3],
  ['construction', 'Construction', 'নির্মাণ', '🏗️', 'Masons, painters, laborers, site work', 'নির্মাণ শ্রমিক', 4],
  ['repair-maintenance', 'Repair & Maintenance', 'মেরামত ও রক্ষণাবেক্ষণ', '🛠️', 'Appliance, AC, electrical repair', 'সার্ভিসিং ও মেরামত', 5],
  ['transportation', 'Transportation', 'পরিবহন', '🚚', 'Truck, moving, delivery, rides', 'পরিবহন ও ডেলিভারি', 6],
  ['security', 'Security', 'নিরাপত্তা', '🛡️', 'Guards, patrol, event security', 'নিরাপত্তা কর্মী', 7],
  ['professional-services', 'Professional Services', 'পেশাগত সেবা', '💼', 'Accountants, lawyers, consultants', 'অ্যাকাউন্ট্যান্ট ও আইন', 8],
  ['education', 'Education', 'শিক্ষা', '📚', 'Tutors, trainers, exam prep', 'টিউটর ও প্রশিক্ষক', 9],
  ['healthcare', 'Healthcare', 'স্বাস্থ্যসেবা', '⚕️', 'Nurses, physiotherapists, caregivers', 'নার্স ও স্বাস্থ্যকর্মী', 10],
  ['digital-services', 'Digital Services', 'ডিজিটাল সেবা', '💻', 'Web, design, writing, marketing', 'ওয়েব ও ডিজিটাল', 11],
  ['business-services', 'Business Services', 'ব্যবসায়িক সেবা', '📊', 'IT companies, agencies, BPO', 'ব্যবসায়িক সেবা', 12],
  ['hospitality', 'Hospitality', 'হোস্পিটালিটি', '🍽️', 'Cooks, caterers, waitstaff', 'রান্না ও হোটেল', 13],
  ['agriculture', 'Agriculture', 'কৃষি', '🌾', 'Farmers, gardeners, livestock', 'কৃষি ও বাগান', 14],
  ['manufacturing', 'Manufacturing', 'উৎপাদন', '🏭', 'Factory work, assembly, machining', 'কারখানা শ্রম', 15],
  ['beauty-wellness', 'Beauty & Wellness', 'বিউটি ও স্বাস্থ্য', '💇', 'Salon, spa, makeup artists', 'স্যালন ও স্পা', 16],
  ['event-services', 'Event Services', 'ইভেন্ট সেবা', '🎉', 'Decorators, photographers, planners', 'ইভেন্ট ও ফটোগ্রাফি', 17],
  ['retail', 'Retail', 'রিটেইল', '🛍️', 'Shop staff, merchandisers', 'দোকান ও রিটেইল', 18],
];

(async () => {
  // Clear existing
  await fetch(url + '/rest/v1/categories?is_active=eq.true', { method: 'DELETE', headers: { 'apikey': key, 'Authorization': 'Bearer ' + key } });
  const rows = CATS.map(([slug, name_en, name_bn, icon, desc_en, desc_bn, sort_order]) => ({
    slug, name_en, name_bn, icon, description_en: desc_en, description_bn: desc_bn,
    job_count: Math.floor(Math.random() * 800) + 120, talent_count: Math.floor(Math.random() * 400) + 40,
    typical_rate_min: 300, typical_rate_max: 1500, currency: 'BDT', is_active: true, sort_order,
  }));
  const res = await fetch(url + '/rest/v1/categories', {
    method: 'POST', headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify(rows),
  });
  const d = await res.json();
  console.log('inserted', d.length, res.status);
})().catch(e => console.error(e.message));
