# Recommendation System (v4)

Monorepo for a **GenAI-based movie/show recommendation system**.

## Repository structure

```
recommendation-system-v4/
├── apps/
│   ├── api/                    # Python API (FastAPI + Uvicorn)
│   └── web/                    # Next.js frontend (BFF)
├── packages/
│   └── api-contracts/          # JSON Schema + operations/security (shared contract)
├── scripts/
│   └── codegen-contracts.mjs   # Generate TS + Pydantic from schemas
├── .github/workflows/          # GitHub Actions CI
├── .husky/                     # Git hooks (pre-commit, pre-push, commit-msg)
├── .nvmrc                      # Node 22.22.1 — local dev pin (see Node version strategy)
├── .npmrc                      # engine-strict=true
├── .vscode/                    # Shared editor settings
├── commitlint.config.ts        # Conventional commit rules
├── prettier.config.mjs         # Prettier (root + web)
├── .prettierignore
├── package.json                # Root tooling (Husky, lint-staged, scripts)
├── tsconfig.json               # TypeScript config for commitlint
├── .gitignore
└── README.md
```

## Apps

| App     | Stack                                                                            | Docs                                     |
| ------- | -------------------------------------------------------------------------------- | ---------------------------------------- |
| **api** | Python 3.12, FastAPI, Uvicorn, uv, Pydantic, LangSmith, Ruff, Pyright, pytest    | [apps/api/README.md](apps/api/README.md) |
| **web** | Next.js 16, React 19, Tailwind CSS 4, ESLint, `tsc`, Vitest, Prettier (via root) | [apps/web/README.md](apps/web/README.md) |

| Package           | Role                                                           | Docs                                                                 |
| ----------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| **api-contracts** | Shared JSON Schema, security, and operation docs for BFF ↔ API | [packages/api-contracts/README.md](packages/api-contracts/README.md) |

## Quick start

### First time (repo root)

