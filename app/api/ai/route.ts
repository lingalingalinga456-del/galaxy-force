import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { aiRequestSchema } from '@/lib/validations';

const MAX_TOKENS = 2000;
const RATE_LIMIT_WINDOW = 60;
const RATE_LIMIT_MAX = 10;

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

async function callOpenRouter(
  feature: string,
  payload: Record<string, unknown>,
  language: string
): Promise<{ content: string; tokens: number }> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const prompts: Record<string, string> = {
    job_brief: `Write a concise job brief based on the following information. Language: ${language}
Title: ${payload.title || 'N/A'}
Description: ${payload.description || 'N/A'}
Skills: ${(payload.skills as string[])?.join(', ') || 'N/A'}

Job brief:`,
    job_improve: `Improve this job description to be more attractive to freelancers. Language: ${language}
Original: ${payload.description || 'N/A'}

Improved version:`,
    proposal_draft: `Write a professional proposal cover letter for this job. Language: ${language}
Job title: ${payload.title || 'N/A'}
Skills: ${(payload.skills as string[])?.join(', ') || 'N/A'}

Proposal:`,
    profile_optimize: `Improve this profile headline to be more attractive to clients. Language: ${language}
Current: ${payload.title || 'N/A'}

Improved version:`,
    career_tip: `Give a career tip for a freelancer in the ${payload.title || 'general'} field. Language: ${language}

Tip:`,
    contract_summary: `Write a brief contract summary. Language: ${language}
Title: ${payload.title || 'N/A'}

Summary:`,
  };

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      'X-Force-Tokens': '0',
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || 'openai/gpt-oss-20b:free',
      messages: [
        { role: 'system', content: 'You are a helpful assistant for a freelance marketplace.' },
        { role: 'user', content: prompts[feature] || prompts.job_brief },
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const data = await response.json();
  const tokensUsed = data.usage?.total_tokens || MAX_TOKENS;

  return {
    content: data.choices?.[0]?.message?.content || '',
    tokens: tokensUsed,
  };
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = aiRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.errors }, { status: 400 });
  }

  const { feature, payload } = parsed.data;
  const userId = user.id;

  if (!(await checkRateLimit(userId))) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const language = payload.language || 'en';
  let result: { content: string; tokens: number };
  let status: 'success' | 'error' | 'fallback' = 'success';

  try {
    result = await callOpenRouter(feature, payload, language);
  } catch {
    console.error('AI request failed');
    result = {
      content: `## ${feature.replace('_', ' ').toUpperCase()} DRAFT\n\nThis is a sample ${feature.replace('_', ' ')} for your reference.\n\n---\n\n*Note: AI service unavailable. This is a template to guide your work.*`,
      tokens: 100,
    };
    status = 'fallback';
  }

  await supabase.from('ai_logs').insert({
    user_id: userId,
    feature,
    status,
    prompt_summary: `${feature}: ${JSON.stringify(payload).slice(0, 200)}...`,
    tokens_estimate: result.tokens,
    cost_estimate: result.tokens * 0.00001,
  });

  return NextResponse.json({
    success: true,
    feature,
    content: result.content,
    tokens: result.tokens,
    mode: status,
    language,
  });
}

export const config = {
  api: {
    timeout: 35000,
  },
};
