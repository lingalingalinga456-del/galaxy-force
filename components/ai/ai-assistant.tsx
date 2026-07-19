'use client';

import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Bot, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { callAIChat, callAIFeature, type ChatMessage } from '@/lib/ai-client';

function getLocale(): 'en' | 'bn' {
  if (typeof document === 'undefined') return 'en';
  const m = document.cookie.match(/(?:^|;\s*)locale=(en|bn)/);
  return (m?.[1] as 'en' | 'bn') || 'en';
}

function t(key: string, opts?: { en: string; bn?: string; [k: string]: unknown }): string {
  if (!opts) return key;
  const locale = getLocale();
  let msg = (locale === 'bn' && opts.bn ? opts.bn : opts.en) as string;
  if (opts) {
    for (const [k, v] of Object.entries(opts)) {
      if (k === 'en' || k === 'bn') continue;
      msg = msg.replaceAll(`{${k}}`, String(v));
    }
  }
  return msg;
}

type Role = 'client' | 'talent' | 'admin' | 'guest';

const QUICK_ACTIONS: Record<Role, { label: string; en: string; bn?: string; run: () => void }[]> = {
  client: [
    { label: '💡', en: 'How do I post a job?', bn: 'আমি কীভাবে জব পোস্ট করব?', run: () => {} },
    { label: '📝', en: 'Draft a job brief', bn: 'একটি জব ব্রিফ লিখুন', run: () => {} },
    { label: '✨', en: 'Improve my job description', bn: 'আমার জব বিবরণ উন্নত করুন', run: () => {} },
  ],
  talent: [
    { label: '💡', en: 'How do I find work?', bn: 'আমি কীভাবে কাজ খুঁজে পাব?', run: () => {} },
    { label: '✉️', en: 'Draft a proposal', bn: 'একটি প্রস্তাব লিখুন', run: () => {} },
    { label: '🌟', en: 'Improve my profile headline', bn: 'আমার প্রোফাইল হেডলাইন উন্নত করুন', run: () => {} },
  ],
  admin: [
    { label: '💡', en: 'What can I manage here?', bn: 'আমি এখানে কী ম্যানেজ করতে পারি?', run: () => {} },
    { label: '🛡️', en: 'How does moderation work?', bn: 'মডারেশন কীভাবে কাজ করে?', run: () => {} },
  ],
  guest: [
    { label: '💡', en: 'How does Galaxy Workforce work?', bn: 'গ্যালাক্সি ওয়ার্কফোর্স কীভাবে কাজ করে?', run: () => {} },
    { label: '🔎', en: 'How do I find a freelancer?', bn: 'আমি কীভাবে একজন ফ্রিল্যান্সার খুঁজে পাব?', run: () => {} },
    { label: '🚀', en: 'How do I get started?', bn: 'আমি কীভাবে শুরু করব?', run: () => {} },
  ],
};

const SUGGESTED_PROMPTS: Record<Role, string[]> = {
  client: [
    'Walk me through posting my first job, step by step.',
    'What should I include in a job description to attract good talent?',
    'How do I review proposals and hire someone?',
  ],
  talent: [
    'How do I browse jobs and send a proposal?',
    'Help me write a strong profile headline.',
    'What makes a proposal get noticed?',
  ],
  admin: [
    'Show me how to review users and moderation flags.',
    'Where do I see transactions and the audit log?',
  ],
  guest: [
    'What is Galaxy Workforce and who is it for?',
    'How do I sign up as a client or a talent?',
    'Is it free to browse jobs?',
  ],
};

