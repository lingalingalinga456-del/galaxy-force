# Demo Accounts

Galaxy Workforce is seeded with demo accounts. Use these to explore each role.

| Role   | Email                          | Password       |
|--------|--------------------------------|----------------|
| Admin  | admin@galaxyworkforce.app      | DemoPass123!   |
| Client | client@galaxyworkforce.app     | DemoPass123!   |
| Talent | talent@galaxyworkforce.app     | DemoPass123!   |
| Talent | nadia_khan@galaxyworkforce.app | DemoPass123!   |
| Talent | imran_ali@galaxyworkforce.app  | DemoPass123!   |

Additional seeded talent accounts (username@galaxyworkforce.app, same password `DemoPass123!`):
sara_begum, tanvir_ahmed, farhana_islam, rahim_uddin, lamia_sultana, sajid_mia, arefin_joy, porimol_das.

## Sandbox Payments

Payments use a sandbox mode. No real funds move. Demo account numbers and auth codes
accept any test value (e.g. account `01700000000`, auth code `1234`).

## Local Setup

```bash
npm install
cp .env.example .env.local   # fill Supabase + OpenRouter keys
npm run db:push              # apply migrations
node scripts/seed.mjs        # seed categories + demo users
npm run dev
```
