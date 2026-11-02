// Seed script: run with `node scripts/seed.mjs`.
// Uses service role key (bypasses RLS) to create demo users + reference data.
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load .env.local if env vars are not already present
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    for (const line of env.split('\n')) {
      const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
    }
  } catch {}
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

const categories = [
  ['Web Development', 'ওয়েব ডেভেলপমেন্ট', 'web-development', 'Code', 500, 5000, 1],
  ['Mobile Development', 'মোবাইল ডেভেলপমেন্ট', 'mobile-development', 'Smartphone', 800, 8000, 2],
  ['UI/UX Design', 'ইউআই/ইউএক্স ডিজাইন', 'ui-ux-design', 'Palette', 400, 4000, 3],
  ['Graphic Design', 'গ্রাফিক ডিজাইন', 'graphic-design', 'Image', 300, 3000, 4],
  ['Digital Marketing', 'ডিজিটাল মার্কেটিং', 'digital-marketing', 'TrendingUp', 400, 4000, 5],
  ['Content Writing', 'কনটেন্ট রাইটিং', 'content-writing', 'FileText', 200, 2000, 6],
  ['Video & Animation', 'ভিডিও এবং অ্যানিমেশন', 'video-animation', 'Video', 600, 6000, 7],
  ['Data Entry', 'ডেটা এন্ট্রি', 'data-entry', 'Database', 150, 1000, 8],
  ['Virtual Assistant', 'ভার্চুয়াল অ্যাসিস্টেন্ট', 'virtual-assistant', 'UserCog', 200, 1500, 9],
  ['Translation', 'অনুবাদ', 'translation', 'Languages', 300, 2500, 10],
];

const demoUsers = [
  { email: 'admin@galaxyworkforce.app', password: 'DemoPass123!', role: 'admin', fullName: 'Galaxy Admin', username: 'galaxy_admin' },
  { email: 'client@galaxyworkforce.app', password: 'DemoPass123!', role: 'client', fullName: 'Ayesha Rahman', username: 'ayesha_client' },
  { email: 'talent@galaxyworkforce.app', password: 'DemoPass123!', role: 'talent', fullName: 'Rakib Hassan', username: 'rakib_talent' },
];

const talents = [
  ['Nadia Khan', 'nadia_khan', 'Full-stack developer & React specialist', ['React', 'Next.js', 'Node.js', 'TypeScript'], 1200, 'available'],
  ['Imran Ali', 'imran_ali', 'UI/UX designer crafting clean experiences', ['Figma', 'UI/UX', 'Prototyping', 'Design Systems'], 900, 'available'],
  ['Sara Begum', 'sara_begum', 'Content writer & SEO specialist', ['SEO', 'Copywriting', 'Blogging', 'Research'], 600, 'busy'],
  ['Tanvir Ahmed', 'tanvir_ahmed', 'Mobile app developer (Flutter)', ['Flutter', 'Dart', 'Firebase', 'Mobile'], 1000, 'available'],
  ['Farhana Islam', 'farhana_islam', 'Motion graphics & video editor', ['After Effects', 'Premiere Pro', 'Animation'], 800, 'available'],
  ['Rahim Uddin', 'rahim_uddin', 'Backend engineer & API builder', ['Python', 'Django', 'PostgreSQL', 'API'], 1100, 'busy'],
  ['Lamia Sultana', 'lamia_sultana', 'Brand & graphic designer', ['Illustrator', 'Branding', 'Logo Design'], 700, 'available'],
  ['Sajid Mia', 'sajid_mia', 'Data entry & virtual assistant', ['Excel', 'Data Entry', 'Research'], 400, 'available'],
  ['Arefin Joy', 'arefin_joy', 'Digital marketer & growth hacker', ['Facebook Ads', 'Google Ads', 'Analytics'], 850, 'available'],
  ['Porimol Das', 'porimol_das', 'Translator EN<->BN', ['Translation', 'Bengali', 'English', 'Proofreading'], 500, 'available'],
];