export function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role>('guest');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<'en' | 'bn'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocale(getLocale());
    (async () => {
      try {
        const res = await fetch('/api/auth/session-role');
        if (res.ok) {
          const data = await res.json();
          if (data.role) setRole(data.role as Role);
        }
      } catch {
        /* guest fallback */
      }
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await callAIChat(next.filter((m) => m.role !== 'system'), locale);
      setMessages([...next, { role: 'assistant', content: res.content }]);
    } catch (e: any) {
      setMessages([
        ...next,
        { role: 'assistant', content: e?.message || 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function runQuick(actionIndex: number) {
    const action = QUICK_ACTIONS[role][actionIndex];
    if (!action) return;
    if (action.en.startsWith('Draft') || action.en.startsWith('Improve')) {
      // Use the feature endpoint for content generation
      setLoading(true);
      const map: Record<string, { feature: string; payload: Record<string, unknown> }> = {
        'Draft a job brief': { feature: 'job_brief', payload: { title: '', description: '', skills: [] } },
        'Improve my job description': { feature: 'job_improve', payload: { description: '' } },
        'Draft a proposal': { feature: 'proposal_draft', payload: { title: '', skills: [] } },
        'Improve my profile headline': { feature: 'profile_optimize', payload: { title: '' } },
      };
      const key = role === 'client' ? action.en : action.en;
      const cfg = map[key];
      if (cfg) {
        const userMsg: ChatMessage = { role: 'user', content: action.en };
        const next = [...messages, userMsg];
        setMessages(next);
        try {
          const res = await callAIFeature(cfg.feature, { ...cfg.payload, language: locale });
          setMessages([...next, { role: 'assistant', content: res.content }]);
        } catch (e: any) {
          setMessages([...next, { role: 'assistant', content: e?.message || 'Failed' }]);
        } finally {
          setLoading(false);
        }
        return;
      }
    }
    // Otherwise treat as a chat question
    await send(action.en);
  }

  const actions = QUICK_ACTIONS[role];
  const suggestions = SUGGESTED_PROMPTS[role];

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open AI Assistant"
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-warm-red px-4 py-3 text-white shadow-card-hover transition-transform hover:scale-105"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">{t('ai.open', { en: 'AI Assistant', bn: 'AI সহকারী' })}</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[560px] max-h-[85vh] w-[380px] max-w-[92vw] flex-col overflow-hidden rounded-2xl border border-warm-border bg-white shadow-card-hover">
          {/* Header */}
          <div className="flex items-center justify-between bg-warm-ink px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-warm-gold" />
              <div>
                <p className="text-sm font-semibold leading-tight">{t('ai.title', { en: 'Galaxy Assistant', bn: 'গ্যালাক্সি সহকারী' })}</p>
                <p className="text-[11px] text-white/60">{t('ai.sub', { en: 'Here to help you navigate', bn: 'নেভিগেট করতে সাহায্য করছে' })}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setLocale((l) => (l === 'en' ? 'bn' : 'en'))}
                title="EN / বাং"
                className="rounded-md px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Languages className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="rounded-md p-1 text-white/70 hover:bg-white/10 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-warm-cream p-4">
            {messages.length === 0 && (
              <div className="rounded-xl bg-white p-4 text-sm text-warm-muted shadow-card">
                <p className="mb-2 font-medium text-warm-ink">{t('ai.hi', { en: 'Hi! I can help you use Galaxy Workforce.', bn: 'হাই! আমি গ্যালাক্সি ওয়ার্কফোর্স ব্যবহারে সাহায্য করতে পারি।' })}</p>
                <p>{t('ai.opt', { en: 'Ask me anything, or tap a quick action below. You can also use the site fully on your own.', bn: 'যেকোনো কিছু জিজ্ঞাসা করুন, অথবা নিচের দ্রুত অপশনে ট্যাপ করুন। আপনি চাইলে ম্যানুয়ালিও সাইট ব্যবহার করতে পারেন।' })}</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm',
                    m.role === 'user' ? 'bg-warm-red text-white' : 'bg-white text-warm-ink shadow-card'
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-xl bg-white px-3 py-2 text-sm text-warm-muted shadow-card">
                  <span className="animate-pulse">…</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 border-t border-warm-border bg-white px-3 py-2">
            {actions.map((a, i) => (
              <button
                key={i}
                disabled={loading}
                onClick={() => runQuick(i)}
                className="rounded-full border border-warm-border px-3 py-1 text-xs text-warm-ink hover:bg-warm-beige disabled:opacity-50"
              >
                {a.label} {locale === 'bn' && a.bn ? a.bn : a.en}
              </button>
            ))}
          </div>

          {/* Suggested prompts */}
          {messages.length === 0 && (
            <div className="space-y-1 border-t border-warm-border bg-white px-3 py-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  disabled={loading}
                  onClick={() => send(s)}
                  className="block w-full truncate rounded-md px-2 py-1 text-left text-xs text-warm-red hover:bg-warm-beige disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-warm-border bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ai.placeholder', { en: 'Ask anything…', bn: 'যেকোনো কিছু জিজ্ঞাসা করুন…' })}
              className="flex-1 rounded-lg border border-warm-border px-3 py-2 text-sm outline-none focus:border-warm-red"
            />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label="Send">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
