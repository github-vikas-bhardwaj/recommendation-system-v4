# API

Python HTTP API for the recommendation system. Built with **FastAPI**, served by **Uvicorn**, configured with **Pydantic Settings**.

## Planned stack (GenAI)

| Layer | Technology | Status |
|-------|------------|--------|
| HTTP API | FastAPI + Uvicorn | ✅ |
| Observability | LangSmith | ✅ installed |
| Chains / agents | LangChain, LangGraph | planned |
| Local LLM | Ollama + Gemma 4 E4B | planned |
| Frontend | Next.js (`apps/web`) | ✅ initial |
| Database | TBD (pool at app startup) | planned |

**Note:** LangServe is deprecated; this project uses **FastAPI routes + LangGraph** directly.

---

## Project structure

```
apps/api/
├── index.py                        # FastAPI app + routes
├── config/
│   └── settings.py                 # Pydantic Settings (env vars)
├── schemas/
│   ├── env/
│   │   └── env.py                  # Env enum (local / production)
│   └── requests/
│       └── recommendation.py       # Request body schemas
├── tests/
│   ├── conftest.py                 # TestClient fixture
│   ├── test_health.py
│   └── test_recommendations.py
├── pyproject.toml                  # deps + Ruff + Pyright + pytest config
├── uv.lock                         # lockfile (commit this)
├── .python-version                 # 3.12.12
├── .env                            # local secrets (gitignored)
├── .env.example                    # template (committed)
└── .venv/                          # local venv (gitignored)
```

---

## Prerequisites

