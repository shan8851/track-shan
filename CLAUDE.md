# track-shan

Personal single-user tracking dashboard.

## Stack

- Next.js 15 App Router + TypeScript (strict)
- Drizzle ORM + SQLite (better-sqlite3)
- TanStack Query for server state
- Tailwind CSS + shadcn/ui
- Zod for validation
- bun as package manager

## Scripts

- `bun dev` — start dev server
- `bun run typecheck` — type check
- `bun run lint` — lint
- `bun db:push` — push schema to DB
- `bun db:generate` — generate migrations
- `bun db:migrate` — run migrations
- `bun db:studio` — open Drizzle Studio

## Theme

Terminal/IDE dark theme. JetBrains Mono font. Zero border-radius (sharp edges). Terminal green (`hsl(140,70%,50%)`) as primary accent on near-black background.

## Architecture

Each tracking type (weight, exercise, future: sleep, mood) is self-contained with own:
- DB table in `src/db/schema.ts`
- Zod schema in `src/schemas/`
- Types in `src/types/`
- API routes in `src/app/api/`
- TanStack Query hooks in `src/hooks/`
- Components in `src/components/dashboard/`

Adding a new tracking type should not touch existing code.

## Conventions

- Pages orchestrate, components do the work
- Keep files under a few hundred lines
- Small composable components, focused hooks, pure utility functions
- `layout.tsx`, `page.tsx`, and `route.ts` use default exports (Next.js requirement). Define as named const, then `export default` at bottom.
- No tests in v1
