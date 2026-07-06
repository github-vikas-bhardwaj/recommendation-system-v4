# Recommendation System (v4)

Monorepo for a **GenAI-based movie/show recommendation system**.

## Repository structure

```
recommendation-system-v4/
├── apps/
│   ├── api/                    # Python API (FastAPI + Uvicorn)
│   └── web/                    # Next.js frontend (BFF)
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

| Command                 | What starts                       |
| ----------------------- | --------------------------------- |
| `npm run dev:api`       | API only — http://127.0.0.1:8000  |
| `npm run dev:web`       | Web only — http://localhost:3000  |
| `npm run dev:web:https` | Web only — https://localhost:3000 |
| `npm run dev`           | API + web (HTTP)                  |
| `npm run dev:https`     | API + web (HTTPS on web)          |

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
- **Strict API contracts** — Pydantic request schemas with `extra="forbid"`.
- **Environment-aware behavior** — local vs production via `ENV` and Pydantic Settings.
- **Git discipline** — branch naming, conventional commits, pre-commit + pre-push hooks.
- **Static typing** — Pyright (API), `tsc` (web).
- **Monorepo scripts at root** — `dev`, `check`, `format` mirror the API pattern.

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

### Pre-push (`.husky/pre-push`) — full gate

Runs on every `git push`:

```bash
npm run check:push   # same as npm run check
  ├── format:check
  ├── check:web      # ESLint + tsc + Vitest
  └── check:api      # Ruff + Pyright + pytest
```

Hooks are local-only (`git commit --no-verify` / `--no-verify` on push skips them). **CI is the remote safety net.**

### lint-staged (on commit)

| Glob                                                | Tools                          |
| --------------------------------------------------- | ------------------------------ |
| `apps/api/**/*.py`                                  | Ruff check --fix → Ruff format |
| `*.{json,md,yml,yaml,ts}` (repo root)               | Prettier write                 |
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

| Script                  | What it does               |
| ----------------------- | -------------------------- |
| `npm run dev:api`       | Uvicorn with `--reload`    |
| `npm run dev:web`       | Next.js dev server (HTTP)  |
| `npm run dev:web:https` | Next.js dev server (HTTPS) |
| `npm run dev`           | API + web together         |
| `npm run dev:https`     | API + web (HTTPS on web)   |

### Quality

| Script                     | What it does                                    |
| -------------------------- | ----------------------------------------------- |
| `npm run format`           | Prettier write (root + web)                     |
| `npm run format:check`     | Prettier check only                             |
| `npm run lint:api`         | Ruff fix + format on all API files              |
| `npm run lint:api:check`   | Ruff check + format check (API)                 |
| `npm run typecheck:api`    | Pyright                                         |
| `npm run test:api`         | pytest                                          |
| `npm run test:web`         | Vitest (`apps/web`)                             |
| `npm run check:api`        | `lint:api:check` + `typecheck:api` + `test:api` |
| `npm run lint:web`         | ESLint (`apps/web`)                             |
| `npm run lint:web:fix`     | ESLint with `--fix`                             |
| `npm run typecheck:web`    | `tsc --noEmit` (`apps/web`)                     |
| `npm run check:web`        | ESLint + typecheck + Vitest                     |
| `npm run check`            | `format:check` + `check:web` + `check:api`      |
| `npm run check:push`       | Alias for `check` (pre-push hook)               |
| `npm run validate:runtime` | Node + Python version check                     |
| `npm run validate:branch`  | Branch name check only                          |

### Setup

| Script             | What it does           |
| ------------------ | ---------------------- |
| `npm run sync:api` | `uv sync --dev` in API |

## CI (GitHub Actions)

Workflow: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

Runs on **pull requests** and **pushes to `main`**. Seven quality jobs run **in parallel**; **Web build** runs after format + web checks pass.

| Job               | Command                                                         |
| ----------------- | --------------------------------------------------------------- |
| **Format**        | `npm run format:check`                                          |
| **Web lint**      | `npm run lint:web`                                              |
| **Web typecheck** | `npm run typecheck:web`                                         |
| **Web test**      | `npm run test:web`                                              |
| **API lint**      | `npm run lint:api:check`                                        |
| **API typecheck** | `npm run typecheck:api`                                         |
| **API test**      | `npm run test:api`                                              |
| **Web build**     | `next build` (needs: Format, Web lint, Web typecheck, Web test) |

**Branch protection (recommended):** require all eight checks before merging to `main`.

### Runtime versions in CI

| Runtime          | Source                                           |
| ---------------- | ------------------------------------------------ |
| Node `22.22.1`   | `.nvmrc` via `node-version-file` in Actions      |
| Python `3.12.12` | `apps/api/.python-version` via `setup-uv@v8.3.0` |

CI pins **exact** Node locally in Actions; Vercel uses `engines` (`>=22.22.0`) instead — see [Node version strategy](#node-version-strategy).

## Deploy (Vercel — web)

| Setting             | Value              |
| ------------------- | ------------------ |
| **Root Directory**  | `apps/web`         |
| **Framework**       | Next.js            |
| **Node.js Version** | `22.x` (dashboard) |
| **Build Command**   | `npm run build`    |
| **Install Command** | `npm ci`           |

**Environment variables** (Production + Preview):

| Variable              | Example                                                              |
| --------------------- | -------------------------------------------------------------------- |
| `APP_ENV`             | `production`                                                         |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` (update after first deploy + redeploy) |
| `API_URL`             | `https://your-api.onrender.com` (or placeholder until API is live)   |

Merge to `main` → Vercel auto-deploys. CI **Web build** job mirrors the Vercel build step.

Details: [apps/web/README.md](apps/web/README.md#deploy-vercel).

## Git

**Commit:** source, `pyproject.toml`, `uv.lock`, root `package.json` + `package-lock.json`, `apps/web/package.json` + `package-lock.json`, `.env.example`, `.vscode/`, `.husky/`, `commitlint.config.ts`, `prettier.config.mjs`, `.prettierignore`, `apps/web/vitest.config.ts`, `apps/web/vitest.setup.ts`

**Do not commit:** `.env`, `.venv/`, `node_modules/`, `__pycache__/`, `.ruff_cache/`, `.pytest_cache/`, `.next/`, `apps/web/.next/`

## Documentation

- API setup, schemas, env, tests: [apps/api/README.md](apps/api/README.md)
- Web app: [apps/web/README.md](apps/web/README.md)
