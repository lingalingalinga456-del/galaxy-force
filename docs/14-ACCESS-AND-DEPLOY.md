# docs/14-ACCESS-AND-DEPLOY.md
# Galaxy Workforce — Access & Deploy Reference
# Updated: 2026-11-02

## GITHUB
- **Repo URL:** https://github.com/lingalingalinga456-del/galaxy-force
- **Default branch:** main
- **Work on:** feat/*, fix/*, polish/* branches
- **Commit format:** `type(scope): message` — types: feat|fix|polish|refactor|docs|chore
- **NEVER run `git push`** unless explicitly told to "push it"
- **Always show:** `git status --short` and `git diff --stat` before committing
- **Never commit:** .env.local, .env, .vercel/
- **If a key leaks:** Report CRITICAL immediately — rotate in Supabase/OpenRouter dashboard

## VERCEL
- **Project:** galaxy-workforce
- **Production URL:** https://galaxy-workforce.vercel.app
- **Alt domain:** https://galaxy-workforce-114oc6ao9-galaxy-force.vercel.app
- **GitHub app:** Connected (push to main = automatic production deploy, PR = preview deploy)
- **NEVER run `vercel --prod`** unless explicitly asked — prefer `git push`
- **Node.js:** 20.x
- **Build command:** `next build`
- **Root directory:** repo root
- **Last deploy:** commit 0e95873 "Add Bangla translation utilities using LibreTranslate API" — status Ready [STALE], 99 days old
- **Env vars required** (Production + Preview + Development):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (SERVER ONLY)
  - `OPENROUTER_API_KEY` (SERVER ONLY)
  - `NEXT_PUBLIC_SITE_URL` (https://galaxy-workforce.vercel.app)

## SUPABASE
- **Auth Site URL:** https://galaxy-workforce.vercel.app
- **Redirect allow-list:**
  - https://galaxy-workforce.vercel.app/**
  - https://galaxy-workforce.vercel.app/auth/callback
  - http://localhost:3000/**
  - http://localhost:3000/auth/callback
  - https://*.vercel.app/**
- **SERVER-ONLY keys:** `SUPABASE_SERVICE_ROLE_KEY`, `OPENROUTER_API_KEY`
  - Must NEVER be `NEXT_PUBLIC_`
  - If found exposed → CRITICAL, rotate immediately
- **RLS:** Enabled on every table. No migrations without approval.
- **Buckets:** avatars, shop-banners, shop-logos, product-images, portfolio, job-attachments
- **Bangla translation:** LibreTranslate API already integrated (commit 0e95873). Reuse; do not add another provider.

## DEPLOY ORDER (always this sequence, never skip)
1. `npm run build` → must pass
2. `npm run lint` → must pass
3. Show `git status --short` + `git diff --stat`, then WAIT for approval
4. Commit on a branch → push → open PR → Vercel preview → check preview URL
5. Merge to main → Vercel production deploy
6. Open https://galaxy-workforce.vercel.app → home + /discover render
7. Register a new user → log out → log in → both must work
8. Run `node scripts/check-connections.mjs`
9. Report: GitHub ✔ / Vercel ✔ / Supabase ✔ with URLs and deployment states
- If production breaks: `vercel rollback`

## REAL VALUES (collected 2026-11-02)
- **git remote get-url origin:** https://github.com/lingalingalinga456-del/galaxy-force
- **git rev-parse --abbrev-ref HEAD:** master
- **git status --short:** (committed Phase B discover fix, awaiting next steps)
- **vercel whoami:** Not logged in
- **.vercel/project.json:** Does not exist
- **npx supabase projects list:**
  - REFERENCE: nomsymbzyljfrtvddxwc | NAME: lingalingalinga456@gmail.com | REGION: Southeast Asia (Singapore) | CREATED: 2026-08-05
  - REFERENCE: wrucbreeufdahllsdrey | NAME: luxetex | REGION: South Asia (Mumbai) | CREATED: 2026-08-15
- **node scripts/check-connections.mjs:** supabaseAuth FAIL (400), supabaseRest PASS, openRouter FAIL (404)
- **Supabase project in .env:** xddoxfxtiendlrcftdwa.supabase.co (not in listed projects)

## ENV VARS (local .env.local)
- `NEXT_PUBLIC_SUPABASE_URL=https://xddoxfxtiendlrcftdwa.supabase.co` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=*** ✅
- `SUPABASE_SERVICE_ROLE_KEY=*** ✅
- `OPENROUTER_API_KEY=sk-or-v1-...` ✅
- `NEXT_PUBLIC_APP_URL=http://localhost:3000` ✅
- `OPENROUTER_MODEL=anthropic/claude-3.5-sonnet` ✅

## DEPLOYMENT LOG
- **2026-11-02:** Phase B — Fixed /discover page. Rebuilt the left sidebar filter rail (280-310px) with proper sticky positioning, z-index, and overflow handling. Applied all 6 changes: container flex row, rail sticky with z-20 and max-height, removed duplicate sticky, category bar z-40, results wrapped in min-w-0 flex-1, min-h-dvh. Build passed, lint passed, typecheck passed.