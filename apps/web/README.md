# Web

Next.js frontend for the recommendation system.

## Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Framework | Next.js 16                            |
| UI        | React 19                              |
| Styling   | Tailwind CSS 4                        |
| Lint      | ESLint 9                              |
| Test      | Vitest + React Testing Library        |
| Format    | Prettier (root `prettier.config.mjs`) |

## First-time setup

From repo root:

```bash
npm install
npm run prepare              # Husky hooks
cd apps/web && npm install
```

## Run dev server

From repo root (recommended):

| Command                 | URL                    |
| ----------------------- | ---------------------- |
| `npm run dev:web`       | http://localhost:3000  |
| `npm run dev:web:https` | https://localhost:3000 |
| `npm run dev`           | API + web together     |

Or from `apps/web`:

```bash
npm run dev
npm run dev:https   # next dev --experimental-https (local self-signed cert)
```

HTTPS is for local dev only (OAuth, secure cookies, etc.). Production HTTPS is handled by the host (e.g. Vercel).

## Quality

### From repo root

| Command                | What it does                         |
| ---------------------- | ------------------------------------ |
| `npm run lint:web`     | ESLint                               |
| `npm run lint:web:fix` | ESLint with `--fix`                  |
| `npm run test:web`     | Vitest single run (hooks / CI)       |
| `npm run check:web`    | ESLint + Vitest                      |
| `npm run format`       | Prettier (whole monorepo)            |
| `npm run check`        | Prettier + `check:web` + `check:api` |

### From `apps/web`

| Command            | What it does        |
| ------------------ | ------------------- |
| `npm run lint`     | ESLint              |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run test`     | Vitest watch mode   |
| `npm run test:run` | Vitest single run   |
| `npm run check`    | lint + `test:run`   |

**Config files:**

- ESLint: `eslint.config.mjs` (Next.js core-web-vitals, react-hooks, simple-import-sort, eslint-config-prettier)
- Prettier: root `prettier.config.mjs` (includes `prettier-plugin-tailwindcss`)

---

## Tests (Vitest)

Config in `vitest.config.ts`; setup in `vitest.setup.ts` (`@testing-library/jest-dom`, cleanup after each test).

**Test file pattern:** `**/*.{test,spec}.{ts,tsx}` (e.g. `app/page.test.tsx`).

### Commands

```bash
# from repo root
npm run test:web

# from apps/web
npm run test        # watch
npm run test:run    # single run (CI / pre-commit via npm run check)
```

### Example

`app/page.test.tsx` renders the home page and mocks `next/image`:

```tsx
vi.mock("next/image", () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} alt={props.alt} />
  ),
}));

render(<Home />);
expect(
  screen.getByRole("heading", { name: /to get started/i }),
).toBeInTheDocument();
```

### Limits

Vitest works for **Client Components**, sync code, hooks, and utilities.

**Async Server Components** are not supported in unit tests — use E2E (Playwright, planned) for full page flows that depend on server rendering.

**Analogy (API):** Vitest ≈ pytest, React Testing Library ≈ FastAPI TestClient for UI.

---

## Project structure

```
apps/web/
├── app/
│   ├── page.tsx
│   ├── page.test.tsx       # colocated unit test
│   ├── layout.tsx
│   └── globals.css
├── public/
├── eslint.config.mjs
├── vitest.config.ts
├── vitest.setup.ts
├── next.config.ts
├── package.json
└── tsconfig.json
```

## Docs

- Monorepo tooling, hooks, scripts: [../../README.md](../../README.md)
- API: [../api/README.md](../api/README.md)
