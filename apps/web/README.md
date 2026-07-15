# Web

Next.js frontend for the recommendation system. Acts as the **public entry** and **BFF** — no LLM logic in the browser.

## Stack

| Layer     | Technology                     |
| --------- | ------------------------------ |
| Framework | Next.js 16                     |
| UI        | React 19                       |
| Styling   | Tailwind CSS 4                 |
| Lint      | ESLint 9                       |
| Types     | TypeScript (`tsc --noEmit`)    |
| Test      | Vitest + React Testing Library |
| Format    | Prettier (root config)         |

## Runtime

Two layers — **strict locally**, **flexible on Vercel**:

| File                            | Value                | Role                                               |
| ------------------------------- | -------------------- | -------------------------------------------------- |
| `apps/web/.nvmrc`               | `24.18.0`            | Local exact pin — `nvm use`, matches root `.nvmrc` |
| `package.json` → `engines.node` | `>=24.0.0`           | `npm ci` / Vercel — accepts any host `24.x` patch  |
| `apps/web/.npmrc`               | `engine-strict=true` | Enforce `engines` on install                       |

**Not in `engines`:** `npm` — Vercel bundles its own npm version; pinning it causes `EBADENGINE`.

Use `nvm use` at repo root or in `apps/web` before local work. Hooks enforce **exact** `24.18.0` via `validate:node`; Vercel only needs `>=24.0.0` (host may be e.g. `24.15.0`).

## Deploy (Vercel)

