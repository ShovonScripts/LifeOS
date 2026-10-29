# 11 — Claude Code Prompts (copy-paste, phase by phase)

How to use: put `CLAUDE.md` in the repo root and the docs in `/docs`. Paste one prompt at a time, let Claude Code finish, run the checks, test on your device, commit, then move on. Each prompt tells it to read the relevant docs first.

Standard footer to append to every prompt:

> After finishing: run `npm run typecheck && npm run lint && npm test`, fix all errors, list the files you changed, and tell me exactly how to verify on my Android device. Do not add dependencies I did not approve.

---

## P0 — Bootstrap

```
Read CLAUDE.md and docs/02-ARCHITECTURE.md, docs/10-SETUP-GUIDE.md.
Set up the project skeleton exactly as specified: folder structure, tsconfig (strict, @/ alias), ESLint + Prettier + Husky/lint-staged, jest-expo, app.json (package com.prodo.lifeos), eas.json, and package scripts.
Create src/theme/tokens.ts, light.ts, dark.ts, typography.ts and useTheme() from docs/04-UIUX-DESIGN-SYSTEM.md.
Add a temporary "dev gallery" route that renders the theme tokens in light and dark.
```

## P1a — Database layer

```
Read docs/03-DATABASE.md and docs/02-ARCHITECTURE.md (sections 2, 4, 10).
Implement the Drizzle schema for ALL tables, generate the first migration, create src/db/client.ts (WAL + foreign keys), a migration runner used in app/_layout.tsx behind the splash screen, a transaction helper, ULID id generator, an injectable clock, AppError, and a redacting logger.
Create typed repositories for projects, tasks, subtasks, labels, and app_settings with soft delete and rev/updated_at handling.
Write integration tests against a temporary SQLite database covering migrations, CRUD, soft delete, and the habit_logs unique constraint.
```

## P1b — UI kit and navigation

```
Read docs/04-UIUX-DESIGN-SYSTEM.md and docs/05-SCREENS-AND-FLOWS.md (sections 1, 15).
Build the UI kit: Button, IconButton, Card, Chip, Input, Checkbox (animated, priority ring), SectionHeader, EmptyState, Skeleton, Snackbar (with undo), ConfirmDialog, BottomSheet wrapper, ProgressRing, ProgressBar.
Implement the 5-tab layout with the center gradient FAB, safe-area/edge-to-edge handling, i18n (en + bn files with typed keys), and a root error boundary.
All components: theme tokens only, accessibility labels, 48dp targets, light/dark verified. Update the dev gallery to show every component and state.
```

## P2.1 — Tasks

```
Read docs/05 §4–6 and docs/03.
Implement the full Tasks feature: Zod schemas, service, hooks with live queries, smart lists (Inbox/Today/Upcoming/Overdue/Done), FlashList rows (TaskCard), Task detail with subtasks/labels/priority/status, Projects CRUD.
Build the Quick Add sheet with the offline smart parser in src/domain/parser.ts (tomorrow 5pm, next monday, in 2 hours, !high, #project, @label, every weekday; support Bangla digits). Include at least 30 unit tests.
Swipe actions (right=complete, left=reschedule/more), long-press multi-select, undo snackbar for complete/delete.
```

## P2.2 — Recurrence and notifications

```
Read docs/02 §4–5 and docs/09 §5.
Implement src/domain/recurrence.ts using rrule with IANA timezones (next occurrence, DST-safe) and unit tests (daily, weekly, monthly on 31st, weekdays, end conditions, DST transitions).
Task completion of a recurring task creates the next occurrence in the same transaction.
Implement the notification service: Android channels, contextual POST_NOTIFICATIONS request, reminders table mirroring, reconcileReminders() with a rolling 14–30 day window run at app start/foreground, cancel on complete/delete, tap → deep link.
Add the Repeat picker and Reminder UI. Provide a manual test checklist for physical devices.
```

## P2.3 — Calendar

```
Read docs/05 §7.
Implement events CRUD (incl. all-day, recurring with lazy expansion), Month view with dots + day agenda, Week and Day timeline views with a now indicator, tasks with due dates shown on the calendar, week-start setting. Optimize for 1,000+ items. Tapping an empty slot opens Quick Add prefilled.
```

