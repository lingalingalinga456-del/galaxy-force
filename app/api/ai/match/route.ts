import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';
import { calculateMatchEstimate, getMatchLabel } from '@/lib/match/calculate-match-estimate';
import { getLeadScrapeFallback } from '@/lib/fallback/leadscrape-simulator';

const MIN_TALENT_MATCH = 35;

function extractSkills(text: string): string[] {
  const known = [
    'plumbing', 'plumber', 'electrical', 'electrician', 'carpentry', 'carpenter',
    'painting', 'painter', 'cleaning', 'cleaner', 'moving', 'mover', 'gardening',
    'landscaping', 'welding', 'welder', 'masonry', 'bricklayer', 'ac repair',
    'appliance repair', 'cooking', 'driving', 'delivery', 'tailoring', 'sewing',
    'web development', 'web', 'react', 'next.js', 'node', 'typescript', 'javascript',
    'design', 'ui', 'ux', 'figma', 'prototyping', 'writing', 'copywriting', 'seo', 'blogging',
    'marketing', 'data entry', 'translation', 'research',
  ];
  const lower = text.toLowerCase();
  return known.filter((k) => lower.includes(k));
}

// Token-based overlap: a talent matches if any query skill shares a token with any of its skills.
function hasSkillOverlap(querySkills: string[], talentSkills: string[]): boolean {
  const talentTokens = new Set(
    talentSkills.flatMap((s) => s.toLowerCase().split(/[\s./-]+/)).filter(Boolean)
  );
  return querySkills.some((qs) => {
    const qt = qs.toLowerCase().split(/[\s./-]+/).filter(Boolean);
    return qt.some((tok) => talentTokens.has(tok));
  });
}

function extractLocation(text: string): string {
  const cities = ['dhaka', 'gulshan', 'banani', 'uttara', 'dhanmondi', 'mirpur', 'mohakhali', 'tejgaon', 'bashundhara', 'keraniganj', 'chittagong', 'sylhet', 'khulna', 'rajshahi'];
  const lower = text.toLowerCase();
  const found = cities.find((c) => lower.includes(c));
  return found ? found.charAt(0).toUpperCase() + found.slice(1) : 'Dhaka';
}

export async function POST(request: NextRequest) {
  const supabase = createServiceClient();

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const query: string = (body?.query || '').toString().trim();
  const language: 'en' | 'bn' = body?.language === 'bn' ? 'bn' : 'en';
  if (!query) {
    return NextResponse.json({ error: 'Empty request' }, { status: 400 });
  }

  const skillHints = extractSkills(query);
  const location = extractLocation(query);

  // 1. Human workers (Talent) — PRIMARY
  let talentMatches: any[] = [];
  try {
    const { data } = await supabase
      .from('talent_profiles')
      .select('id, headline, skills, hourly_rate, availability, completion_score, profiles!inner(id, full_name, username, status, is_verified, avatar_url, country)')
      .eq('profiles.status', 'active')
      .eq('profiles.profile_visibility', 'public');
    const talents = (data || []).map((t: any) => ({
      id: t.id,
      fullName: t.profiles.full_name,
      username: t.profiles.username,
      verified: t.profiles.is_verified,
      headline: t.headline,
      skills: t.skills || [],
      hourlyRate: Number(t.hourly_rate || 0),
      availability: t.availability || 'available',
      completedContracts: Number(t.completion_score || 0),
      rating: 0,
      country: t.profiles.country,
    }));

    talentMatches = talents
      .map((t) => {
        const est = calculateMatchEstimate(t, {
          skillsRequired: skillHints.length ? skillHints : t.skills,
          budgetMax: 0,
          budgetType: 'hourly',
        });
        const skillMatch = skillHints.length
          ? hasSkillOverlap(skillHints, t.skills || [])
          : true;
        return { ...t, matchScore: est.score, label: getMatchLabel(est.score, language), skillMatch };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  } catch (e) {
    console.error('Talent match fetch failed', e);
  }

  const bestTalent = talentMatches[0]?.matchScore || 0;
  const bestHasSkillMatch = talentMatches[0]?.skillMatch === true;
  // When the request names a specific skill/trade, a real match requires that skill overlap.
  // Otherwise fallback to LeadScrape Pro (PRD §5.3 / §5.4).
  const showTalent = bestTalent >= MIN_TALENT_MATCH && (!skillHints.length || bestHasSkillMatch);

  // 2. Shop products — SECONDARY (only when relevant)
  let products: any[] = [];
  try {
    const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const orParts = words
      .flatMap((w) => [`name.ilike.%${w}%`, `category.ilike.%${w}%`, `description.ilike.%${w}%`])
      .slice(0, 18)
      .join(',');
    if (orParts) {
      const { data: prods } = await supabase
        .from('products')
        .select('id, name, description, category, price, shop_profiles(shop_name, city)')
        .eq('status', 'published')
        .or(orParts)
        .limit(6);
      products = (prods || []).map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category,
        price: Number(p.price || 0),
        shopName: p.shop_profiles?.shop_name,
        city: p.shop_profiles?.city,
      }));
    }
  } catch (e) {
    console.error('Product fetch failed', e);
  }

  // 3. LeadScrape Pro fallback — only when HR matching fails
  let fallback: any[] = [];
  if (!showTalent && talentMatches.length > 0) {
    fallback = getLeadScrapeFallback(query, location);
  }

  return NextResponse.json({
    success: true,
    query,
    language,
    location,
    talent: showTalent ? talentMatches.slice(0, 6) : [],
    products: products.slice(0, 6),
    fallback,
    fallbackTriggered: fallback.length > 0,
    summary: {
      talentCount: showTalent ? talentMatches.length : 0,
      productCount: products.length,
      fallbackCount: fallback.length,
    },
  });
}
