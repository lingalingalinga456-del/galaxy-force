import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MAX_TOKENS = 1200;
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 20;

const SYSTEM_PROMPT = `You are "Galaxy Assistant", an AI helper for Galaxy Workforce, an AI-powered freelance / human-workforce marketplace (focused on Bangladesh, supports English and Bengali).

Your job is to help users (clients who hire, and talents/freelancers who work) use the website more easily. You do two things well:
1. Simplify what the user needs in plain language.
2. Tell them exactly which menu/button to click and which page to open, step by step.

Site map you must reference precisely:
- Home: "/"  (login / get started / language switch EN|BN)
- Client portal "/client": Overview, My Jobs "/client/jobs", Post a Job "/client/jobs/new", Contracts "/client/contracts", Inbox "/client/inbox", Payments "/client/payments", Analytics "/client/analytics", Saved Talent "/client/saved", Discover Talent "/client/talent", Settings "/client/settings".
- Talent portal "/talent-dashboard": Overview, Proposals "/talent-dashboard/proposals", Contracts "/talent-dashboard/contracts", Inbox "/talent-dashboard/inbox", Earnings "/talent-dashboard/earnings", Portfolio "/talent-dashboard/portfolio", Profile "/talent-dashboard/profile", Settings "/talent-dashboard/settings".
- Public browsing: Discover people "/discover", Browse jobs "/jobs", Job detail "/jobs/[id]", Pricing "/pricing", Talent profiles "/talent/[username]".
- Auth: Login "/login", Register "/register", Onboarding "/onboarding".

Rules:
- Reply in the same language the user writes (English or Bengali). Keep responses concise and scannable.
- Always phrase guidance as concrete clicks: e.g. "Open the client menu on the left, click 'Post a Job', then fill the title and budget."
- If the user asks for content (job brief, proposal, profile headline), produce a ready-to-use draft.
- Never ask for passwords, OTPs, PINs, or payment credentials. Payments are sandbox/demo only.
- Be friendly and encouraging. If unsure, point them to the relevant page from the site map.
- Use simple markdown (short paragraphs, bullet lists). Do not use headings larger than needed.`;

async function checkRateLimit(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('ai_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - RATE_LIMIT_WINDOW * 1000).toISOString());
  if (error) return true;
  return (count || 0) < RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const language: 'en' | 'bn' = body?.language === 'bn' ? 'bn' : 'en';

  if (!messages.length) {
    return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
  }

  if (!(await checkRateLimit(user.id))) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please try again shortly.' }, { status: 429 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  let content = '';
  let status: 'success' | 'fallback' = 'success';

  if (!apiKey) {
    status = 'fallback';
    content = language === 'bn'
      ? 'দুঃখিত, এই মুহূর্তে AI সেবা উপলব্ধ নয়। আপনি ম্যানুয়ালি বাম পাশের মেনু থেকে যেকোনো অপশন বেছে নিতে পারেন।'
      : 'Sorry, the AI service is not available right now. You can still use the site manually from the menu on the left.';
  } else {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Galaxy Workforce Assistant',
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          max_tokens: MAX_TOKENS,
          temperature: 0.6,
        }),
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`OpenRouter ${response.status}`);
      const data = await response.json();
      content = data.choices?.[0]?.message?.content || '';
    } catch {
      status = 'fallback';
      content = language === 'bn'
        ? 'AI-এর সাড়া দিতে সমস্যা হচ্ছে। দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন, অথবা মেনু থেকে ম্যানুয়ালি কাজ করুন।'
        : 'I had trouble responding. Please try again in a moment, or use the menu manually.';
    }
  }

  await supabase.from('ai_logs').insert({
    user_id: user.id,
    feature: 'chat',
    status,
    prompt_summary: `chat: ${JSON.stringify(messages[messages.length - 1]?.content || '').slice(0, 200)}`,
    tokens_estimate: content.length,
    cost_estimate: 0,
  });

  return NextResponse.json({ success: true, content, mode: status, language });
}

export const config = {
  api: { timeout: 35000 },
};
