'use client';

export type AIResult = {
  success: boolean;
  content: string;
  mode?: 'success' | 'fallback';
  language?: string;
};

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export async function callAIFeature(
  feature: string,
  payload: Record<string, unknown>
): Promise<AIResult> {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ feature, payload }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'AI request failed');
  }
  return res.json();
}

export async function callAIChat(
  messages: ChatMessage[],
  language: 'en' | 'bn'
): Promise<AIResult> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, language }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'AI chat failed');
  }
  return res.json();
}
