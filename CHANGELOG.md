# CHANGELOG — LifeOS

All notable changes to the LifeOS project will be documented in this file.

## [1.0.0] - 2025-06-01

### Added
- **Phase 0 & 1 (Foundation):**
  - Expo SDK 58, Expo Router, TypeScript strict, expo-sqlite + Drizzle ORM.
  - Light/Dark theme system with WCAG AA contrast compliance and Bangla (Hind Siliguri) + English (Plus Jakarta Sans) font integration.
  - Complete UI Kit v1 (Button, Card, Chip, Input, Checkbox, FAB, BottomSheet, ProgressRing, ProgressBar, ConfirmDialog, Snackbar, EmptyState, Skeleton).
  - 5-tab bottom navigation layout with center FAB.

- **Phase 2 (Core Productivity):**
  - **Tasks:** Smart lists (Inbox/Today/Upcoming/Done), natural language Quick Add parser (English + Bangla date/time keywords), task detail editor with subtasks, and project management.
  - **Recurrence & Reminders:** RFC 5545 RRULE engine, automatic next-occurrence spawning upon task completion, and Expo Notifications integration.
  - **Calendar:** 7-day strip picker, day agenda view, events CRUD, and combined task schedule rendering.
  - **Habits & Goals:** Zero-dependency streak calculation algorithm (`calculateStreaks`), daily/weekly habit check-in logs, and numeric/milestone goal progress tracking.
  - **Notes, Focus & Search:** Notes editor with pinning & search, 25-minute Pomodoro focus timer (`ProgressRing`), instant global search across all entities, Today dashboard, and weekly review analytics.
  - **Data Safety:** Schema-validated JSON backup export/restore (`backupSchema`) and database wipe workflow.

- **Phase 3 & 4 (Polish, Onboarding & BYOK AI):**
  - 3-slide visual onboarding flow with initial sample data seeding (*Getting Started* project, habits, welcome note).
  - Secure API key manager using `expo-secure-store`.
  - OpenAI (`gpt-4o-mini`) and Gemini (`gemini-2.5-flash`) contract-driven AI provider adapters with Zod schema validation and plan proposal preview flow.

- **Phase 5 (QA & Release):**
  - Security audit checklist verification (secret redaction in logs, backup payload isolation, no hardcoded API keys).
  - Comprehensive unit test suite (36/36 tests passing).
