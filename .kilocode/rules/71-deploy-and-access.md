# 71-deploy-and-access.md
# Deploy & Access rules for Galaxy Workforce
# Read this for anything about deploying, pushing, or accessing services.

## ALWAYS
- Read docs/14-ACCESS-AND-DEPLOY.md first for full details.
- Run `npm run build` before any deploy attempt.
- Show `git status --short` and `git diff --stat` before committing.
- Wait for explicit approval before `git push`.
- Use `git push` instead of `vercel --prod` for production deploys.
- Verify Supabase Site URL redirect list includes localhost + prod + *.vercel.app/**.
- Check that SUPABASE_SERVICE_ROLE_KEY and OPENROUTER_API_KEY are NOT NEXT_PUBLIC_.

## NEVER
- Run `git push` without explicit approval.
- Run `vercel --prod` without explicit approval.
- Commit .env.local, .env, or .vercel/ directories.
- Expose server-only keys as NEXT_PUBLIC_.
- Run database migrations without approval.
- Skip the build/lint check before deploying.

## DEPLOY SEQUENCE
1. `npm run build` → must pass
2. `npm run lint` → must pass
3. Show `git status --short` + `git diff --stat` → WAIT for approval
4. Commit on branch → push → open PR → Vercel preview → check preview URL
5. Merge to main → Vercel production deploy
6. Open https://galaxy-force-byqi.vercel.app → home + /discover render
7. Register new user → log out → log in → both must work
8. Run `node scripts/check-connections.mjs`
9. Report: GitHub ✔ / Vercel ✔ / Supabase ✔

## IF PRODUCTION BREAKS
- Run `vercel rollback` immediately.
- Check Vercel deployment logs for build errors.
- Verify env vars in Production scope.
- Check Supabase redirect URLs match production domain.

## KEY LEAK RESPONSE
1. Do NOT push the leaked key.
2. Tell the user immediately: "CRITICAL: <key> is exposed in <file>. Rotate it now."
3. Do not silently patch or commit the fix.