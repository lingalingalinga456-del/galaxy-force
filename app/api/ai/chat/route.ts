import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MAX_TOKENS = 1200;
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX_AUTH = 20;
const RATE_LIMIT_MAX_GUEST = 8;

const FULL_SYSTEM_PROMPT = `You are "Galaxy Assistant", an AI helper for Galaxy Workforce, an AI-powered freelance / human-workforce marketplace (focused on Bangladesh, supports English and Bengali).

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

const GUEST_SYSTEM_PROMPT = `You are "Galaxy Assistant", the public AI helper for Galaxy Workforce, an AI-powered freelance / human-workforce marketplace (focused on Bangladesh, supports English and Bengali).

The person chatting with you is NOT logged in (a visitor / public user). You have LIMITED scope:
- You may ONLY answer general questions about Galaxy Workforce: what the platform is, how it works, who it is for (clients vs talents), pricing, FAQs, safety, and how to get started.
- You may explain the public pages they can browse: Home "/", Discover people "/discover", Browse jobs "/jobs", Pricing "/pricing", FAQ, and how to sign up at "/register" or log in at "/login".
- You must NOT give account-specific, step-by-step "how to post a job / send a proposal / manage contracts" walkthroughs that require being logged in.
- If the user asks to do something that needs an account (post a job, hire, apply, manage payments, draft a proposal, etc.), politely explain that this requires signing in, and guide them to "/register" or "/login". Keep it brief and welcoming.

Rules:
- Reply in the same language the user writes (English or Bengali).
- Be friendly, concise, and encouraging. Use simple markdown (short paragraphs, bullet lists).
- Never ask for passwords, OTPs, PINs, or payment credentials.`;

async function checkRateLimit(userId: string, window: number, max: number): Promise<boolean> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('ai_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - window * 1000).toISOString());
  if (error) return true;
  return (count || 0) < max;
}

function clientIp(request: NextRequest): string {
  const fwd = request.headers.get('x-forwarded-for');
  return fwd?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
}

function fallbackMessage(language: 'en' | 'bn', code: string): string {
  if (code === '402') {
    return language === 'bn'
      ? 'AI সেবা চালু করতে OpenRouter-এ ক্রেডিট যোগ করতে হবে।'
      : 'The AI service needs OpenRouter credits (402). Add a payment method to your OpenRouter account.';
  }
  if (code === '404') {
    return language === 'bn'
      ? 'AI মডেলটি খুঁজে পাওয়া যায়নি (৪০৪)। সঠিক মডেল সেট করুন।'
      : 'The configured AI model was not found (404). Set a valid OPENROUTER_MODEL.';
  }
  if (code === '429') {
    return language === 'bn'
      ? 'ফ্রি AI মুহূর্তে ব্যস্ত। কিছুক্ষণ পর আবার চেষ্টা করুন।'
      : 'The free AI is busy right now. Please try again in a moment.';
  }
  return language === 'bn'
    ? 'AI-এর সাড়া দিতে সমস্যা হচ্ছে। দয়া করে আবার চেষ্টা করুন।'
    : 'I had trouble responding. Please try again in a moment.';
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const authed = !!user;

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

  const limiter = authed ? user!.id : `guest:${clientIp(request)}`;
  if (!(await checkRateLimit(limiter, RATE_LIMIT_WINDOW, authed ? RATE_LIMIT_MAX_AUTH : RATE_LIMIT_MAX_GUEST))) {
    return NextResponse.json(
      { error: language === 'bn' ? 'বেশি অনুরোধ। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।' : 'Rate limit exceeded. Please try again shortly.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  let content = '';
  let status: 'success' | 'fallback' = 'success';
  const systemPrompt = authed ? FULL_SYSTEM_PROMPT : GUEST_SYSTEM_PROMPT;

  if (!apiKey) {
    status = 'fallback';
    content = language === 'bn'
      ? 'দুঃখিত, এই মুহূর্তে AI সেবা উপলব্ধ নয়। আপনি ম্যানুয়ালি মেনু থেকে যেকোনো অপশন বেছে নিতে পারেন।'
      : 'Sorry, the AI service is not available right now. You can still browse the site from the menu.';
  } else {
    let lastCode = '';
    let response: Response | null = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Galaxy Workforce Assistant',
          },
          body: JSON.stringify({
            model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free',
            messages: [{ role: 'system', content: systemPrompt }, ...messages],
            max_tokens: MAX_TOKENS,
            temperature: 0.6,
          }),
          signal: AbortSignal.timeout(30000),
        });
        if (response.ok) break;
        if (response.status === 429) {
          lastCode = '429';
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        lastCode = String(response.status);
        break;
      } catch (e: any) {
        lastCode = /OpenRouter (\d+)/.exec(e?.message || '')?.[1] || 'net';
        break;
      }
    }

    if (response?.ok) {
      const data = await response.json();
      content = data.choices?.[0]?.message?.content || '';
    } else {
      status = 'fallback';
      content = fallbackMessage(language, lastCode || 'net');
    }
  }

  if (authed) {
    await supabase.from('ai_logs').insert({
      user_id: user!.id,
      feature: 'chat',
      status,
      prompt_summary: `chat(guest=${!authed}): ${JSON.stringify(messages[messages.length - 1]?.content || '').slice(0, 200)}`,
      tokens_estimate: content.length,
      cost_estimate: 0,
    });
  }

  return NextResponse.json({ success: true, content, mode: status, language, authed });
}

export const config = {
  api: { timeout: 35000 },
};
