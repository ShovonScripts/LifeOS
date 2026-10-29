# CLAUDE.md — LifeOS project rules

LifeOS is an Android-first, local-first productivity app (Expo + React Native + TypeScript). Full specs live in `/docs` (01–10). Read the relevant doc before implementing a feature.

## Stack
Expo (latest stable SDK), Expo Router, TypeScript strict, expo-sqlite + Drizzle ORM, expo-secure-store, Zustand (UI state only), React Hook Form + Zod, expo-notifications, i18next, date-fns(-tz), rrule, FlashList, Reanimated, gorhom bottom-sheet.

## Architecture rules (non-negotiable)
1. UI never touches SQL/Drizzle. Flow: screen → hook → service → repository → SQLite.
2. All mutations go through services; multi-table writes use a transaction.
3. SQLite is the source of truth. Zustand holds only ephemeral UI state.
4. Pure logic (recurrence, streaks, parser, progress, dates) lives in `src/domain/` with no React/RN imports and has unit tests.
5. Core features must work with no internet, no account, and no AI configured.
6. AI output is only ever a validated *proposal* shown in a preview; never write to the DB or run actions directly from AI output.
7. API keys live only in SecureStore. Never in settings, logs, backups, source, or Zustand.
8. Dates: instants as UTC ISO-8601; calendar days as `YYYY-MM-DD` `local_date`; recurrence as RRULE + IANA timezone.
9. Syncable tables carry `created_at, updated_at, deleted_at, rev, device_id, sync_status`. Use soft delete.

## Code conventions
- TypeScript strict, no `any` (use `unknown` + Zod). Path alias `@/` → `src/`.
- Components: function components, small, memoized list rows, no inline objects in list items.
- Styling: use theme tokens from `src/theme`; no hard-coded colors/spacings in components.
- Every interactive element has `accessibilityRole`/`accessibilityLabel`; touch targets ≥ 48dp.
- All user-visible strings via i18n keys (en + bn).
- Every screen handles loading, empty, error states.
- No `console.log` of user data, prompts, or secrets. Use `logger`.
- Errors: throw/return `AppError` with `userMessage`; never show raw errors to users.
- Keep files focused (< ~300 lines); extract hooks/components.

## Workflow
- Before coding: restate the task, list files to touch, follow the doc's acceptance criteria.
- After coding: run `npm run typecheck && npm run lint && npm test`; add/adjust tests for domain logic.
- Do not add dependencies without a short justification (APK size matters). Use `npx expo install` for native packages.
- Do not invent APIs: check current Expo/provider docs when unsure.
- Small commits with Conventional Commit messages.

## Do not
- Add analytics/tracking, accounts, or cloud calls in v1.
- Hard-code AI model lists or auto-fallback between providers.
- Execute or render AI output as code/HTML.
- Store secrets in `app.json`, `.env` committed files, or SQLite.
