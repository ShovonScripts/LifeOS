# 02 — Architecture

## 1. Stack

| Area | Decision | Notes |
|------|----------|-------|
| Framework | Expo (latest stable SDK) + React Native, Hermes, New Architecture | Verify SDK at project start |
| Language | TypeScript `strict: true` | |
| Routing | Expo Router (file-based) | typed routes on |
| DB | `expo-sqlite` + **Drizzle ORM** | typed schema, migrations via drizzle-kit |
| Secrets | `expo-secure-store` | API keys only |
| Preferences | `expo-sqlite` `app_settings` table (single source) | avoid AsyncStorage |
| UI state | Zustand | UI/ephemeral only (filters, sheet state, timer) |
| Data hooks | Custom hooks + Drizzle `useLiveQuery` | SQLite stays source of truth |
| Forms | React Hook Form + Zod | schemas shared with AI validation |
| Lists | `@shopify/flash-list` | task/notes lists |
| Gestures/Anim | `react-native-gesture-handler`, `react-native-reanimated` | swipe, sheets |
| Sheets | `@gorhom/bottom-sheet` | quick add, pickers |
| Icons | `lucide-react-native` (or `@expo/vector-icons` if bundle matters) | one set only |
| Charts | `react-native-svg` + lightweight custom charts (victory-native optional) | |
| Dates | `date-fns` + `date-fns-tz`; recurrence `rrule` | |
| i18n | `i18next` + `expo-localization` | en, bn |
| Notifications | `expo-notifications` | channels, rolling window |
| Files | `expo-file-system`, `expo-sharing`, `expo-document-picker` | backup |
| Haptics | `expo-haptics` | subtle feedback |
| Tests | Jest + `jest-expo`, React Native Testing Library, Maestro (E2E) | |
| Quality | ESLint, Prettier, `tsc --noEmit`, Husky pre-commit | |
| Builds | EAS Build (APK for testing, AAB for store) | |
| Cloud later | Laravel 12 + Sanctum | not in v1 |

## 2. Layered design

```
UI (app/, src/components)           → renders, handles input only
Feature hooks (src/features/*/hooks)→ combine services + live queries for screens
Services / use-cases (src/features/*/service.ts)
                                    → business rules (streaks, recurrence, progress)
Repositories (src/db/repositories)  → the only place that touches Drizzle/SQL
SQLite                              → source of truth
AI layer (src/ai)                   → provider adapters, prompts, validation; no DB writes
```

Rules:

1. UI never imports Drizzle or SQL. Screens call hooks; hooks call services; services call repositories.
2. All mutations go through services; multi-table writes use a transaction.
3. AI returns **proposals** (validated objects). Only a user-confirmed service call writes them.
4. Pure logic (streaks, recurrence, parsing, progress) lives in `src/domain/` with zero React/RN imports so it is trivially unit-testable.
5. Errors are typed `AppError` (code, userMessage, cause). UI shows `userMessage`; logs omit secrets.
6. No feature depends on network or AI availability.

## 3. Folder structure

```
lifeos/
├── app/                          # Expo Router routes only (thin)
│   ├── _layout.tsx               # providers, fonts, db init, splash gate
│   ├── onboarding.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx           # 5 tabs + center quick-add
│   │   ├── index.tsx             # Today
│   │   ├── tasks.tsx
│   │   ├── calendar.tsx
│   │   ├── grow.tsx              # Habits | Goals segmented
│   │   └── notes.tsx
│   ├── task/[id].tsx
│   ├── project/index.tsx | [id].tsx
│   ├── habit/[id].tsx
│   ├── goal/[id].tsx
│   ├── note/[id].tsx
│   ├── event/[id].tsx
│   ├── search.tsx
│   ├── focus.tsx
│   ├── review.tsx                # weekly review
│   ├── ai/index.tsx | plan-preview.tsx
│   └── settings/
│       ├── index.tsx | appearance.tsx | notifications.tsx | data.tsx | language.tsx
│       └── ai/ index.tsx | provider.tsx | models.tsx | privacy.tsx
├── src/
│   ├── components/ui/            # Button, Card, Chip, Sheet, Input, Checkbox, ...
│   ├── components/{tasks,calendar,habits,goals,notes,dashboard}/
│   ├── domain/                   # pure TS: recurrence, streaks, parser, progress, dates
│   ├── features/{tasks,projects,habits,goals,notes,focus,calendar,search,review}/
│   │     ├── schema.ts           # Zod
│   │     ├── service.ts
│   │     └── hooks.ts
│   ├── db/
│   │   ├── client.ts
│   │   ├── schema/               # Drizzle tables
│   │   ├── migrations/
│   │   └── repositories/
│   ├── services/{notifications,backup,export,haptics,logger}/
│   ├── ai/{types.ts,registry.ts,router.ts,errors.ts,validation.ts,prompts/,providers/,features/}
│   ├── storage/{secure-secrets.ts,preferences.ts}
│   ├── store/                    # Zustand slices
│   ├── i18n/{index.ts,en.json,bn.json}
│   ├── theme/{tokens.ts,light.ts,dark.ts,typography.ts,useTheme.ts}
│   ├── hooks/ utils/ constants/
├── assets/{fonts,images,icons}
├── tests/{unit,integration,e2e}
├── docs/                         # copy of lifeos-docs
├── CLAUDE.md
├── app.json | eas.json | package.json | tsconfig.json
```