async function main() {
  // 1. Categories
  for (const [name_en, name_bn, slug, icon, min, max, sort] of categories) {
    await supabase.from('categories').upsert({ name_en, name_bn, slug, icon, typical_rate_min: min, typical_rate_max: max, currency: 'BDT', sort_order: sort, is_active: true }, { onConflict: 'slug' });
  }
  console.log('Categories seeded');

  // 2. Demo users via Admin API (creates auth.users + profiles row)
  for (const u of demoUsers) {
    let uid = null;
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.fullName, username: u.username, role: u.role },
    });
    if (data?.user?.id) {
      uid = data.user.id;
    } else if (error && error.message.includes('already')) {
      // user exists — look up the id
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = (list?.users || []).find((x) => x.email === u.email);
      uid = existing?.id || null;
    }
    if (!uid) {
      console.error('Could not resolve user', u.email, error && error.message);
      continue;
    }
    const { error: pe } = await supabase.from('profiles').upsert({ id: uid, full_name: u.fullName, username: u.username, role: u.role, is_verified: true, profile_visibility: 'public' });
    if (pe) console.error('profile upsert err', u.email, pe.message);
    if (u.role === 'client') {
      await supabase.from('client_profiles').upsert({ id: uid, organization_name: 'Demo Business Ltd', business_type: 'Agency', country: 'Bangladesh' });
    }
  }
  console.log('Demo users seeded');

  // 3. Talent profiles (create auth users too)
  const catRows = await supabase.from('categories').select('id, slug');
  const catBySlug = Object.fromEntries((catRows.data || []).map(c => [c.slug, c.id]));

  for (const [name, username, headline, skills, rate, availability] of talents) {
    const email = `${username}@galaxyworkforce.app`;
    let uid = null;
    const { data, error } = await supabase.auth.admin.createUser({
      email, password: 'DemoPass123!', email_confirm: true,
      user_metadata: { full_name: name, username, role: 'talent' },
    });
    if (data?.user?.id) {
      uid = data.user.id;
    } else if (error && error.message.includes('already')) {
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = (list?.users || []).find((x) => x.email === email);
      uid = existing?.id || null;
    }
    if (!uid) { console.error('talent err', email, error && error.message); continue; }
    const { error: pe } = await supabase.from('profiles').upsert({ id: uid, full_name: name, username, role: 'talent', is_verified: true, profile_visibility: 'public' });
    if (pe) console.error('profile upsert err', email, pe.message);
    const { error: te } = await supabase.from('talent_profiles').upsert({
      id: uid, headline, skills, hourly_rate: rate, availability,
      experience_level: 'intermediate', completion_score: 100,
      bio: `${headline}. Experienced professional ready to help with your projects.`,
    });
    if (te) console.error('talent_profile upsert err', email, te.message);
  }
  console.log('Talents seeded');

  // 4. A couple of open jobs owned by the demo client
  const { data: clientProfile } = await supabase.from('profiles').select('id').eq('username', 'ayesha_client').single();
  if (clientProfile) {
    const webCat = catBySlug['web-development'];
    const { error: je1 } = await supabase.from('jobs').upsert({
      owner_id: clientProfile.id, title: 'Build a marketing website with Next.js',
      description: 'We need a modern, responsive marketing website built with Next.js and Tailwind CSS. Must include blog, contact form, and CMS-friendly content.',
      category_id: webCat, skills: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
      budget_type: 'fixed', budget_min: 60000, budget_max: 80000, experience_level: 'intermediate',
      status: 'open', moderation_state: 'approved', visibility: 'public', published_at: new Date().toISOString(),
    });
    if (je1) console.error('job1 err', je1.message);
    const designCat = catBySlug['ui-ux-design'];
    const { error: je2 } = await supabase.from('jobs').upsert({
      owner_id: clientProfile.id, title: 'Redesign mobile app UI',
      description: 'Looking for a UI/UX designer to redesign our food-delivery app screens with a fresh, clean look.',
      category_id: designCat, skills: ['Figma', 'UI/UX', 'Mobile'],
      budget_type: 'hourly', budget_max: 1200, experience_level: 'intermediate',
      status: 'open', moderation_state: 'approved', visibility: 'public', published_at: new Date().toISOString(),
    });
    if (je2) console.error('job2 err', je2.message);
    console.log('Jobs seeded');
  } else {
    console.error('Client profile not found for jobs');
  }

  console.log('Seed complete.');
}

main().catch(e => { console.error(e); process.exit(1); });