**Live:** https://recommendation-system-v4-f4cef7rj5-vikas-projects-c7b4be85.vercel.app  
**Health:** [/health](https://recommendation-system-v4-f4cef7rj5-vikas-projects-c7b4be85.vercel.app/health) → `{"status":"ok","appEnv":"production","apiUrlConfigured":true}`

### First-time setup

1. Import repo → **Root Directory:** `apps/web`
2. **Framework Preset:** **Next.js** (not Other — sitewide 404 if wrong)
3. **Node.js Version:** `24.x` in project settings
4. Add env vars (**Production** + **Preview**), then deploy

| Variable                                              | Production example                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `APP_ENV`                                             | `production`                                                                    |
| `NEXT_PUBLIC_APP_URL`                                 | `https://recommendation-system-v4-f4cef7rj5-vikas-projects-c7b4be85.vercel.app` |
| `API_URL`                                             | `https://recommendation-system-v4.onrender.com`                                 |
| `API_INTERNAL_SECRET`                                 | Same shared secret as Render                                                    |
| `NEXT_PUBLIC_SENTRY_DSN`                              | From Sentry project **reelmind-web** (Settings → Client Keys)                   |
| `SENTRY_DSN`                                          | Same DSN (optional; server falls back to `NEXT_PUBLIC_SENTRY_DSN`)              |
| `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` | Optional — source map upload on build                                           |
| `NEXT_PUBLIC_SUPABASE_URL`                            | `https://<project-ref>.supabase.co`                                             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`                       | from Supabase → Settings → API                                                  |
| `DB_PASSWORD`                                         | from Supabase → Settings → Database                                             |
| `SUPABASE_SERVICE_ROLE_KEY`                           | from Supabase → Settings → API (server-only)                                    |

5. Verify `/` and `/health`
6. If you change any `NEXT_PUBLIC_*` var, **redeploy** (baked at build time)

### Project settings

| Setting          | Value           |
| ---------------- | --------------- |
| Root Directory   | `apps/web`      |
| Framework Preset | Next.js         |
| Build Command    | `npm run build` |
| Install Command  | `npm ci`        |
| Output Directory | default (blank) |

**Common failures:**

| Symptom                                 | Fix                                                                |
| --------------------------------------- | ------------------------------------------------------------------ |
| `EBADENGINE`                            | `engines.node` = `>=24.0.0` (not a laptop patch), no `engines.npm` |
| Sitewide `404: NOT_FOUND`               | Framework = Next.js, Root Directory = `apps/web`, redeploy         |
| `apiUrlConfigured: false`               | Set `API_URL` → redeploy                                           |
| Build `Missing environment variable: …` | Add full [env table](#first-time-setup) on Vercel → redeploy       |

**Vercel deploys before CI finishes:** enable [Deployment Checks](https://vercel.com/docs/deployments/deployment-checks) and require GitHub check **`CI OK`**. See [root README — Vercel](../../README.md#vercel-web).

See also [root README — Deployment](../../README.md#deployment).

## First-time setup

From repo root:

```bash
nvm use
npm install
npm run prepare
cd apps/web && npm install
```

Copy env template:

```bash
cp apps/web/.env.example apps/web/.env.local
```

## Environment variables

| File           | Purpose                                      |
| -------------- | -------------------------------------------- |
| `.env.local`   | Local dev secrets (gitignored)               |
| `.env.example` | Template for onboarding / Vercel (committed) |

### Modules

```
lib/env/
├── public.ts    # NEXT_PUBLIC_* — safe for client components
├── server.ts    # API_URL, API_INTERNAL_SECRET, APP_ENV — server-only
└── required.ts  # shared helper
```

| Variable                        | Scope                  | Local example              |
| ------------------------------- | ---------------------- | -------------------------- |
| `APP_ENV`                       | server                 | `local`                    |
| `NEXT_PUBLIC_APP_URL`           | client                 | `http://localhost:3000`    |
| `API_URL`                       | server (BFF → FastAPI) | `http://127.0.0.1:8000`    |
| `API_INTERNAL_SECRET`           | server (BFF → FastAPI) | Same as `apps/api/.env`    |
| `NEXT_PUBLIC_SUPABASE_URL`      | client                 | Supabase project URL       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | client                 | Supabase anon key          |
| `DB_PASSWORD`                   | server                 | Supabase database password |
| `SUPABASE_SERVICE_ROLE_KEY`     | server                 | Supabase service role key  |

**Rule:** never put `API_URL`, `API_INTERNAL_SECRET`, or other secrets in `NEXT_PUBLIC_*`.

## Calling the API (BFF)

Browser never calls FastAPI. Server code uses `lib/api/recommendations.ts`:

1. Reads Supabase session access token (`getAccessToken`)
2. `POST {API_URL}/recommendations` with:
   - `X-Internal-Api-Key: API_INTERNAL_SECRET`
   - `Authorization: Bearer <access token>`
   - body `{ showIds: number[] }` (contract)
3. Validates response with generated Zod (`recommendedShowIds`)

Contracts: [`packages/api-contracts`](../../packages/api-contracts/README.md). After changing schemas:

```bash
npm run codegen:contracts
```

Generated files: `lib/api/generated/` — **do not edit by hand**.

Production values go in the **Vercel dashboard**, not in git.

## Run dev server

From repo root:

| Command           | URL                   |
| ----------------- | --------------------- |
| `npm run dev:web` | http://localhost:3000 |
| `npm run dev`     | API + web together    |

Or from `apps/web`:

```bash
npm run dev
```

## Quality

### From repo root

| Command                 | What it does                                     |
| ----------------------- | ------------------------------------------------ |
| `npm run lint:web`      | ESLint                                           |
| `npm run lint:web:fix`  | ESLint with `--fix`                              |
| `npm run typecheck:web` | `tsc --noEmit`                                   |
| `npm run test:web`      | Vitest single run                                |
| `npm run test:e2e`      | Playwright E2E (from root)                       |
| `npm run check:web`     | ESLint + typecheck + Vitest                      |
| `npm run check`         | Full local gate (format + contracts + web + api) |
| `npm run check:push`    | Path-aware pre-push lanes (same as git hook)     |

### From `apps/web`

| Command             | What it does                      |
| ------------------- | --------------------------------- |
| `npm run lint`      | ESLint                            |
| `npm run typecheck` | `tsc --noEmit`                    |
| `npm run test:run`  | Vitest single run                 |
| `npm run test:e2e`  | Playwright E2E                    |
| `npm run check`     | lint + typecheck + test           |
| `npm run build`     | Production build (needs env vars) |

**Config files:**

- ESLint: `eslint.config.mjs`
- Vitest: `vitest.config.ts` (`resolve.tsconfigPaths: true`)
- Prettier: root `prettier.config.mjs`

### Production build (local smoke)

```bash
cd apps/web
APP_ENV=production \
NEXT_PUBLIC_APP_URL=http://localhost:3000 \
API_URL=http://127.0.0.1:8000 \
npm run build
```

## Git hooks & CI

| When           | What runs for web                                                                      |
| -------------- | -------------------------------------------------------------------------------------- |
| **pre-commit** | lint-staged (ESLint + Prettier on staged files) + root `format:check`                  |
| **pre-push**   | Path-aware: `check:web` only if `apps/web` (or shared) changed — see root README       |
| **CI**         | Detect-changes lanes → web lint/type/test → **web-build ∥ Playwright E2E** → **CI OK** |

See [root README — CI](../../README.md#ci-github-actions).

---

## Tests (Vitest)

Config in `vitest.config.ts`; setup in `vitest.setup.ts`.

**Pattern:** `**/*.{test,spec}.{ts,tsx}` (e.g. `app/page.test.tsx`).

```bash
npm run test:web        # from root
npm run test:run        # from apps/web (CI)
```

**Limits:** Vitest suits Client Components and utilities. Use Playwright for full-page E2E (see below).

### E2E (Playwright)

Config: `playwright.config.ts`. Tests: `e2e/**/*.spec.ts`.

Playwright starts its own dev server on **http://localhost:3001** (separate from daily dev on port 3000).

```bash
npm run test:e2e        # from root
npx playwright install chromium   # first time only
```

CI runs Playwright inside [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) (**Playwright E2E** job), after web unit gates and in parallel with **Web build**. There is no separate `playwright.yml`.

---

## Project structure

```
apps/web/
├── app/
│   ├── page.tsx
│   ├── page.test.tsx
│   ├── layout.tsx
│   ├── health/route.ts     # GET /health — server env smoke test
│   └── globals.css
├── lib/env/
│   ├── public.ts
│   ├── server.ts
│   └── required.ts
├── .nvmrc
├── .npmrc
├── eslint.config.mjs
├── vitest.config.ts
├── vitest.setup.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Docs

- Monorepo tooling, hooks, CI: [../../README.md](../../README.md)
- API: [../api/README.md](../api/README.md)
