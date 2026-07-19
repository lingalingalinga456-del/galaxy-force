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

// §6 AI understanding expansion
function detectUrgency(text: string): 'emergency' | 'urgent' | 'normal' {
  const l = text.toLowerCase();
  if (/\b(emergency|asap|urgent|immediately|now|breakdown|leak|no power)\b/.test(l)) return 'emergency';
  if (/\b(soon|today|tomorrow|quick|fast)\b/.test(l)) return 'urgent';
  return 'normal';
}

function detectIndoorOutdoor(text: string): 'indoor' | 'outdoor' | 'unknown' {
  const l = text.toLowerCase();
  if (/\b(home|house|office|indoor|room|apartment|flat|inside)\b/.test(l)) return 'indoor';
  if (/\b(road|outdoor|garden|construction|site|field|outside|roof)\b/.test(l)) return 'outdoor';
  return 'unknown';
}

function detectWorkerCount(text: string): number {
  const m = text.toLowerCase().match(/(\d+)\s*(workers?|people|persons?|team|helpers?)/);
  if (m) return parseInt(m[1], 10);
  if (/\bteam\b/.test(text.toLowerCase())) return 3;
  return 1;
}

function detectMaterialsRequired(text: string): boolean {
  const l = text.toLowerCase();
  return /\b(material|parts?|supply|equipment|tool|pad|paint|wire|cable|brake|oil|battery|provide materials|need materials|with materials)\b/.test(l);
}

function buildExplanation(t: any, location: string, urgency: string): string {
  const reasons: string[] = [];
  if (t.distanceKm !== undefined) reasons.push(`Within ${t.distanceKm} km of ${location}`);
  if (t.availableNow) reasons.push('Available now');
  if (t.completedContracts > 0) reasons.push(`Completed ${t.completedContracts} jobs`);
  if (t.verified) reasons.push('Identity verified');
  if (urgency === 'emergency' && t.emergencyAvailable) reasons.push('Offers emergency service');
  if (t.skills?.length) reasons.push(`Specializes in ${t.skills.slice(0, 2).join(', ')}`);
  return reasons.length ? `Recommended because: ${reasons.join(' · ')}` : 'Recommended match for your request.';
}

function estimateCost(best: any | null, workerCount: number, materialsRequired: boolean): any {
  if (!best || !best.hourlyRate) {
    return { labor: 0, materials: materialsRequired ? 'quote' : 0, travel: 0, platformFee: 0, total: 0, confidence: 'low' };
  }
  const estHours = 2 * workerCount;
  const labor = Math.round(best.hourlyRate * estHours * workerCount);
  const travel = Math.round((best.maxTravelKm || 10) * 15);
  const platformFee = Math.round(labor * 0.05);
  const materials = materialsRequired ? 'quote' : 0;
  const total = labor + travel + platformFee + (typeof materials === 'number' ? materials : 0);
  return {
    labor,
    materials,
    travel,
    platformFee,
    total,
    confidence: best.matchScore >= 60 ? 'high' : best.matchScore >= 40 ? 'medium' : 'low',
  };
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

  // §6/§14/§15 AI understanding + explanation + cost estimate
  const urgency = detectUrgency(query);
  const indoorOutdoor = detectIndoorOutdoor(query);
  const workerCount = detectWorkerCount(query);
  const materialsRequired = detectMaterialsRequired(query);
  const best = showTalent ? talentMatches[0] : null;
  const explanation = best ? buildExplanation(best, location, urgency) : null;
  const costEstimate = estimateCost(best, workerCount, materialsRequired);

  // §10 Material management — who provides materials
  const materialProvider: 'client' | 'worker' | 'shop_owner' | 'split' = materialsRequired
    ? (/\b(shop|store|buy|purchase)\b/.test(query.toLowerCase()) ? 'shop_owner' : /\b(split|share)\b/.test(query.toLowerCase()) ? 'split' : 'worker')
    : 'client';

  // 3. LeadScrape Pro fallback — only when HR matching fails (§7 priority order)
  let fallback: any[] = [];
  if (!showTalent && talentMatches.length > 0) {
    fallback = getLeadScrapeFallback(query, location);
  }

  return NextResponse.json({
    success: true,
    query,
    language,
    location,
    understanding: {
      urgency,
      indoorOutdoor,
      workerCount,
      materialsRequired,
      materialProvider,
      preferredLanguage: language,
    },
    explanation,
    costEstimate,
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