## 4. Time, dates and recurrence

- Instants (`due_at`, `completed_at`, `created_at`) are stored as **UTC ISO-8601** strings.
- Calendar days (habit logs, all-day items) use **`local_date` = `YYYY-MM-DD`** plus the habit's/user's timezone; never derive these from UTC.
- Recurrence uses **RRULE** strings with `DTSTART` + IANA timezone (`Asia/Dhaka`).
- Tasks: completing a recurring task marks it done and **creates the next occurrence** (series_id links them). Skipping creates the next without logging completion.
- Events: store the rule; expand occurrences lazily for the visible range.
- Habits: evaluate schedule by `local_date`; streak logic is pure (see `domain/streaks.ts`).
- On timezone change or app foreground: recompute upcoming reminders (rolling window).

## 5. Notifications architecture

- Channels: `reminders` (high), `habits` (default), `daily-summary` (low), `focus` (ongoing).
- Android 13+: request `POST_NOTIFICATIONS` at a contextual moment (first reminder set), not on launch.
- Exact alarms: use only if truly needed; otherwise inexact windows are acceptable for habits. Provide a settings explainer if exact alarm permission is required.
- Maintain a `reminders` table mirroring scheduled OS notifications (`notification_id`). A `reconcileReminders()` job runs at app start/foreground: cancels orphans, schedules missing items within a **rolling 14–30 day window**.
- Deleting/completing an entity cancels its reminders in the same transaction flow.
- OEM battery optimization guide in Settings → Notifications.

## 6. State and data flow

```
User action → UI handler → feature hook → service (validate with Zod)
   → repository (transaction) → SQLite → live query → UI re-renders
```

Zustand holds: selected filters, calendar view mode, quick-add draft, focus timer state, theme override. Nothing that must survive restarts lives only in Zustand.

## 7. Performance rules

- FlashList for any list > 30 items; stable `keyExtractor`; memoized row components.
- Avoid inline object/function props in list rows.
- Queries select only needed columns; indexes in doc 03.
- Defer non-critical init (notifications reconcile, AI registry) until after first render.
- Splash stays until fonts + DB migrations complete (target < 1.5 s).
- Animations on UI thread via Reanimated worklets; respect "reduce motion".

## 8. Error handling & logging

- `AppError` codes: `DB_ERROR`, `VALIDATION`, `NOT_FOUND`, `PERMISSION`, `AI_AUTH`, `AI_QUOTA`, `AI_TIMEOUT`, `AI_OFFLINE`, `AI_BAD_OUTPUT`, `BACKUP_INVALID`.
- Error boundary at root + per-route; "Something went wrong" screen with retry and export-logs-free recovery.
- Logger redacts anything matching key patterns; never logs prompts by default.
- Corrupt DB path: attempt integrity check, offer restore from last auto-backup.

## 9. Auto-backup

- Local rolling snapshot (last 3) on app background once per day, stored in app documents dir. Excludes secrets by construction (secrets never in SQLite).

## 10. Sync-readiness (no sync in v1)

Every syncable table has: `id` (UUIDv7/ULID), `created_at`, `updated_at`, `deleted_at`, `rev` (int), `device_id`, `sync_status` (`local` | `pending` | `synced`). No other sync code in v1.
