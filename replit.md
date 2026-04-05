# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Artifacts

### Finance Dashboard (`artifacts/finance-dashboard`)
- **Preview**: `/` (root)
- **Stack**: React + Vite, Tailwind CSS v4, Recharts, Wouter, shadcn/ui
- **Features**:
  - Dashboard with summary cards, area/pie charts, recent transactions
  - Transactions page with search, filter by month/type/category, sort, CSV export
  - Insights page with bar chart comparisons, radar chart, category breakdowns, smart observations
  - Role-based UI (Admin: add/edit/delete; Viewer: read-only)
  - Dark mode + localStorage persistence
  - 47 pre-loaded mock transactions (Jan–Apr 2026)
- **State**: React Context API (`AppContext`) — role, theme, transactions, filters

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/finance-dashboard run dev` — run finance dashboard locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
