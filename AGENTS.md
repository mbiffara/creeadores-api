# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the TypeScript API code; group handlers in `src/routes/`, domain logic in `src/services/`, and persistence utilities in `src/db/`.
- Shared DTOs and validation schemas belong in `src/models/` so request/response shapes stay consistent across agents.
- `tests/` mirrors `src/` with matching filenames (e.g., `src/services/user.ts` ⇢ `tests/services/user.test.ts`).
- `scripts/` stores maintenance helpers (seeding, migrations); `config/` keeps environment-specific JSON/YAML that should not contain secrets.

## Build, Test, and Development Commands
- `npm install` — sync dependencies (rerun after updating `package.json`).
- `npm run dev` — start the local API with hot reload via ts-node-dev.
- `npm run build` — emit production JavaScript into `dist/` and type-check the project.
- `npm test` — execute Jest suites once; add `--watch` while iterating locally.
- `npm run lint` — run ESLint/Prettier validation; commit only after this passes.

## Coding Style & Naming Conventions
- TypeScript, ECMAScript modules, 2-space indentation, single quotes, and trailing commas.
- Export one default per module; prefer named exports for shared utilities.
- Use PascalCase for classes, camelCase for functions/variables, UPPER_SNAKE_CASE for constants and env keys.
- Keep controllers thin: input validation → service call → response mapping with early returns.

## Testing Guidelines
- Jest with ts-jest; create one `.test.ts` per module under `tests/`.
- Mock external services (HTTP, queues) via `__mocks__/` to keep tests deterministic.
- Aim for ≥85% statement coverage; run `npm test -- --coverage` before opening a PR.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`). Imperative, <72 char subject, detailed body if behavior changes.
- Each PR should describe motivation, solution, and validation steps; attach issue IDs (`Closes #123`).
- Include screenshots or cURL examples when altering endpoints, and list new env vars in the description.

## Security & Configuration Tips
- Never commit `.env`; rely on `.env.example` to document required variables.
- Rotate API keys used in fixtures; use `scripts/seed.ts` to provision sanitized demo data.
- Validate every request payload via centralized schema middleware to prevent injection and inconsistent states.
