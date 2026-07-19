'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, X, Loader2, User, Package, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/client';

type TalentHit = {
  id: string;
  fullName: string;
  username?: string;
  headline?: string;
  skills: string[];
  hourlyRate: number;
  matchScore: number;
  label: string;
  verified?: boolean;
};
type ProductHit = { id: string; name: string; price: number; shopName?: string; category?: string };
type FallbackHit = { id: string; name: string; category: string; location: string; rating: number; contact: string };

export function AiRequestBar() {
  const { t, locale } = useTranslation();
  const lang: 'en' | 'bn' = locale === 'bn' ? 'bn' : 'en';
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    talent: TalentHit[];
    products: ProductHit[];
    fallback: FallbackHit[];
    fallbackTriggered: boolean;
    location: string;
  } | null>(null);

  async function runMatch() {
    if (!query.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language: lang }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ talent: [], products: [], fallback: [], fallbackTriggered: false, location: '' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group w-full max-w-2xl mx-auto flex items-center gap-3 rounded-card border border-warm-border bg-white px-5 py-4 text-left shadow-card transition-all hover:shadow-card-hover"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-warm-red/10 text-warm-red">
          <Sparkles className="h-5 w-5" />
        </span>
        <span className="flex-1 text-warm-muted">
          {t('aiRequestPlaceholder', { en: 'Describe what you need in English or বাংলা…', bn: 'আপনার প্রয়োজন ইংরেজি বা বাংলায় লিখুন…' })}
        </span>
        <span className="rounded-full bg-warm-red px-4 py-1.5 text-sm font-medium text-white">
          {t('aiAsk', { en: 'Ask AI', bn: 'AI-কে জিজ্ঞাসা' })}
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-card bg-warm-cream shadow-card-hover"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-warm-border bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-warm-red" />
                <h2 className="font-semibold text-warm-ink">
                  {t('aiMatchTitle', { en: 'Galaxy AI — Find the right person', bn: 'গ্যালাক্সি AI — সঠিক লোক খুঁজুন' })}
                </h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-warm-muted hover:text-warm-ink">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-warm-border bg-white px-5 py-4">
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runMatch()}
                  placeholder={t('aiRequestPlaceholder', { en: 'Describe what you need in English or বাংলা…', bn: 'আপনার প্রয়োজন ইংরেজি বা বাংলায় লিখুন…' })}
                  className="flex-1 rounded-card-sm border border-warm-border bg-warm-cream px-4 py-2.5 text-sm text-warm-ink outline-none focus:border-warm-red"
                />
                <button
                  onClick={runMatch}
                  disabled={loading}
                  className="rounded-card-sm bg-warm-red px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('aiAsk', { en: 'Ask', bn: 'জিজ্ঞাসা' })}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {!result && !loading && (
                <p className="text-center text-sm text-warm-muted">
                  {t('aiMatchHint', { en: 'e.g. "Need a plumber in Gulshan for AC repair"', bn: 'যেমন: "গুলশানে এসি মেরামতের জন্য একজন প্লাম্বার দরকার"' })}
                </p>
              )}
              {loading && <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-warm-red" /></div>}

              {result && (
                <>
                  {result.talent.length > 0 && (
                    <section>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-warm-ink">
                        <User className="h-4 w-4 text-warm-red" />
                        {t('aiTalentMatches', { en: `Human workers (${result.talent.length})`, bn: `মানুষের শ্রমিক (${result.talent.length})` })}
                      </h3>
                      <div className="space-y-3">
                        {result.talent.map((tal) => (
                          <div key={tal.id} className="rounded-card-sm border border-warm-border bg-white p-4 shadow-card">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-warm-ink">{tal.fullName}{tal.verified && <span className="ml-1 text-warm-green">✓</span>}</div>
                                <div className="text-sm text-warm-muted">{tal.headline}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-semibold text-warm-red">{tal.matchScore}% · {tal.label}</div>
                                {tal.hourlyRate > 0 && <div className="text-xs text-warm-muted">৳{tal.hourlyRate}/hr</div>}
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {tal.skills.slice(0, 4).map((s) => (
                                <span key={s} className="rounded-full bg-warm-cream px-2 py-0.5 text-xs text-warm-muted">{s}</span>
                              ))}
                            </div>
                            <button
                              onClick={() => router.push(tal.username ? `/talent/${tal.username}` : '/discover')}
                              className="mt-3 text-sm font-medium text-warm-red hover:underline"
                            >
                              {t('aiViewProfile', { en: 'View profile →', bn: 'প্রোফাইল দেখুন →' })}
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {result.products.length > 0 && (
                    <section>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-warm-ink">
                        <Package className="h-4 w-4 text-warm-gold" />
                        {t('aiProductMatches', { en: `Shop products (${result.products.length})`, bn: `দোকানের পণ্য (${result.products.length})` })}
                      </h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {result.products.map((p) => (
                          <div key={p.id} className="rounded-card-sm border border-warm-border bg-white p-4 shadow-card">
                            <div className="font-medium text-warm-ink">{p.name}</div>
                            <div className="text-xs text-warm-muted">{p.shopName} · {p.category}</div>
                            <div className="mt-1 font-semibold text-warm-gold">৳{p.price.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {result.fallbackTriggered && result.fallback.length > 0 && (
                    <section>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold text-warm-ink">
                        <ExternalLink className="h-4 w-4 text-warm-muted" />
                        {t('aiExternal', { en: 'External Recommendation — Not on Galaxy Workforce', bn: 'বাহ্যিক সুপারিশ — গ্যালাক্সি ওয়ার্কফোর্সে নয়' })}
                      </h3>
                      <div className="space-y-2">
                        {result.fallback.map((f) => (
                          <div key={f.id} className="rounded-card-sm border border-dashed border-warm-border bg-white/60 p-3 text-sm">
                            <div className="font-medium text-warm-ink">{f.name}</div>
                            <div className="text-warm-muted">{f.category} · {f.location} · ★ {f.rating}</div>
                            <div className="text-warm-muted">{f.contact}</div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-warm-muted">
                        {t('aiExternalNote', { en: 'Provided by LeadScrape Pro (simulated). These are not Galaxy Workforce members.', bn: 'লিডস্ক্রেপ প্রো (সিমুলেটেড) দ্বারা সরবরাহিত। এরা গ্যালাক্সি ওয়ার্কফোর্সের সদস্য নয়।' })}
                      </p>
                    </section>
                  )}

                  {result.talent.length === 0 && result.products.length === 0 && !result.fallbackTriggered && (
                    <p className="text-center text-sm text-warm-muted">
                      {t('aiNoResult', { en: 'No matches yet. Try describing the work in more detail.', bn: 'এখনও কোনো ম্যাচ নেই। আরও বিস্তারিত লিখুন।' })}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
