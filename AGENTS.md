# AGENTS.md

This repository's engineering rules live in [CLAUDE.md](./CLAUDE.md). Read it before making
changes. Product specs are in [`docs/`](./docs); start with `00-README.md`, then
`02-ARCHITECTURE.md` and the doc for the feature you are touching.

Non-negotiables, repeated for quick reference:

- UI → hook → service → repository → SQLite. No SQL/Drizzle in screens.
- Pure logic lives in `src/domain/` with unit tests and no React/RN imports.
- SQLite is the source of truth; Zustand holds transient UI state only.
- API keys only in SecureStore; never in logs, backups, SQLite, or source.
- AI output is a validated proposal shown in a preview, never applied directly.
- After changes run: `npm run typecheck && npm run lint && npm test`.
