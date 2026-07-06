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

| File                            | Value                | Role                                                    |
| ------------------------------- | -------------------- | ------------------------------------------------------- |
| `apps/web/.nvmrc`               | `22.22.1`            | Local exact pin — `nvm use`, matches root `.nvmrc`      |
| `package.json` → `engines.node` | `>=22.22.0`          | `npm ci` / Vercel — accepts host patch (e.g. `22.22.2`) |
| `apps/web/.npmrc`               | `engine-strict=true` | Enforce `engines` on install                            |

**Not in `engines`:** `npm` — Vercel bundles its own npm version; pinning it causes `EBADENGINE`.

Use `nvm use` at repo root or in `apps/web` before local work. Hooks enforce **exact** `22.22.1` via `validate:node`; Vercel only needs `>=22.22.0`.

## Deploy (Vercel)

1. Import repo → **Root Directory:** `apps/web`
2. **Node.js Version:** `22.x` in project settings
3. Add env vars before first deploy:

| Variable              | First deploy            | After deploy                               |
| --------------------- | ----------------------- | ------------------------------------------ |
| `APP_ENV`             | `production`            | `production`                               |
| `NEXT_PUBLIC_APP_URL` | placeholder OK          | **real** `https://….vercel.app` + redeploy |
| `API_URL`             | `http://127.0.0.1:8000` | Render API URL when live                   |

4. **Deploy** → verify `/` and `/health`
5. Update `NEXT_PUBLIC_APP_URL` to production URL → **Redeploy** (`NEXT_PUBLIC_*` is baked at build time)

**Common failure:** `EBADENGINE` — `engines` too strict or `npm` pinned in `package.json`. Use `>=22.22.0` and drop `engines.npm`.

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
├── server.ts    # API_URL, APP_ENV — server-only (import "server-only")
└── required.ts  # shared helper
```

| Variable              | Scope                  | Local example           |
| --------------------- | ---------------------- | ----------------------- |
| `APP_ENV`             | server                 | `local`                 |
| `NEXT_PUBLIC_APP_URL` | client                 | `http://localhost:3000` |
| `API_URL`             | server (BFF → FastAPI) | `http://127.0.0.1:8000` |

**Rule:** never put `API_URL` or secrets in `NEXT_PUBLIC_*`.

Production values go in the **Vercel dashboard**, not in git.

## Run dev server

From repo root:

| Command                 | URL                    |
| ----------------------- | ---------------------- |
| `npm run dev:web`       | http://localhost:3000  |
| `npm run dev:web:https` | https://localhost:3000 |
| `npm run dev`           | API + web together     |
| `npm run dev:https`     | API + web (HTTPS web)  |

Or from `apps/web`:

```bash
npm run dev
npm run dev:https   # next dev --experimental-https
```

## Quality

### From repo root

| Command                 | What it does                 |
| ----------------------- | ---------------------------- |
| `npm run lint:web`      | ESLint                       |
| `npm run lint:web:fix`  | ESLint with `--fix`          |
| `npm run typecheck:web` | `tsc --noEmit`               |
| `npm run test:web`      | Vitest single run            |
| `npm run check:web`     | ESLint + typecheck + Vitest  |
| `npm run check`         | Prettier + `check:web` + API |
| `npm run check:push`    | Full gate (pre-push hook)    |

### From `apps/web`

| Command             | What it does                      |
| ------------------- | --------------------------------- |
| `npm run lint`      | ESLint                            |
| `npm run typecheck` | `tsc --noEmit`                    |
| `npm run test:run`  | Vitest single run                 |
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

| When           | What runs for web                                                                           |
| -------------- | ------------------------------------------------------------------------------------------- |
| **pre-commit** | lint-staged (ESLint + Prettier on staged files) + `format:check`                            |
| **pre-push**   | `check:web` (lint + typecheck + test) via `npm run check:push`                              |
| **CI**         | Separate jobs: **Web lint**, **Web typecheck**, **Web test**; **Web build** after they pass |

See [root README](../../README.md#ci-github-actions).

---

## Tests (Vitest)

Config in `vitest.config.ts`; setup in `vitest.setup.ts`.

**Pattern:** `**/*.{test,spec}.{ts,tsx}` (e.g. `app/page.test.tsx`).

```bash
npm run test:web        # from root
npm run test:run        # from apps/web (CI)
```

**Limits:** Vitest suits Client Components and utilities. Async Server Components need E2E (planned).

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
