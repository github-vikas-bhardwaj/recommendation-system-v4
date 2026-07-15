# API contracts

Single source of truth for the **BFF ↔ API** HTTP boundary.

JSON Schema (and related operation / security docs) live here. TypeScript and Python models are **generated** — do not edit generated files by hand.

## Layout

```
packages/api-contracts/
├── schemas/           # Request / response JSON Schema (codegen input)
│   ├── recommendations.request.json
│   └── recommendations.response.json
├── security/          # Auth schemes (not codegen’d into body models)
│   ├── internal-api-key.json
│   └── bearer-jwt.json
├── operations/        # Per-endpoint method, path, schemas, security
│   └── recommendations.post.json
└── README.md
```

## Wire formats

### `POST /recommendations`

**Request body** (`recommendations.request.json`):

```json
{ "showIds": [1, 2, 3] }
```

- `showIds`: non-empty array of integers (`minItems: 1`)
- Identity is **not** in the body — it comes from the JWT `sub`

**Response body** (`recommendations.response.json`):

```json
{
  "recommendations": [
    { "showId": 123, "score": 98 },
    { "showId": 456, "score": 91 }
  ]
}
```

- `recommendations`: array of `{ showId, score }`
- `showId`: integer show id
- `score`: integer **0–100** (similarity percentage; not a `"98%"` string)

### Security (both required)

Documented in `operations/recommendations.post.json` (`security.allOf`):

| Header                          | Meaning                                         |
| ------------------------------- | ----------------------------------------------- |
| `X-Internal-Api-Key`            | Shared BFF ↔ API secret (`API_INTERNAL_SECRET`) |
| `Authorization: Bearer <token>` | Supabase user access token (ES256 via JWKS)     |

Issuer and JWKS URL are derived at runtime from `SUPABASE_URL` on the API (`{SUPABASE_URL}/auth/v1`).

## Codegen

From repo root:

```bash
npm run codegen:contracts
```

Runs `scripts/codegen-contracts.mjs`, which:

1. Globs `packages/api-contracts/schemas/*.json`
2. Generates **TypeScript types** + **Zod schemas** → `apps/web/lib/api/generated/`
3. Generates **Pydantic v2** models → `apps/api/schemas/generated/`
4. Formats outputs (Prettier / Ruff)

### Drift check (CI + `npm run check`)

```bash
npm run codegen:contracts:check
```

Regenerates and fails if `git diff` is non-empty under either generated folder.

## Workflow (new or changed endpoint)

1. Add / edit JSON Schema under `schemas/`
2. Add / update `operations/*.json` and `security/*` if auth or path changes
3. Run `npm run codegen:contracts`
4. Commit schema + generated files together
5. Point FastAPI / BFF at generated types (do not hand-write duplicate models)
6. Update contract / route tests

## Naming conventions

| Schema file         | TS                | Zod export          | Python module / class             |
| ------------------- | ----------------- | ------------------- | --------------------------------- |
| `foo.request.json`  | `foo.request.ts`  | `fooRequestSchema`  | `foo_request.py` / `FooRequest`   |
| `foo.response.json` | `foo.response.ts` | `fooResponseSchema` | `foo_response.py` / `FooResponse` |

Python fields use snake_case with camelCase JSON aliases (`--snake-case-field`).
