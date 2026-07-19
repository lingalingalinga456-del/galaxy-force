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


## Shop Owner Portal

Galaxy Workforce supports a fourth role, **shop_owner**, for users who sell physical products.

### Registration
1. On /register choose "I want to sell products" — the submit button becomes "Create Shop Owner Account".
2. After sign-up you are routed to /onboarding?role=shop_owner, a 3-step flow:
   - Step 1 Shop Information: shop name, business type, address, city, phone.
   - Step 2 Business Details: years in operation, main product categories (multi-select).
   - Step 3 Preferences: delivery radius (km), minimum order amount, language preference.
3. On finish you land in the Shop Owner Hub (/shop-owner).

### Shop Owner Hub (/shop-owner)
Menu: Overview, My Products, Add Product, Orders, Inventory, Analytics, Inbox, Customers, Settings, Support.
- Overview: shop name, Trust Score, verification status, product/order/revenue stats, recent orders.
- Products: list, add (/shop-owner/products/new), edit (/shop-owner/products/[id]/edit). RLS scopes each shop to its own rows.
- Orders: list + detail (/shop-owner/orders/[id]) with a confirm action.
- Inventory: stock levels with low/out-of-stock indicators.
- Analytics: Trust Score, published products, revenue, products-by-category.
- Customers: distinct clients from orders. Settings: edit shop profile.

### Data model (supabase/migrations/002_shop_owner_portal.sql)
shop_profiles, products, product_media, orders, order_items, inventory_logs.
The user_role enum is extended with 'shop_owner' (no column change needed). RLS: each shop manages only its own rows; published products and verified shops are publicly readable; orders are visible to the shop owner and the ordering client.

### Seeded demo shops (password DemoPass123!)
- shop1@galaxyworkforce.app (Dhaka Auto Parts)
- shop2@galaxyworkforce.app (ElectroMart)
- shop3@galaxyworkforce.app (Hardware Hub)

Seeded data: 3 shops, 13 products (>=4 automotive/spare-parts), and 5 sample orders with items.
Shop products also appear in the public Discover search results when relevant.

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
