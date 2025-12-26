# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds all runtime TypeScript: route adapters in `src/routes/`, domain logic in `src/services/`, DB helpers in `src/db/`, and shared utilities in `src/lib/`.
- Contracts (DTOs, Zod/Joi schemas) live in `src/models/`; import them from controllers, services, and tests to avoid drift.
- Background workers reuse the same services and live in `src/workers/`. Configuration defaults stay in `src/config/`.
- `tests/` mirrors `src/` naming (`src/services/user.ts` → `tests/services/user.test.ts`). Fixtures and data builders live under `tests/fixtures/`.
- Automation scripts go into `scripts/` (migrations, seeding). Example payloads or media assets belong inside `assets/`.

## Build, Test, and Development Commands
- `npm install` — sync dependencies; rerun after editing `package.json` or `.nvmrc`.
- `npm run dev` — start the API with ts-node-dev hot reload and `.env.local` overrides.
- `npm run build` — compile to `dist/` and fail on type or lint errors.
- `npm test` / `npm test -- --watch` — run Jest once or continuously; append `--coverage` before a PR.
- `npm run lint` and `npm run format` — enforce ESLint + Prettier; CI blocks on failures.

## Coding Style & Naming Conventions
- TypeScript strict mode, ECMAScript modules, 2-space indent, single quotes, trailing commas. No `console.log` outside debug utilities.
- PascalCase classes, camelCase functions/variables, UPPER_SNAKE_CASE env keys, kebab-case file names.
- Keep services pure when possible and return POJOs from controllers to simplify serialization.

## Testing Guidelines
- Jest with ts-jest; create a `.test.ts` sibling for every module under `tests/`.
- Mock HTTP/queue calls via `__mocks__/` or `nock`; seed deterministic data with helpers in `tests/fixtures/`.
- Maintain ≥85% statement coverage and run `npm test -- --coverage` before pushing.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, etc.); subjects ≤72 chars, bodies explain context or breaking changes.
- PRs must describe the problem, outline the solution, list validation steps (tests, curl scripts, screenshots), and reference linked issues (`Closes #42`).
- Call out new env vars, migrations, or operational runbooks in a short “Deployment Notes” section.

## Security & Configuration Tips
- Never commit secrets; document required keys in `.env.example` and load actual values via the orchestrator.
- Rotate fixture tokens quarterly with `scripts/seed.ts` and clean local data via `scripts/reset-db.ts`.
- Guard every entrypoint with schema validation plus role checks; log structured audit events for writes.
