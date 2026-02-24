# track-shan

Simple personal tracking app for:
- Daily check-ins (mood, stress, sleep quality + duration, productivity, energy, coffee cups + last cup time, late meal)
- Weight entries
- Exercise sessions
- Quick stats and charts

Built as a single-user Next.js app with no auth.

## Stack

- Next.js App Router
- TypeScript
- Postgres (Neon managed database)
- Drizzle ORM + Drizzle Kit
- TanStack Query
- Tailwind CSS + shadcn/ui + Recharts
- Zod for validation

## Features

- Add, edit, delete weight entries
- Add, edit, delete exercise entries
- Add, update, delete daily check-ins
- Paginated lists
- Weight stats (trend, rolling averages, recent changes)
- Exercise stats (volume windows, streak, effort summary)
- Daily check-in stats and distributions (30d/60d/90d/1y)
- Chart views for both domains

## Getting started

1. Install dependencies:

```bash
bun install
```

2. Configure environment variables:

```bash
DATABASE_URL=postgresql://...
DATABASE_URL_DIRECT=postgresql://...
```

`DATABASE_URL` should be your pooled Neon URL (runtime), and `DATABASE_URL_DIRECT` should be the direct URL (migrations).

3. Create/update schema in Postgres:

```bash
bun run db:push
```

4. Start dev server:

```bash
bun run dev
```

Open `http://localhost:3000`.

## Available scripts

- `bun run dev` - start dev server
- `bun run build` - production build
- `bun run start` - run production server
- `bun run lint` - ESLint
- `bun run typecheck` - TypeScript checks
- `bun run db:push` - push schema to configured Postgres DB
- `bun run db:generate` - generate Drizzle artifacts
- `bun run db:migrate` - apply migrations
- `bun run db:studio` - open Drizzle Studio
- `bun run test` - run unit tests (Vitest)
- `bun run test:e2e` - run E2E tests (Playwright)
- `bun run playwright:install` - install Playwright Chromium

## Testing

### Unit tests (Vitest)

```bash
bun run test
```

### E2E tests (Playwright)

Playwright tests run full browser CRUD flows and reset DB tables before each test for deterministic runs.

Safety gates:
- Set `ALLOW_TEST_DB_RESET=true` when running E2E tests.
- Set a dedicated test database URL (`TEST_DATABASE_URL` and/or `TEST_DATABASE_URL_DIRECT`).
- E2E reset does not use `DATABASE_URL` fallback.
- When schema changes, push schema to test DB before running e2e.

```bash
bun run playwright:install
TEST_DATABASE_URL=postgresql://...
TEST_DATABASE_URL_DIRECT=postgresql://...
ALLOW_TEST_DB_RESET=true bun run test:e2e
```

## Makefile

Common workflows are available via `Makefile`:

```bash
make help
make install
make dev
make test
make test-e2e ALLOW_TEST_DB_RESET=true TEST_DATABASE_URL=postgresql://... TEST_DATABASE_URL_DIRECT=postgresql://...
make db-push
make clean
```

## Data model

`src/db/schema.ts` defines:
- `weight_entries`
- `exercise_entries`

## API overview

Weight:
- `GET /api/weight`
- `POST /api/weight`
- `GET /api/weight/:id`
- `PUT /api/weight/:id`
- `DELETE /api/weight/:id`
- `GET /api/weight/stats`
- `GET /api/weight/chart`

Exercise:
- `GET /api/exercise`
- `POST /api/exercise`
- `GET /api/exercise/:id`
- `PUT /api/exercise/:id`
- `DELETE /api/exercise/:id`
- `GET /api/exercise/stats`
- `GET /api/exercise/chart`

Check-in:
- `GET /api/checkin`
- `PUT /api/checkin`
- `DELETE /api/checkin?date=YYYY-MM-DD`

## Deploy notes

The app is intentionally simple and unauthenticated. That is fine for personal use, but public endpoints should still have guardrails.

### Protecting endpoints without auth

Useful options, from easiest to strongest:

1. Edge rate limiting (recommended baseline)
- Apply per-IP limits on write endpoints (`POST`, `PUT`, `DELETE`) at CDN/WAF level.
- Keep read endpoints looser, write endpoints stricter.

2. App-level rate limit
- Add route/middleware checks with a shared store (for example Redis-backed counters) for finer limits.
- Useful when you want custom keys (IP + route + method).

3. Bot challenge on writes
- Add CAPTCHA/Turnstile only before mutating actions.
- Good at reducing scripted abuse while keeping UX simple.

4. Request hardening
- Enforce method allow-lists, payload size limits, strict schema validation (already using Zod), and CORS rules if needed.

5. Monitoring + alerting
- Track spikes in 4xx/5xx and request volume.
- Alert on abnormal write traffic.

### Practical baseline for this app

If you keep no auth, a pragmatic setup is:
- Edge rate limiting for `/api/*`
- Stricter limits for `POST`/`PUT`/`DELETE`
- Optional bot challenge for create/update actions
- Basic request logging and alerts

That keeps the app simple while making abuse materially harder.
