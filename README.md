# Galaxy Workforce

AI-powered human workforce marketplace built for Bangladesh and the wider region.
Connect businesses with skilled freelancers, helpers, and remote workers — with AI-assisted
matching, secure milestone-based contracts, and sandbox local payments.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (strict)
- **Backend / DB:** Supabase (Postgres + Auth + Realtime), `@supabase/ssr`
- **Styling:** Tailwind CSS (warm theme) — see `tailwind.config.js` + `app/styles.css`
- **AI:** OpenRouter (server-only key) for job briefs, proposals, profile optimization
- **Payments:** Sandbox only (bKash / Nagad / SSLCommerz) — no real funds move
- **i18n:** English + বাংলা (BN) with a lightweight `t(key, { en, bn })` helper

## Project Structure

```
app/
  (marketing)/        Marketing pages: /discover, /jobs, /pricing, /about, /faq, /legal/*
  (auth)/             Auth: /login, /register, /onboarding, /forgot-password
  (client)/client/*   Client workspace: jobs, contracts, inbox, payments, analytics, settings, saved, talent
  (talent)/talent-dashboard/*  Talent studio: profile, proposals, contracts, inbox, earnings, portfolio, settings
  (admin)/admin/*     Admin console: overview, users, moderation, transactions, audit, settings
  api/                Route handlers (auth, ai, jobs, proposals, contracts, messages, payments/sandbox)
components/
  ui/                 Shared UI primitives (Button, Card, Input, Badge, ...)
  marketing/          Marketing shell (header/footer)
  workspace/          Sidebar navs for client / talent / admin
lib/
  supabase/           Browser + server + service-role clients
  i18n/               Server + client translation factories
  validations/        Zod schemas
  payments/           Payment adapter (sandbox)
  utils.ts            cn() and helpers
supabase/migrations/  Database schema (001) + signup trigger (002)
scripts/seed.mjs      Seeds categories + demo users/talents/jobs
```

## Prerequisites

- Node.js 18+
- A Supabase project (URL + anon key + service-role key)
- An OpenRouter API key (optional — AI falls back to templates if absent)

## Environment

Create `.env.local` (or `.env`):

```
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
OPENROUTER_API_KEY=<openrouter-key>
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Setup

```bash
npm install
# 1. Apply the database schema (via Supabase CLI or copy 001 + 002 into the SQL editor)
# 2. Seed demo data
node scripts/seed.mjs
# 3. Run
npm run dev        # development
npm run build && npm run start   # production
```

## Demo Accounts

| Role   | Email                          | Password      |
|--------|--------------------------------|---------------|
| Admin  | admin@galaxyworkforce.app      | DemoPass123!  |
| Client | client@galaxyworkforce.app     | DemoPass123!  |
| Talent | talent@galaxyworkforce.app     | DemoPass123!  |

Additional seeded talent logins use `<username>@galaxyworkforce.app` with the same password
(e.g. `nadia_khan@galaxyworkforce.app`). See `DEMO_ACCOUNTS.md` for the full list.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `node scripts/seed.mjs` — seed categories + demo users/talents/jobs

## Notes

- All status / role mutations happen server-side; client never sets `status`/`role` directly (RLS enforced).
- Payments are sandbox-only: demo account numbers and auth codes accept any test value. No real funds move.
- Fonts use system stacks (CSS variables) to avoid build-time network fetches.
