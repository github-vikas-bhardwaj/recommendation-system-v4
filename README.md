# Recommendation System (v4)

Monorepo for a **GenAI-based movie/show recommendation system**.

## Repository structure

```
recommendation-system-v4/
├── apps/
│   ├── api/                    # Python API (FastAPI + Uvicorn)
│   └── web/                    # Next.js frontend
├── .husky/                     # Git hooks (pre-commit, commit-msg)
├── .vscode/                    # Shared editor settings
├── commitlint.config.ts        # Conventional commit rules
├── prettier.config.mjs         # Prettier (root + web)
├── .prettierignore
├── package.json                # Root tooling (Husky, lint-staged, commitlint, Prettier)
├── tsconfig.json               # TypeScript config for commitlint
├── .gitignore
└── README.md
```

## Apps

| App     | Stack                                                                                      | Docs                                     |
| ------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| **api** | Python 3.12, FastAPI, Uvicorn, uv, Pydantic, LangSmith, Ruff, Pyright, pytest              | [apps/api/README.md](apps/api/README.md) |
| **web** | Next.js 16, React 19, Tailwind CSS 4, ESLint, Vitest, Testing Library, Prettier (via root) | [apps/web/README.md](apps/web/README.md) |

## Quick start

### First time (repo root)

```bash
npm install
npm run prepare              # Husky hooks
npm run sync:api             # Python deps (apps/api)
cd apps/web && npm install   # Next.js deps
cp apps/api/.env.example apps/api/.env   # fill in secrets
```

### Run dev servers

| Command                 | What starts                       |
| ----------------------- | --------------------------------- |
| `npm run dev:api`       | API only — http://127.0.0.1:8000  |
| `npm run dev:web`       | Web only — http://localhost:3000  |
| `npm run dev:web:https` | Web only — https://localhost:3000 |
| `npm run dev`           | API + web (HTTP)                  |
| `npm run dev:https`     | API + web (HTTPS on web)          |

| URL                          | Description             |
| ---------------------------- | ----------------------- |
| http://127.0.0.1:8000/health | API health check        |
| http://127.0.0.1:8000/docs   | Swagger UI (local only) |
| http://localhost:3000        | Next.js app             |

## Design principles

- **Exact version pinning** for Python and dependencies (`==` in `pyproject.toml` + `uv.lock`).
- **Explicit upgrade windows** — bump Python/deps intentionally, retest, refresh lockfile.
- **Strict API contracts** — Pydantic request schemas with `extra="forbid"`.
- **Environment-aware behavior** — local vs production via `ENV` and Pydantic Settings.
- **Git discipline** — branch naming, conventional commits, pre-commit quality gate.
- **Static typing** — Pyright for API (`npm run typecheck:api`).
- **Monorepo scripts at root** — `dev`, `check`, `format` mirror the API pattern.

## Tooling overview

| Tool             | Role                                   | Scope             |
| ---------------- | -------------------------------------- | ----------------- |
| **uv**           | Python package manager, lockfile, venv | `apps/api`        |
| **Ruff**         | Lint + format                          | `apps/api`        |
| **Pyright**      | Static type checking                   | `apps/api`        |
| **pytest**       | API tests                              | `apps/api`        |
| **Vitest**       | Web unit tests                         | `apps/web`        |
| **ESLint**       | Lint                                   | `apps/web`        |
| **Prettier**     | Format                                 | root + `apps/web` |
| **Husky**        | Git hooks                              | monorepo root     |
| **lint-staged**  | Fix staged files on commit             | monorepo root     |
| **commitlint**   | Enforce commit message format          | monorepo root     |
| **concurrently** | Run API + web dev servers              | monorepo root     |

## Git hooks

### Pre-commit (`.husky/pre-commit`)

Runs on every `git commit`:

1. **Branch name validation** — blocks direct commits to `main`, `develop`, etc.
2. **lint-staged** — auto-fix staged files (see below)
3. **`npm run check`** — full-repo verify (read-only)

```
npm run check
  ├── format:check     Prettier (root + web)
  ├── check:web        ESLint + Vitest (apps/web)
  └── check:api        Ruff + Pyright + pytest
```

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

Run the hook manually:

```bash
sh .husky/pre-commit
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

| Script                    | What it does                                    |
| ------------------------- | ----------------------------------------------- |
| `npm run format`          | Prettier write (root + web)                     |
| `npm run format:check`    | Prettier check only                             |
| `npm run lint:api`        | Ruff fix + format on all API files              |
| `npm run lint:api:check`  | Ruff check + format check (API)                 |
| `npm run typecheck:api`   | Pyright                                         |
| `npm run test:api`        | pytest                                          |
| `npm run test:web`        | Vitest (`apps/web`)                             |
| `npm run check:api`       | `lint:api:check` + `typecheck:api` + `test:api` |
| `npm run lint:web`        | ESLint (`apps/web`)                             |
| `npm run lint:web:fix`    | ESLint with `--fix`                             |
| `npm run check:web`       | ESLint + Vitest                                 |
| `npm run check`           | `format:check` + `check:web` + `check:api`      |
| `npm run validate:branch` | Branch name check only                          |

### Setup

| Script             | What it does           |
| ------------------ | ---------------------- |
| `npm run sync:api` | `uv sync --dev` in API |

## CI (planned)

GitHub Actions will run the same gate as local hooks:

```bash
npm run check
```

Hooks are local-only today (`git commit --no-verify` skips them). CI is the remote safety net.

## Git

**Commit:** source, `pyproject.toml`, `uv.lock`, root `package.json` + `package-lock.json`, `apps/web/package.json` + `package-lock.json`, `.env.example`, `.vscode/`, `.husky/`, `commitlint.config.ts`, `prettier.config.mjs`, `.prettierignore`, `apps/web/vitest.config.ts`, `apps/web/vitest.setup.ts`

**Do not commit:** `.env`, `.venv/`, `node_modules/`, `__pycache__/`, `.ruff_cache/`, `.pytest_cache/`, `.next/`, `apps/web/.next/`

## Documentation

- API setup, schemas, env, tests: [apps/api/README.md](apps/api/README.md)
- Web app: [apps/web/README.md](apps/web/README.md)
