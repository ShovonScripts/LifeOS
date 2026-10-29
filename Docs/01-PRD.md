# 01 — Product Requirements Document (PRD)

## 1. Vision

One calm place to plan the day, build habits, track goals and capture notes — fast, private, offline. AI helps when you ask; the app never depends on it.

**Tagline ideas:** "Your life, one calm place." / "Plan less. Do more."

## 2. Principles

1. **Local-first:** SQLite is the source of truth. No account, no internet needed.
2. **Capture in under 3 seconds.**
3. **Today-first:** the home screen answers "what now?".
4. **AI is optional and supervised:** previews, confirmation, no destructive actions.
5. **Calm UI:** soft, spacious, purposeful motion, no noise.
6. **Private by default:** data stays on device; keys stay in SecureStore.

## 3. Target users

| Persona | Needs |
|---------|-------|
| Busy student / professional (primary) | Daily planning, deadlines, reminders, focus |
| Habit builder | Streaks, gentle reminders, history |
| Goal-driven creator/freelancer | Goals → milestones → tasks, notes |
| Privacy-minded power user | BYOK AI, no account, export data |

Primary market assumption: Android users in Bangladesh and South Asia (Bangla + English, mid-range devices, small APK, fast cold start).

## 4. Scope

### MVP (v1.0)

- Tasks: create/edit/complete/archive, priority, status, due date/time, subtasks, labels, projects, repeat rules, reminders, swipe actions, undo.
- Calendar: day / week / month, tasks with due dates + personal events, recurring events.
- Habits: daily / specific days / X per week, check-in, streaks, history, charts.
- Goals: numeric target or milestone-based, progress, linked tasks.
- Notes: plain/markdown-lite, pin, search, link to task/goal.
- Focus timer (Pomodoro-style) linked to a task, session history.
- Dashboard (Today) with progress ring, overdue, next up, habits due, optional AI plan card.
- Global search across tasks/notes/goals/habits.
- Notifications (task, event, habit reminders, daily summary).
- Backup/export/restore (JSON; CSV export for tasks).
- Settings: theme (light/dark/system), language, notifications, data, AI.
- BYOK AI: Gemini, OpenAI, OpenRouter, custom OpenAI-compatible; daily plan, goal breakdown, prioritize, summarize notes, chat.
- Onboarding (3 screens max) and a seeded sample project (deletable).

### v1.1+

- Anthropic provider, home-screen widget, quick-settings tile, weekly review with AI summary, templates, Material You dynamic color option, biometric lock, cloud sync (optional).

### Non-goals (v1)

- Accounts, cloud sync, collaboration, web app, iOS release (code stays portable; no iOS testing in v1), voice AI, attachments.

## 5. Functional requirements (summary)

| ID | Requirement | Priority |
|----|-------------|----------|
| F-TASK-1 | Create a task from Quick Capture with parsed date/priority/project | P0 |
| F-TASK-2 | Swipe right = complete, swipe left = reschedule/menu, with undo snackbar | P0 |
| F-TASK-3 | Repeat rules (daily/weekly/monthly/custom RRULE) | P0 |
| F-CAL-1 | Month grid with dot indicators, day agenda below | P0 |
| F-HAB-1 | One-tap check-in; streak; missed-day logic that respects schedule | P0 |
| F-GOAL-1 | Progress from milestones or numeric value | P0 |
| F-NOTE-1 | Autosave notes, pin, search | P0 |
| F-FOCUS-1 | Timer continues with app backgrounded (foreground notification) | P1 |
| F-AI-1 | Every AI write passes a preview with editable fields | P0 |
| F-DATA-1 | Restore validates schema version and rejects corrupt files safely | P0 |
| F-A11Y-1 | TalkBack labels, 48dp targets, dynamic font scaling | P0 |

## 6. Success metrics (for a local-first app, measured manually / opt-in only)

- Cold start < 2 s on a mid-range Android device.
- Quick-add to saved task ≤ 3 s.
- Release APK/AAB size target: < 40 MB (AAB split), investigate if above 60 MB.
- Crash-free sessions > 99.5% in testing.
- 0 plaintext secrets found in logs, backups, or storage during audit.

## 7. Risks & mitigations

| Risk | Mitigation |
|------|-----------|
| Notification reliability on aggressive OEM battery managers (Xiaomi, Oppo, Vivo, Samsung) | In-app guide to disable battery optimization; test on real devices; rolling reschedule on app open |
| Timezone/DST bugs in recurrence | UTC storage + IANA tz + `rrule`; unit tests for DST changes |
| AI JSON breaking | Zod validation, repair retry once, graceful error state |
| Scope creep | Strict phases; v1.1 list is frozen |
| APK bloat | Hermes, no unused libs, ABI split via AAB, audit with `expo-atlas` |