**Prerequisites:** Node **22.22.1** locally (`nvm use` — see [Node version strategy](#node-version-strategy)), [uv](https://docs.astral.sh/uv/) for Python **3.12.12**.

```bash
nvm use                      # reads .nvmrc → 22.22.1
npm install
npm run prepare              # Husky hooks
npm run sync:api             # Python deps (apps/api)
cd apps/web && npm install   # Next.js deps
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

Verify runtimes:

```bash
npm run validate:runtime     # Node 22.22.1 + Python 3.12.12 via uv
```

### Run dev servers

| Command           | What starts                      |
| ----------------- | -------------------------------- |
| `npm run dev:api` | API only — http://127.0.0.1:8000 |
| `npm run dev:web` | Web only — http://localhost:3000 |
| `npm run dev`     | API + web together               |

| URL                          | Description                              |
| ---------------------------- | ---------------------------------------- |
| http://127.0.0.1:8000/health | API health check                         |
| http://127.0.0.1:8000/docs   | Swagger UI (local only)                  |
| http://localhost:3000/health | Web health route (server env smoke test) |

## Node version strategy

Node uses **two layers** — same idea as Python (`.python-version` + `requires-python`):

| File / setting                               | Value                | Role                                                         |
| -------------------------------------------- | -------------------- | ------------------------------------------------------------ |
| `.nvmrc` (root + `apps/web`)                 | `22.22.1`            | **Local exact pin** — `nvm use`, `validate:node` on commit   |
| `package.json` → `engines.node` (root + web) | `>=22.22.0`          | **Install / deploy floor** — `engine-strict` on `npm ci`     |
| `.npmrc`                                     | `engine-strict=true` | Fail `npm install` / `npm ci` if Node below `engines`        |
| Vercel dashboard                             | Node **22.x**        | Host picks patch (e.g. `22.22.2`) — must satisfy `>=22.22.0` |

**Why not pin exact Node in `engines`?**

Vercel only lets you select **major** Node (`22.x`) and may use a different **patch** than your laptop. Exact pins like `"node": "22.22.1"` or `"npm": "10.9.4"` cause `EBADENGINE` on deploy.

**Do not pin `npm` in `engines`** — Vercel controls npm; only pin Node range.

**Local vs deploy:**

```
Local:   .nvmrc 22.22.1  →  validate:node (strict on commit)
Deploy:  engines >=22.22.0  →  Vercel 22.22.x passes npm ci
```

When bumping Node intentionally: update **both** `.nvmrc` files, then retest CI and Vercel.

## Design principles

- **Exact version pinning** for Python and dependencies (`==` in `pyproject.toml` + `uv.lock`).
- **Explicit upgrade windows** — bump Python/deps intentionally, retest, refresh lockfile.
- **Contract-first BFF ↔ API** — JSON Schema in `packages/api-contracts`; generate TS + Pydantic; CI drift check.
- **Browser never calls the API** — Next.js BFF uses `API_URL` + `API_INTERNAL_SECRET` server-only.
- **Dual authentication** — `X-Internal-Api-Key` (service) + Supabase Bearer JWT / JWKS ES256 (user `sub`).
- **Environment-aware behavior** — local vs production via `ENV` / `APP_ENV` and settings.
- **Git discipline** — branch naming, conventional commits, pre-commit + pre-push hooks.
- **Static typing** — Pyright (API), `tsc` (web).
- **Monorepo scripts at root** — `dev`, `check`, `format`, `codegen:contracts`.

## BFF ↔ API (local)

```
Browser → Next.js (apps/web)
              │  server-only
              │  X-Internal-Api-Key + Authorization: Bearer <supabase access token>
              ▼
         FastAPI (apps/api)
              │  verify internal secret + JWT (JWKS)
              ▼
         POST /recommendations
```

| Variable                 | Web (`apps/web/.env.local`)             | API (`apps/api/.env`) |
| ------------------------ | --------------------------------------- | --------------------- |
| `API_URL`                | `http://127.0.0.1:8000`                 | —                     |
| `API_INTERNAL_SECRET`    | **same value**                          | **same value**        |
| `SUPABASE_URL`           | via `NEXT_PUBLIC_SUPABASE_URL` (client) | Project URL for JWKS  |
| `NEXT_PUBLIC_SUPABASE_*` | required                                | —                     |

```bash
npm run codegen:contracts        # regenerate TS + Pydantic from packages/api-contracts
npm run codegen:contracts:check  # fail if generated output drifts
```

See [packages/api-contracts/README.md](packages/api-contracts/README.md).

## Tooling overview

| Tool               | Role                                    | Scope               |
| ------------------ | --------------------------------------- | ------------------- |
| **uv**             | Python package manager, lockfile, venv  | `apps/api`          |
| **Ruff**           | Lint + format                           | `apps/api`          |
| **Pyright**        | Static type checking                    | `apps/api`          |
| **pytest**         | API tests                               | `apps/api`          |
| **Vitest**         | Web unit tests                          | `apps/web`          |
| **tsc**            | Web type checking                       | `apps/web`          |
| **ESLint**         | Lint                                    | `apps/web`          |
| **GitHub Actions** | CI (parallel jobs on PR / push to main) | `.github/workflows` |
| **Prettier**       | Format                                  | root + `apps/web`   |
| **Husky**          | Git hooks                               | monorepo root       |
| **lint-staged**    | Fix staged files on commit              | monorepo root       |
| **commitlint**     | Enforce commit message format           | monorepo root       |
| **concurrently**   | Run API + web dev servers               | monorepo root       |

## Git hooks

### Pre-commit (`.husky/pre-commit`) — fast

Runs on every `git commit`:

1. **`validate:runtime`** — Node **exact** `22.22.1` (from `.nvmrc`) + Python `3.12.12` (via uv)
2. **Branch name validation** — blocks direct commits to `main`, `develop`, etc.
3. **lint-staged** — auto-fix staged files (see below)
4. **`npm run format:check`** — Prettier on whole repo

### Pre-push (`.husky/pre-push`) — path-aware, lighter than CI

Runs on every `git push`. Mirrors CI **lanes** for changed files only (does **not** run Playwright or `next build` locally):

1. Diff commits you are pushing (upstream / `origin/main` / last commit)
2. If **contracts** / shared tooling changed → `codegen:contracts:check` (+ both app lanes)
3. If **web** (or shared) → `npm run check:web` (ESLint + tsc + Vitest)
4. If **api** (or shared) → `npm run check:api` (Ruff + Pyright + pytest)

Full monorepo gate (optional, manual):

```bash
npm run check
```

Hooks are local-only (`git commit --no-verify` / `--no-verify` on push skips them). **GitHub `CI OK` is the merge / deploy safety net** (includes e2e + web build).

### lint-staged (on commit)

| Glob                                                | Tools                          |
| --------------------------------------------------- | ------------------------------ |
| `apps/api/**/*.py`                                  | Ruff check --fix → Ruff format |
| `*.{json,md,yml,yaml,ts,js,mjs,cjs}` (repo root)    | Prettier write                 |
| `apps/web/**/*.{js,jsx,ts,tsx,mjs,cjs,css,md,json}` | ESLint --fix → Prettier write  |

Dry-run without committing:

```bash
git add apps/api/index.py
npx lint-staged --dry-run
```

Run hooks manually:

```bash
sh .husky/pre-commit
sh .husky/pre-push
```

### Commit message (`.husky/commit-msg`)

Enforces [Conventional Commits](https://www.conventionalcommits.org/) via `commitlint.config.ts`.

**Format:**

```
type(scope): subject
```

**Examples:**

```
feat(api): add recommendations endpoint
feat(web): add home page layout
chore(root): configure husky hooks
docs(api): update README
```

**Allowed scopes:** `web`, `bff`, `api`, `root`, `deps`, `ci`, `docs`, `design`, `test`, `config`, `tool`, `web:api`

**Rules:**

- Scope is **required** and must be from the allowed list
- Header max length: **300** characters

Test a message without committing:

```bash
echo "feat(api): test message" | npx commitlint
```

### Branch naming (`.husky/validate-branch-name.sh`)

**Allowed:**

```
feat/add-recommendations
fix/empty-show-ids
release/0.0.3
```

**Blocked:**

- Direct commits on `main`, `master`, `develop`, `staging`, `release/next`
- Invalid names like `feature/foo` or `feat/my_branch`

## Root npm scripts

### Dev

| Script            | What it does            |
| ----------------- | ----------------------- |
| `npm run dev:api` | Uvicorn with `--reload` |
| `npm run dev:web` | Next.js dev server      |
| `npm run dev`     | API + web together      |

### Quality

| Script                     | What it does                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `npm run format`           | Prettier write (root + web)                                                                |
| `npm run format:check`     | Prettier check only                                                                        |
| `npm run lint:api`         | Ruff fix + format on all API files                                                         |
| `npm run lint:api:check`   | Ruff check + format check (API)                                                            |
| `npm run typecheck:api`    | Pyright                                                                                    |
| `npm run test:api`         | pytest                                                                                     |
| `npm run test:web`         | Vitest (`apps/web`)                                                                        |
| `npm run test:e2e`         | Playwright E2E locally (`apps/web`, port 3001); CI runs this in the **Playwright E2E** job |
| `npm run check:api`        | `lint:api:check` + `typecheck:api` + `test:api`                                            |
| `npm run lint:web`         | ESLint (`apps/web`)                                                                        |
| `npm run lint:web:fix`     | ESLint with `--fix`                                                                        |
| `npm run typecheck:web`    | `tsc --noEmit` (`apps/web`)                                                                |
| `npm run check:web`        | ESLint + typecheck + Vitest                                                                |
| `npm run check`            | Full local gate: format + contracts codegen + web + api (no e2e / no next build)           |
| `npm run check:push`       | Same as pre-push hook (path-aware lanes)                                                   |
| `npm run validate:runtime` | Node + Python version check                                                                |
| `npm run validate:branch`  | Branch name check only                                                                     |

### Setup

| Script             | What it does           |
| ------------------ | ---------------------- |
| `npm run sync:api` | `uv sync --dev` in API |

## CI (GitHub Actions)

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Runs on **pull requests** and **pushes to `main`**.

### Lanes (path filters)

A **Detect changes** job classifies the diff, then only the relevant lanes run:

| Flag / lane     | Typical paths                                                | Jobs                                             |
| --------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| **Web**         | `apps/web/**` (also forced by contracts / CI tooling)        | Web lint, typecheck, test, build, Playwright E2E |
| **API**         | `apps/api/**` (also forced by contracts / CI tooling)        | API lint, typecheck, test                        |
| **Contracts**   | `packages/api-contracts/**`, `scripts/codegen-contracts.mjs` | Codegen drift check + `test:api:contracts`       |
| **Format**      | When any of the above lanes run                              | `format:check`                                   |
| **CI / shared** | `.github/workflows/**`, root `package.json`, Prettier, Husky | Fan-out: web + api + contracts                   |

Examples:

- Only `apps/web/...` → web lane (+ format, e2e, web-build); API jobs **skip**
- Only `apps/api/...` → api lane (+ format); web + e2e **skip**
- Contract schema change → contracts + **both** app lanes

### Job graph

```
detect-changes
     │
     ├─ format (if needed)
     ├─ web-lint │ web-typecheck │ web-test     (if run_web)
     ├─ api-lint │ api-typecheck │ api-test     (if run_api)
     ├─ contracts                               (if run_contracts)
     │
     └─ after web quality (+ contracts ok/skip):
            web-build  ∥  Playwright E2E
                 └──────────┬──────────┘
                            ▼
                         CI OK
```

| Job                             | What                                                               |
| ------------------------------- | ------------------------------------------------------------------ |
| **Detect changes**              | Path filters → `run_web` / `run_api` / `run_contracts` / `run_e2e` |
| **Format**                      | `npm run format:check`                                             |
| **Web lint / typecheck / test** | ESLint, `tsc`, Vitest                                              |
| **API lint / typecheck / test** | Ruff, Pyright, pytest                                              |
| **API contracts**               | `codegen:contracts:check` + contract pytest                        |
| **Web build**                   | `next build` (sibling of e2e; does **not** wait on Playwright)     |
| **Playwright E2E**              | `npm run test:e2e` in `apps/web` (after web unit gates)            |
| **CI OK**                       | Merge / deploy gate — fails if any **required** lane failed        |

**Branch protection (recommended):** require **`CI OK`** before merging to `main`.

**Vercel Deployment Checks:** require **`CI OK`** (not individual lane jobs).

### Runtime versions in CI

| Runtime          | Source                                           |
| ---------------- | ------------------------------------------------ |
| Node `22.22.1`   | `.nvmrc` via `node-version-file` in Actions      |
| Python `3.12.12` | `apps/api/.python-version` via `setup-uv@v8.3.0` |

CI pins **exact** Node in Actions; Vercel uses `engines` (`>=22.22.0`) instead — see [Node version strategy](#node-version-strategy).

## Deployment

Push to `main` → **Vercel** (web) and **Render** (API) auto-deploy. CI runs on PRs and `main` before merge.

### Live URLs

| App              | URL                                                                           | Health check                                                                                    |
| ---------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Web** (Vercel) | https://recommendation-system-v4-f4cef7rj5-vikas-projects-c7b4be85.vercel.app | [/health](https://recommendation-system-v4-f4cef7rj5-vikas-projects-c7b4be85.vercel.app/health) |
| **API** (Render) | https://recommendation-system-v4.onrender.com                                 | [/health](https://recommendation-system-v4.onrender.com/health)                                 |

Expected web `/health` response:

```json
{ "status": "ok", "appEnv": "production", "apiUrlConfigured": true }
```

Expected API `/health` response:

```json
{ "detail": "Up and running" }
```

Vercel also assigns a **production domain** in project settings (e.g. `recommendation-system-v4.vercel.app`). Per-deployment preview URLs change; set `NEXT_PUBLIC_APP_URL` to the URL you want baked into the client bundle, then redeploy.

### Architecture

```
GitHub (main)
    ├── Vercel  → apps/web  → public UI + BFF
    └── Render  → apps/api  → FastAPI (not exposed to browser directly)
```

Web calls API server-side via `API_URL` (BFF). Never put `API_URL` or `API_INTERNAL_SECRET` in `NEXT_PUBLIC_*`.

Protected API routes require:

1. Matching `API_INTERNAL_SECRET` on Vercel and Render (`X-Internal-Api-Key`)
2. Valid Supabase user JWT (`Authorization: Bearer …`), verified on the API via JWKS from `SUPABASE_URL`

### Vercel (web)

| Setting              | Value                   |
| -------------------- | ----------------------- |
| **Root Directory**   | `apps/web`              |
| **Framework Preset** | **Next.js** (not Other) |
| **Node.js Version**  | `22.x`                  |
| **Build Command**    | `npm run build`         |
| **Install Command**  | `npm ci`                |
| **Output Directory** | default (blank)         |

**Environment variables** (Production + Preview — all required for `next build`):

| Variable                        | Where to get it                                     |
| ------------------------------- | --------------------------------------------------- |
| `APP_ENV`                       | `production`                                        |
| `NEXT_PUBLIC_APP_URL`           | Your Vercel production URL                          |
| `API_URL`                       | Your Render API URL                                 |
| `API_INTERNAL_SECRET`           | Shared secret (same value as Render)                |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase → Project Settings → API → Project URL     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → anon/public key |
| `DB_PASSWORD`                   | Supabase → Project Settings → Database → password   |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase → Project Settings → API (server-only)     |

Apply to **Production** and **Preview**, then **redeploy** (`NEXT_PUBLIC_*` is baked at build time).

**Wait for CI before promoting deploys** (Vercel builds on push immediately; use Deployment Checks so production/preview only go live after GitHub CI passes):

1. Ensure the **`CI OK`** job exists in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) — check name on GitHub: **`CI OK`**
2. Vercel → Project → **Settings → Git → Deployment Checks**
3. Enable checks for **Production** (and **Preview** if desired)
4. Add required check: **`CI OK`** (or `CI / CI OK` if the picker shows the workflow prefix)
5. Save — Vercel will build on push but **hold promotion** until that check is green

Optional (recommended): GitHub → **Settings → Branches** → `main` → require status check **`CI OK`** before merge.

Docs: [Vercel Deployment Checks](https://vercel.com/docs/deployments/deployment-checks)

Details: [apps/web/README.md](apps/web/README.md#deploy-vercel).

### Render (API)

| Setting            | Value                                                  |
| ------------------ | ------------------------------------------------------ |
| **Root Directory** | `apps/api`                                             |
| **Runtime**        | Python 3                                               |
| **Build Command**  | `uv sync --frozen --no-dev`                            |
| **Start Command**  | `uv run uvicorn index:app --host 0.0.0.0 --port $PORT` |
| **Instance Type**  | Free (sleeps after idle; cold start ~30–60s)           |

**Environment variables:**

| Variable              | Value                                  |
| --------------------- | -------------------------------------- |
| `ENV`                 | `production`                           |
| `API_INTERNAL_SECRET` | Same shared secret as Vercel           |
| `SUPABASE_URL`        | Same as web `NEXT_PUBLIC_SUPABASE_URL` |
| `LANGSMITH_API_KEY`   | your key (optional until LLM features) |
| `LANGSMITH_PROJECT`   | `recommendation-system-v4`             |

Details: [apps/api/README.md](apps/api/README.md#deploy-render).

### Common deploy failures

| Symptom                                                               | Fix                                                               |
| --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Vercel sitewide `404: NOT_FOUND`                                      | Root Directory = `apps/web`, Framework = **Next.js**, redeploy    |
| Vercel `EBADENGINE`                                                   | `engines.node` = `>=22.22.0`, no `engines.npm`                    |
| Vercel build `Missing environment variable: NEXT_PUBLIC_SUPABASE_URL` | Add all vars in [Vercel env table](#vercel-web) → redeploy        |
| Render build fails                                                    | Root Directory = `apps/api`, use `uv sync` not `requirements.txt` |
| Slow first API request                                                | Render free tier cold start after sleep                           |

### Supabase (database)

Schema lives in [`supabase/migrations/`](supabase/migrations/). GitHub integration should use **Working directory** `.` (repo root).

1. Commit and push migrations to `main`
2. Supabase Dashboard → **Database → GitHub** → enable **Deploy to production** and set production branch to `main` (currently off in project settings)
3. After merge, verify tables in **Table Editor** (`shows`, `shows_embeddings`)

**RLS (this migration):**

| Table              | Access                                                                      |
| ------------------ | --------------------------------------------------------------------------- |
| `shows`            | `SELECT` for `authenticated` only; writes via **service role** (admin seed) |
| `shows_embeddings` | No client policies — **service role** only (FastAPI / batch jobs)           |

**Local CLI (optional):** copy `DATABASE_URL` from Supabase → Settings → Database into `.env`, then `npx supabase db push`. Not required if GitHub integration deploys migrations.

## Git

**Commit:** source, `pyproject.toml`, `uv.lock`, root `package.json` + `package-lock.json`, `apps/web/package.json` + `package-lock.json`, `.env.example`, `supabase/`, `.vscode/`, `.husky/`, `commitlint.config.ts`, `prettier.config.mjs`, `.prettierignore`, `apps/web/vitest.config.ts`, `apps/web/vitest.setup.ts`

**Do not commit:** `.env`, `.venv/`, `node_modules/`, `__pycache__/`, `.ruff_cache/`, `.pytest_cache/`, `.next/`, `apps/web/.next/`

## Documentation

- API setup, schemas, env, tests: [apps/api/README.md](apps/api/README.md)
- Web app: [apps/web/README.md](apps/web/README.md)
