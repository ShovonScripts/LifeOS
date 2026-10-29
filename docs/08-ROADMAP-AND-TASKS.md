# 08 — Roadmap and Task Checklist

Order: Foundation → Core Productivity → Polish/UX → BYOK AI → QA → Release → (Optional) Sync.
Estimates assume one developer, ~15–20 focused hours/week; adjust to your pace.

| Phase | Goal | Est. |
|-------|------|------|
| 0 | Project setup & design tokens | 3–4 days |
| 1 | Foundation (DB, nav, UI kit) | 1–1.5 weeks |
| 2 | Core productivity | 3–4 weeks |
| 3 | Polish, i18n, notifications hardening | 1–1.5 weeks |
| 4 | BYOK AI | 2 weeks |
| 5 | QA & release | 1.5–2 weeks |
| 6 | Optional Laravel sync | separate milestone |

Definition of Done (every task): types pass (`tsc --noEmit`), lint passes, unit tests for domain logic, works offline, light + dark checked, TalkBack label present, empty/loading/error states handled, no console logs with user data.

---

## Phase 0 — Setup

- [ ] Create repo, Expo TypeScript project, Expo Router (doc 10)
- [ ] Configure strict TS, ESLint, Prettier, Husky, path aliases (`@/`)
- [ ] Add `CLAUDE.md` and copy docs into `/docs`
- [ ] EAS project + `eas.json` (development, preview APK, production AAB)
- [ ] Package ID, app name, adaptive icon placeholder, splash placeholder
- [ ] Theme tokens file from doc 04 (light + dark) + `useTheme`
**Accept:** `npx expo start` runs on a physical Android device; a preview APK builds.

## Phase 1 — Foundation

- [ ] Fonts loading (Latin + Bangla) with splash gate
- [ ] Drizzle schema (doc 03) + migration runner + DB client + PRAGMAs
- [ ] ID generator, clock utility (injectable for tests), `AppError`, logger with redaction
- [ ] Repositories skeleton + transaction helper
- [ ] `app_settings` store + `useSettings`
- [ ] UI kit v1: Button, Card, Chip, Input, Checkbox, SectionHeader, EmptyState, Skeleton, Snackbar, BottomSheet wrapper
- [ ] Tab layout (5 tabs + center FAB) and root error boundary
- [ ] i18n setup (en, bn) with typed keys
**Accept:** app boots in <2 s, migrations run on fresh install, dark mode toggle works, a "dev gallery" screen shows all components.

## Phase 2 — Core productivity

### 2.1 Tasks (week 1)
- [ ] Task schema/service/repository + Zod
- [ ] Task list (smart lists: Inbox/Today/Upcoming/Overdue/Done) with FlashList
- [ ] Quick Add sheet + smart parser (`domain/parser.ts` + tests)
- [ ] Task detail screen, subtasks, labels, priority, status
- [ ] Swipe actions, multi-select, undo snackbar
- [ ] Projects CRUD + project detail
**Accept:** create a task in ≤3 s; parser tests cover 30+ phrases (en + bn digits); undo works for complete/delete.

### 2.2 Recurrence + reminders (week 2)
- [ ] `domain/recurrence.ts` (RRULE next-occurrence, DST tests)
- [ ] Repeat picker UI (presets + custom)
- [ ] Notification service: channels, permission flow, reconcile job, rolling window
- [ ] Reminder UI on tasks/events; cancel on complete/delete
- [ ] Notification tap → deep link to entity
**Accept:** recurring task spawns next occurrence on completion; reminders fire after app kill and device reboot (physical device); changing timezone reschedules correctly.

### 2.3 Calendar (week 2–3)
- [ ] Month view + day agenda
- [ ] Week + day timeline views
- [ ] Events CRUD (incl. all-day, recurring) + expansion for visible range
- [ ] Tasks with due dates rendered in calendar
**Accept:** 1,000 tasks/events scroll smoothly; week-start setting respected.

### 2.4 Habits + goals (week 3)
- [ ] `domain/streaks.ts` + tests (skips, gaps, weekly targets, DST)
- [ ] Habit CRUD, one-tap check-in, count habits, history heatmap, charts
- [ ] Goals (milestone + numeric), progress, link tasks
**Accept:** streak tests pass for 20+ scenarios; unique `(habit_id, local_date)` enforced.

### 2.5 Notes, focus, dashboard, search (week 4)
- [ ] Notes CRUD, autosave, pin, search
- [ ] Focus timer + foreground notification + session history
- [ ] Today dashboard per doc 05
- [ ] Global search (FTS5 or LIKE fallback)
- [ ] Weekly review screen
**Accept:** dashboard renders in <300 ms with 500 tasks; focus timer survives backgrounding.

### 2.6 Data safety
- [ ] Export JSON/CSV; import/restore with validation, merge/replace
- [ ] Auto-backup rotation (last 3)
- [ ] Clear-all-data flow
**Accept:** export → clear → restore yields identical data (automated round-trip test).

## Phase 3 — Polish

- [ ] Onboarding + sample project
- [ ] Empty/error/loading states audit across all screens
- [ ] Haptics, micro-animations, reduce-motion handling
- [ ] Accessibility pass with TalkBack
- [ ] Bangla translation review; Bangla numerals option
- [ ] Performance pass (profiling, bundle audit)

## Phase 4 — BYOK AI

- [ ] SecureStore secret manager (add/replace/delete/mask)
- [ ] `AIError`, error mapping, timeout/abort util, usage logger
- [ ] Adapters: Gemini, OpenAI, OpenRouter, openai-compatible (+ tests with mocked fetch)
- [ ] Registry/router + settings UI (provider, model, test connection, limits)
- [ ] Prompt templates + Zod schemas + repair attempt
- [ ] Preview UI + `applyProposals` transaction
- [ ] Features: daily plan → goal breakdown → prioritize → summarize notes → chat
- [ ] AI privacy explainer + "what will be sent" disclosure
**Accept:** each provider passes the doc 06 test matrix; no key in logs/backups; app fully usable with AI unconfigured.

## Phase 5 — QA and release

- [ ] Full test plan (doc 09)
- [ ] Physical device matrix testing
- [ ] Security audit checklist (doc 07 §8)
- [ ] Final icon, splash, screenshots, feature graphic
- [ ] Privacy policy page, Play listing, Data Safety form
- [ ] Release AAB signed; internal testing track → closed testing (Play requires testing for new personal accounts — check current Play requirements) → production
**Accept:** release criteria in doc 09 all green.

## Phase 6 — Optional cloud sync (separate milestone)

- [ ] Sync design doc (conflict policy: per-field last-write-wins by `rev`/`updated_at`, tombstones)
- [ ] Laravel 12 API + Sanctum, per-user isolation, `/sync/pull` + `/sync/push`
- [ ] Client sync queue, retry/backoff, deletion propagation
- [ ] Encrypted credential sync only if explicitly designed (default: never sync keys)

## v1.1 candidates (frozen backlog)

Anthropic provider · home-screen widget · board view · saved filters · biometric lock · templates · drag-to-reschedule · Material You colors · AI weekly review summary.

## Weekly rhythm

Mon: plan sprint tasks · Tue–Thu: build · Fri: test on device + fix · Sat: refactor/docs · Keep a `CHANGELOG.md`.
