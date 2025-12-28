# CREEADORES API

Express + Prisma API for orchestrating creator collaborations between brands, agencies, and UGC talent. PostgreSQL stores the transactional data, Redis + Sidekiq handle background notifications.

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+ with a Sidekiq worker configured to read the same queue names defined in `.env`.

## Setup
1. Install dependencies: `npm install` (already done in this repo).
2. Duplicate `.env.example` to `.env` and adjust credentials.
3. Apply migrations: `npx prisma migrate dev --name init` (or `npm run prisma:migrate`).
4. Generate the Prisma client if the schema changes: `npx prisma generate`.
5. Start the dev server: `npm run dev` (listens on `PORT`, default `4000`).

## Key Commands
- `npm run dev` — ts-node-dev watcher.
- `npm run build` — emit compiled JavaScript to `dist/`.
- `npm run start` — run the compiled build.
- `npm run lint` — type-check only.
- `npm run prisma:migrate` — run Prisma migrations interactively.

## API Surface
Base URL: `http://localhost:4000/api`
- `GET /health` (no `/api` prefix) — basic service heartbeat with timestamp.
- `POST /brands` — create a brand.
- `GET /brands` — list the latest brands.
- `POST /users` — email + password sign-up (name derived from email, returns profile without password hash).
- `POST /users/google` — Google token sign-up (body uses `token`, creates a user from Google profile info).
- `GET /users` — list the latest users.
- `POST /creators` + `GET /creators` — register and search for creators by `niche` or `search` query.
- `POST /campaigns` + `GET /campaigns` — manage briefs for each brand.
- `POST /collaborations` — invite a creator to a campaign; enqueues a Sidekiq job for asynchronous outreach.
- `GET /collaborations` — review invites per campaign or creator.

## Sidekiq Integration
The API never executes jobs itself; it serializes payloads that are Sidekiq-compatible and pushes them to `queue:<SIDEKIQ_DEFAULT_QUEUE>` via Redis. Configure a Ruby worker (e.g., `Notifications::CreatorInviteWorker`) to pop those jobs and deliver communication or other long-running tasks.