- [uv](https://docs.astral.sh/uv/) package manager
- Python **3.12.12** (managed by uv via `.python-version`)
- [Node.js](https://nodejs.org/) (for monorepo git hooks at repo root)

## First-time setup

From repo root (recommended):

```bash
npm install
npm run prepare
npm run sync:api
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — add LANGSMITH_API_KEY, etc.
```

Or from `apps/api`:

```bash
cp .env.example .env
uv sync --dev
```

---

## Python version strategy

| File | Value | Role |
|------|-------|------|
| `.python-version` | `3.12.12` | Interpreter uv uses locally |
| `requires-python` | `==3.12.12` | Only supported Python version |

**Why exact pinning?**

- Dependencies may work on 3.12 but break on 3.13+.
- `uv.lock` pins packages, not the interpreter — Python must be pinned separately.
- Upgrades are deliberate: bump version → retest → refresh lockfile.

---

## Dependencies

### Current packages

| Package | Version | Type | Purpose |
|---------|---------|------|---------|
| `fastapi` | `0.139.0` | runtime | ASGI web framework |
| `uvicorn` | `0.49.0` | runtime | ASGI HTTP server |
| `pydantic-settings` | `2.14.2` | runtime | Typed env config |
| `python-dotenv` | `1.2.2` | runtime | Load `.env` into `os.environ` (LangSmith tracing) |
| `langsmith` | `0.9.7` | runtime | Tracing / observability |
| `pytest` | `9.1.1` | dev | Test runner |
| `httpx2` | `2.5.0` | dev | HTTP client (TestClient) |
| `ruff` | `0.15.20` | dev | Lint + format |
| `pyright` | `1.1.411` | dev | Static type checking |

### Install / sync

```bash
uv sync --dev
```

From repo root: `npm run sync:api`

### Adding packages (exact versions)

```bash
uv add --bounds exact <package>
uv add --group dev --bounds exact <package>
```

| `--bounds` | Example in `pyproject.toml` |
|------------|------------------------------|
| `lower` (default) | `package>=1.0` |
| `exact` | `package==1.0.0` |

Commit `uv.lock` after every dependency change.

---

## Architecture

### ASGI stack

```
Client  →  Uvicorn (ASGI server)  →  FastAPI (ASGI app)  →  routes / logic
```

| Piece | Role |
|-------|------|
| **ASGI** | Spec for async Python web apps |
| **Uvicorn** | HTTP server — runs the app |
| **FastAPI** | Routes, validation, OpenAPI |

Entry point: `index:app` → `app` in `index.py`.

### Validation layers

| Tool | Checks | When |
|------|--------|------|
| **Pydantic (requests)** | HTTP body shape / types | Per request (runtime) |
| **Pydantic Settings** | Env vars (`ENV`, API keys) | App startup |
| **Pyright** | Code types / logic errors | Dev + pre-push + CI (`API typecheck` job) |
| **Ruff** | Style, imports, common bugs | Dev + pre-commit (staged) + CI (`API lint` job) |
| **pytest** | API behavior | Dev + pre-push + CI (`API test` job) |

**Analogy (Next.js):** Pydantic ≈ Zod, Pyright ≈ `tsc`, Ruff ≈ ESLint + Prettier, pytest ≈ Vitest.

Web frontend tests: [apps/web/README.md](../web/README.md#tests-vitest).

---

## Environment configuration

### Local

1. Copy `.env.example` → `.env`
2. `load_dotenv()` in `config/settings.py` loads vars into `os.environ`
3. `Settings()` reads app config via Pydantic Settings (`ENV`, `LANGSMITH_*`)

```env
ENV=local
LANGCHAIN_TRACING_V2=true
LANGSMITH_API_KEY=ls_...
LANGSMITH_PROJECT=recommendation-system-v4
```

`LANGCHAIN_TRACING_V2` is read by the LangSmith SDK from `os.environ`. `LANGSMITH_*` keys are loaded into `Settings`.

### Production

No `.env` file on the server. Set the same variables on the host:

```env
ENV=production
LANGCHAIN_TRACING_V2=true
LANGSMITH_API_KEY=...
LANGSMITH_PROJECT=...
```

### `Env` enum

```python
# schemas/env/env.py
class Env(StrEnum):
    LOCAL = "local"
    PRODUCTION = "production"
```

Use `settings.is_local` / `settings.is_production` in application code.

### Environment-specific behavior

| Feature | `ENV=local` | `ENV=production` |
|---------|-------------|------------------|
| `/docs` (Swagger) | enabled | disabled |
| Validation errors | detailed 422 (planned) | generic message (planned) |

Simulate production locally:

```bash
ENV=production uv run uvicorn index:app --reload
```

---

## Request schemas (Pydantic)

`schemas/requests/recommendation.py`:

```python
class RecommendationRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")
    user_id: int = Field(alias="userId")
    show_ids: list[str] = Field(alias="showIds")
```

| Config | Purpose |
|--------|---------|
| `populate_by_name=True` | Accept `userId` or `user_id` in JSON |
| `extra="forbid"` | Reject unknown fields (strict contract) |

---

## API endpoints

### `GET /health`

```bash
curl http://127.0.0.1:8000/health
```

### `POST /recommendations`

```bash
curl -s -X POST http://127.0.0.1:8000/recommendations \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "showIds": ["show-101", "show-202"]}'
```

Snake_case also works: `{"user_id": 1, "show_ids": [...]}`.

Invalid body (wrong type, extra field) → **422** before your route runs.

---

## Running the server

From repo root:

```bash
npm run dev:api
```

Or from `apps/api`:

```bash
uv run uvicorn index:app --reload
```

| Flag | Meaning |
|------|---------|
| `index:app` | `app` object in `index.py` |
| `--reload` | Auto-restart on changes (**dev only**) |

---

## Tests (pytest)

Config in `pyproject.toml` under `[tool.pytest.ini_options]`.

```
tests/
├── conftest.py          # shared TestClient fixture
├── test_health.py       # GET /health
└── test_recommendations.py  # validation + happy path
```

### Commands

```bash
cd apps/api

uv run pytest              # run all tests
uv run pytest -v           # verbose
uv run pytest tests/test_health.py   # single file
```

From repo root:

```bash
npm run test:api
```

Tests use FastAPI `TestClient` — **no running server required**.

### What is covered

| Test | Asserts |
|------|---------|
| `test_health_returns_200` | `/health` returns 200 |
| `test_recommendations_valid_body` | valid JSON → 200 |
| `test_recommendations_rejects_extra_field` | extra key → 422 (`extra="forbid"`) |
| `test_recommendations_rejects_invalid_type` | wrong type → 422 |

---

## Ruff (lint + format)

Config in `pyproject.toml` under `[tool.ruff]`.

| Setting | Value | Meaning |
|---------|-------|---------|
| `target-version` | `py312` | Lint for Python 3.12 |
| `line-length` | `88` | Max line width |
| `indent-style` | `space` | 4 spaces per indent |
| `select` | `E`, `F`, `I`, `UP`, `B` | Style, bugs, import order, upgrades |

### Commands

```bash
uv run ruff check .                  # lint
uv run ruff check --fix .            # lint + auto-fix (import order)
uv run ruff format .                 # format
uv run ruff format --check .         # CI check (no writes)
```

From repo root:

```bash
npm run lint:api
```

### Pre-commit integration

On `git commit`, **lint-staged** runs Ruff on **staged** `apps/api/**/*.py` only:

```json
"apps/api/**/*.py": [
  "bash -c 'cd apps/api && uv run ruff check --fix \"$@\"' _",
  "bash -c 'cd apps/api && uv run ruff format \"$@\"' _"
]
```

### E402 / import order note

Imports stay at the top of each file. In `config/settings.py`, call `load_dotenv()` after imports and before `settings = Settings()` — not between imports in `index.py`.

---

## Pyright (static type checking)

Config in `pyproject.toml` under `[tool.pyright]`.

| Setting | Value | Meaning |
|---------|-------|---------|
| `pythonVersion` | `3.12` | Type-check for Python 3.12 |
| `typeCheckingMode` | `standard` | Balance of strictness vs noise |
| `venv` | `.venv` | Resolve third-party types from local venv |

### Commands

```bash
uv run pyright
```

From repo root:

```bash
npm run typecheck:api
```

Pyright runs via `npm run typecheck:api` or as part of `npm run check:api` (pre-push and CI).

**Analogy (Next.js):** Pyright ≈ `tsc`.

---

## LangSmith

LangSmith traces LangChain / LangGraph work — not plain FastAPI routes.

**Requires:**

1. `langsmith` package (installed)
2. `load_dotenv()` so `LANGCHAIN_TRACING_V2` and keys reach `os.environ` locally; host env vars in production
3. LangChain or `@traceable` code to trace

---

## IDE setup (Cursor / VS Code)

Root `.vscode/settings.json`:

| Setting | Purpose |
|---------|---------|
| `python.defaultInterpreterPath` | `apps/api/.venv/bin/python` |
| `python-envs.pythonProjects` | Registers `apps/api` as Python project |

Optional:

| Setting / extension | Purpose |
|---------------------|---------|
| `python.analysis.typeCheckingMode`: `"standard"` | Editor squiggles aligned with Pyright CLI |
| **Ruff** (`charliermarsh.ruff`) | Format/lint on save |

---

## Quality pipeline

### Local (manual)

Full monorepo check (same as pre-push):

```bash
npm run check
```

API only:

```bash
npm run check:api
```

Or individual steps:

```bash
npm run lint:api:check
npm run typecheck:api
npm run test:api
```

### Git hooks

```
pre-commit (fast)
  ├── validate:runtime   Node 22.22.1 (exact, .nvmrc) + Python 3.12.12
  ├── validate branch name
  ├── lint-staged        Ruff on staged .py files
  └── format:check

pre-push (full)
  └── npm run check:push
        ├── format:check
        ├── check:web
        └── check:api    ← Ruff + Pyright + pytest

commit-msg
  └── commitlint
```

### CI (GitHub Actions)

Parallel jobs: **API lint**, **API typecheck**, **API test** — see [root README](../../README.md#ci-github-actions).

---

## Database (planned)

DB connection pool created **once at app startup** (FastAPI `lifespan`), reused per request, closed on shutdown.

---

## Common commands

```bash
# Setup (repo root)
npm run sync:api

# Run (repo root)
npm run dev:api

# Quality (repo root)
npm run check              # full monorepo (Prettier + web + api)
npm run check:api          # ruff + pyright + pytest
npm run test:web           # Vitest (see apps/web/README.md)
npm run typecheck:api
npm run lint:api           # fix + format
npm run test:api

# From apps/api (fallback)
uv sync --dev
uv run uvicorn index:app --reload
uv run pytest
uv run ruff check --fix .
uv run ruff format .
uv run pyright
```
