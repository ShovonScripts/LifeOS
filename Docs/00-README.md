# LifeOS — Project Documentation

Android-first · Local-first · Optional BYOK AI · Expo + React Native + TypeScript

LifeOS is a calm, fast personal productivity app: tasks, calendar, habits, goals, notes and focus in one place. Everything works offline with no account. AI is an optional layer powered by the user's own API key.

## Doc map (read in this order)

| # | File | Purpose |
|---|------|---------|
| 00 | `00-README.md` | This index + what changed from the original blueprint |
| 01 | `01-PRD.md` | Vision, users, scope, features, success metrics |
| 02 | `02-ARCHITECTURE.md` | Stack, layers, folder structure, conventions |
| 03 | `03-DATABASE.md` | SQLite schema (SQL), indexes, migrations, backup format |
| 04 | `04-UIUX-DESIGN-SYSTEM.md` | Principles, tokens, typography, components, motion, a11y |
| 05 | `05-SCREENS-AND-FLOWS.md` | Every screen, user flows, states, gestures |
| 06 | `06-AI-BYOK-SPEC.md` | Provider adapters, prompts, JSON schemas, preview flow |
| 07 | `07-SECURITY-PRIVACY.md` | Threat model, key handling, privacy policy points |
| 08 | `08-ROADMAP-AND-TASKS.md` | Phases, milestones, task checklist with acceptance criteria |
| 09 | `09-TESTING-QA-RELEASE.md` | Test plan, device matrix, release checklist |
| 10 | `10-SETUP-GUIDE.md` | Commands, dependencies, config to bootstrap the repo |
| 11 | `11-AI-CODING-PROMPTS.md` | Copy-paste prompts for Claude Code, phase by phase |
| — | `CLAUDE.md` | Drop in the repo root so Claude Code follows project rules |

## What I improved over the original blueprint

1. **Navigation reduced from 6 tabs to 5 + a center quick-add.** Six tabs is crowded on small Android screens. Habits and Goals are merged into one "Grow" tab; Settings and AI move to the Today header.
2. **Quick Capture is the core interaction.** One sheet, one text field, smart parsing ("call Rahim tomorrow 5pm !high #work") so adding a task takes under 3 seconds.
3. **Drizzle ORM on top of expo-sqlite** for typed queries and generated migrations (the blueprint's hand-written SQL repositories remain as the pattern, just typed).
4. **Recurrence is specified properly:** RFC 5545 RRULE via the `rrule` library, stored with an IANA timezone; next occurrence is spawned on completion for tasks, evaluated by date for habits.
5. **Notification strategy for Android:** channels, Android 13 permission flow, exact-alarm handling, and a rolling reschedule window instead of scheduling everything forever.
6. **Bangla + English from day one.** i18n with `i18next`, Bangla-capable font (Hind Siliguri / Noto Sans Bengali), optional Bangla numerals, localized dates.
7. **AI output is contract-driven.** Every AI feature has a Zod schema; one automatic repair attempt at most; always previewed before writing to SQLite.
8. **Design system with real tokens** including dark palette, contrast fixes (the blueprint's secondary text color is slightly under AA for small text), motion rules and accessibility targets.
9. **Added an Insights/Review loop** (weekly review) and **Today-first** dashboard logic: "what should I do next" instead of a passive list.
10. **Backups:** versioned JSON export with Zod-validated restore; keys are never included.
11. **Phased plan with acceptance criteria per task**, plus Claude Code prompts so you can build phase by phase.

## Decisions to confirm before coding

- App name / package ID (suggested: `com.prodo.lifeos`).
- Use the latest stable Expo SDK at project start (check `npx create-expo-app@latest`).
- Anthropic (Claude) as a 5th optional provider after v1 (see doc 06).
- Whether Bangla UI ships in v1 (recommended: yes, string files ready, Bangla translation reviewed before release).