## P2.4 — Habits and goals

```
Read docs/05 §8 and docs/03 (habits, habit_logs, goals, goal_milestones).
Implement src/domain/streaks.ts (daily, specific days, X per week, skipped vs missed, count habits, schedule changes) with 20+ unit tests.
Build the Grow tab (segmented Habits | Goals), one-tap check-in, count stepper, habit detail with heatmap and completion rates, goals with milestone and numeric progress, linking tasks to goals.
```

## P2.5 — Notes, focus, dashboard, search, review

```
Read docs/05 §3, 9–12.
Implement Notes (autosave debounce, pin, search, link to task/goal/project), Focus timer (presets, foreground notification, session logging), the Today dashboard exactly as specified (hero progress card, overdue strip, grouped tasks, events, habits due, focus summary), global search (FTS5 if available else LIKE), and the Weekly Review screen that can save to a note.
```

## P2.6 — Backup and export

```
Read docs/03 §6 and docs/07 §5.
Implement JSON export, CSV task export, auto-backup rotation (last 3, daily), restore with full Zod validation + schemaVersion check + summary + Replace/Merge in one transaction, and Clear-all-data with typed confirmation (also wipes SecureStore keys and scheduled notifications).
Write an automated round-trip test: seed → export → clear → restore → deep-equal. Ensure secrets are never exported.
```

## P3 — Polish

```
Implement onboarding (docs/05 §2) with the sample project, then audit every screen for empty/loading/error states, haptics, reduce-motion, TalkBack labels, dynamic font scaling to 200%, and Bangla layout (line-height, string length). Produce a checklist of what you changed and what still needs manual device checks.
```

## P4a — AI foundation

```
Read docs/06-AI-BYOK-SPEC.md and docs/07-SECURITY-PRIVACY.md.
Implement src/storage/secure-secrets.ts (add/replace/delete/mask), src/ai/types.ts, errors.ts with the error→message mapping, a fetch wrapper with timeout + AbortController + response size cap, and a usage logger (no prompts, no keys).
Implement adapters: gemini (native API), openai, openrouter, openai-compatible (HTTPS validation, no cross-origin redirects). Check each provider's CURRENT official API docs before coding and mention anything that differs from the spec. Add unit tests with mocked fetch for request shape, headers, errors, token extraction.
```

## P4b — AI settings UI

```
Build Settings → AI per docs/05 §13: provider cards, key entry (masked, paste, last-4 display), model entry + refresh list where supported, custom base URL with host confirmation, Test connection (maxOutputTokens 8), Replace/Delete key, limits (max output tokens, usage warning), fallback toggle (off), AI privacy explainer, usage log view with clear.
The app must remain fully usable with nothing configured.
```

## P4c — AI features and preview

```
Implement src/ai/prompts, Zod schemas from docs/06 §6, the router (one repair attempt max, no unbounded retries, no auto fallback unless enabled), and features: generateDailyPlan, breakDownGoal, prioritizeTasks, summarizeNotes, chatWithLifeOS.
Build the Preview screen (editable, selectable proposals) and a transactional applyProposals service creating tasks with source='ai' and an Undo snackbar. Add prompt-injection defenses (delimited user data, server-side validation of IDs/dates).
Write tests with good, malformed, oversized and malicious JSON fixtures.
```

## P5 — QA and release hardening

```
Read docs/07 §8 and docs/09.
Run a security/privacy audit of the codebase: search for secrets, console.log of user data, cleartext traffic, unvalidated AI output paths, key leakage in backups. Report findings with file/line and fix them.
Then produce: a release checklist status, a bundle-size analysis with recommendations, and the Play Store Data Safety answers based on the actual code.
```

## Utility prompts

**Bug audit**
```
Audit the <feature> implementation against docs/<N>. List bugs and spec deviations by severity with file/line references. Fix P0/P1 issues, add regression tests, and list remaining items.
```

**Refactor**
```
Refactor <area> to follow CLAUDE.md architecture rules without changing behavior. Keep tests green; show a before/after dependency summary.
```

**UI review**
```
Review <screen> against docs/04 and docs/05: tokens, spacing, touch targets, accessibility, dark mode, empty/error/loading states, Bangla text length. Fix issues and list them.
```
