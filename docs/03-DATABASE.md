# 03 — Database

SQLite via `expo-sqlite` + Drizzle ORM. SQLite is the source of truth; the Drizzle schema in
`src/db/schema/` is authoritative and migrations are generated from it with `npm run db:generate`.

## 1. Conventions

- **IDs:** ULID strings (`src/core/ids.ts`). Sortable by creation time, safe for future sync.
- **Instants:** UTC ISO-8601 strings (`2026-10-29T12:00:00.000Z`).
- **Calendar days:** `YYYY-MM-DD` in the user's timezone (`local_date`, `due_local_date`,
  `start_date`, `target_date`). Never derive these from a UTC timestamp.
- **Recurrence:** RFC 5545 `RRULE` text plus an IANA timezone (`Asia/Dhaka`). Next occurrences are
  computed in `src/domain/recurrence.ts`.
- **Soft delete:** syncable tables use `deleted_at` (ISO instant or `NULL`). Reads exclude deleted
  rows by default. Syncable tables carry:
  `created_at`, `updated_at`, `deleted_at`, `rev`, `device_id`, `sync_status`
  (`local | pending | synced`).
- **Booleans:** SQLite integers `0 | 1`.
- **JSON columns:** TEXT containing JSON; validate in the service layer, never trust it.
- **Foreign keys:** enforced via `PRAGMA foreign_keys = ON` on every connection.

## 2. Tables

### app_settings

Single key/value preference store (never secrets; API keys live in SecureStore).

| Column | Type | Notes |
|--------|------|-------|
| `key` | TEXT PK | e.g. `theme.mode`, `locale`, `week_starts_on` |
| `value` | TEXT NOT NULL | JSON-encoded value |
| `updated_at` | TEXT NOT NULL | UTC ISO |

### projects

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | ULID |
| `name` | TEXT NOT NULL | |
| `color` | TEXT NOT NULL | hex, default `#7657E8` |
| `icon` | TEXT | lucide icon name |
| `sort_order` | INTEGER NOT NULL | default 0 |
| `archived_at` | TEXT | UTC ISO |
| sync columns | | |

### tasks

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `project_id` | TEXT FK → projects.id | `ON DELETE SET NULL` |
| `title` | TEXT NOT NULL | |
| `notes` | TEXT | markdown-lite |
| `status` | TEXT NOT NULL | `todo \| doing \| done \| cancelled`, default `todo` |
| `priority` | TEXT NOT NULL | `none \| low \| medium \| high`, default `none` |
| `due_at` | TEXT | UTC ISO instant (timed) |
| `due_local_date` | TEXT | `YYYY-MM-DD` (all-day / smart lists) |
| `is_all_day` | INTEGER NOT NULL | default 0 |
| `remind_at` | TEXT | UTC ISO |
| `completed_at` | TEXT | UTC ISO |
| `recurrence_rule` | TEXT | RRULE |
| `recurrence_timezone` | TEXT | IANA |
| `series_id` | TEXT | groups recurring occurrences (first task id) |
| `source` | TEXT NOT NULL | `user \| ai`, default `user` |
| `sort_order` | INTEGER NOT NULL | default 0 |
| sync columns | | |

### subtasks

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `task_id` | TEXT FK → tasks.id | `ON DELETE CASCADE` |
| `title` | TEXT NOT NULL | |
| `is_done` | INTEGER NOT NULL | default 0 |
| `sort_order` | INTEGER NOT NULL | default 0 |
| sync columns | | |

### labels

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `name` | TEXT NOT NULL | unique (case-sensitive) |
| `color` | TEXT NOT NULL | hex |
| sync columns | | |

### task_labels

Join table; hard-deleted.

| Column | Type | Notes |
|--------|------|-------|
| `task_id` | TEXT FK → tasks.id | `ON DELETE CASCADE`, PK part |
| `label_id` | TEXT FK → labels.id | `ON DELETE CASCADE`, PK part |
| `created_at` | TEXT NOT NULL | |

### events

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `title` | TEXT NOT NULL | |
| `notes` | TEXT | |
| `location` | TEXT | |
| `starts_at` | TEXT NOT NULL | UTC ISO |
| `ends_at` | TEXT NOT NULL | UTC ISO |
| `is_all_day` | INTEGER NOT NULL | default 0 |
| `timezone` | TEXT NOT NULL | IANA |
| `recurrence_rule` | TEXT | RRULE; occurrences expanded lazily |
| `series_id` | TEXT | |
| `color` | TEXT | |
| sync columns | | |

### habits

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `name` | TEXT NOT NULL | |
| `icon` | TEXT | |
| `color` | TEXT | |
| `schedule_type` | TEXT NOT NULL | `daily \| weekdays \| weekly_count` |
| `weekdays` | TEXT | JSON array of `0–6` (0 = Sunday) |
| `target_per_week` | INTEGER | for `weekly_count` |
| `target_per_day` | INTEGER NOT NULL | default 1 (count habits) |
| `unit` | TEXT | e.g. `glasses` |
| `start_date` | TEXT NOT NULL | `YYYY-MM-DD` |
| `sort_order` | INTEGER NOT NULL | default 0 |
| `archived_at` | TEXT | |
| sync columns | | |

### habit_logs

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `habit_id` | TEXT FK → habits.id | `ON DELETE CASCADE` |
| `local_date` | TEXT NOT NULL | `YYYY-MM-DD` |
| `count` | INTEGER NOT NULL | default 1 |
| `note` | TEXT | |
| sync columns | | |

**Unique:** `(habit_id, local_date)` — checking in twice updates `count`.

### goals

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `title` | TEXT NOT NULL | |
| `description` | TEXT | |
| `type` | TEXT NOT NULL | `numeric \| milestone` |
| `target_value` | REAL | numeric goals |
| `current_value` | REAL NOT NULL | default 0 |
| `unit` | TEXT | |
| `status` | TEXT NOT NULL | `active \| completed \| archived`, default `active` |
| `start_date` | TEXT | |
| `target_date` | TEXT | |
| `completed_at` | TEXT | |
| sync columns | | |

### goal_milestones

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `goal_id` | TEXT FK → goals.id | `ON DELETE CASCADE` |
| `title` | TEXT NOT NULL | |
| `is_done` | INTEGER NOT NULL | default 0 |
| `due_date` | TEXT | |
| `completed_at` | TEXT | |
| `sort_order` | INTEGER NOT NULL | default 0 |
| sync columns | | |

### goal_tasks

| Column | Type | Notes |
|--------|------|-------|
| `goal_id` | TEXT FK → goals.id | `ON DELETE CASCADE`, PK part |
| `task_id` | TEXT FK → tasks.id | `ON DELETE CASCADE`, PK part |
| `created_at` | TEXT NOT NULL | |

### notes

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `title` | TEXT NOT NULL | default `''` |
| `body` | TEXT NOT NULL | default `''` |
| `is_pinned` | INTEGER NOT NULL | default 0 |
| `task_id` | TEXT FK → tasks.id | `ON DELETE SET NULL` |
| `goal_id` | TEXT FK → goals.id | `ON DELETE SET NULL` |
| `project_id` | TEXT FK → projects.id | `ON DELETE SET NULL` |
| sync columns | | |

### focus_sessions

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `task_id` | TEXT FK → tasks.id | `ON DELETE SET NULL` |
| `started_at` | TEXT NOT NULL | UTC ISO |
| `ended_at` | TEXT | UTC ISO |
| `planned_seconds` | INTEGER NOT NULL | |
| `actual_seconds` | INTEGER | |
| `completed` | INTEGER NOT NULL | default 0 |
| `created_at` | TEXT NOT NULL | |

### reminders

Mirrors scheduled OS notifications so the rolling reconciler can cancel orphans.

| Column | Type | Notes |
|--------|------|-------|
| `id` | TEXT PK | |
| `entity_type` | TEXT NOT NULL | `task \| event \| habit` |
| `entity_id` | TEXT NOT NULL | |
| `trigger_at` | TEXT NOT NULL | UTC ISO |
| `notification_id` | TEXT | OS notification identifier |
| `channel` | TEXT NOT NULL | `reminders \| habits \| daily-summary \| focus` |
| `created_at` | TEXT NOT NULL | |

## 3. Indexes

```sql
CREATE INDEX idx_tasks_status ON tasks(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due ON tasks(due_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due_local ON tasks(due_local_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_project ON tasks(project_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_series ON tasks(series_id);
CREATE INDEX idx_subtasks_task ON subtasks(task_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_task_labels_label ON task_labels(label_id);
CREATE INDEX idx_events_starts ON events(starts_at);
CREATE INDEX idx_habit_logs_date ON habit_logs(local_date);
CREATE UNIQUE INDEX idx_habit_logs_unique ON habit_logs(habit_id, local_date);
CREATE INDEX idx_goal_milestones_goal ON goal_milestones(goal_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notes_pinned ON notes(is_pinned) WHERE deleted_at IS NULL;
CREATE INDEX idx_focus_started ON focus_sessions(started_at);
CREATE INDEX idx_reminders_trigger ON reminders(trigger_at);
CREATE INDEX idx_reminders_entity ON reminders(entity_type, entity_id);
```

## 4. PRAGMAs

Set on every connection open:

```sql
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
PRAGMA busy_timeout = 5000;
PRAGMA synchronous = NORMAL;
```

## 5. Migrations

- Generated by `drizzle-kit generate` into `src/db/migrations/`.
- `src/db/migrations/migrations.js` bundles the journal + SQL (inlined by
  `babel-plugin-inline-import`).
- `app/_layout.tsx` runs `migrate(db, migrations)` behind the splash screen; splash hides only
  after fonts **and** migrations are ready.
- Migrations are append-only. Never edit a released migration; add a new one.
- A failed migration keeps the DB at its previous `user_version`; the app shows a recoverable
  error with "restore from backup" as the path forward.

## 6. Backup format

`lifeos-backup` JSON, versioned. **No secrets, no device ids.**

```json
{
  "app": "lifeos",
  "schemaVersion": 1,
  "exportedAt": "2026-10-29T12:00:00.000Z",
  "data": {
    "projects": [],
    "tasks": [],
    "subtasks": [],
    "labels": [],
    "taskLabels": [],
    "events": [],
    "habits": [],
    "habitLogs": [],
    "goals": [],
    "goalMilestones": [],
    "goalTasks": [],
    "notes": [],
    "focusSessions": []
  }
}
```

Restore rules:

1. Validate with Zod (`app`, `schemaVersion`, every row shape).
2. Reject newer `schemaVersion` and unknown `app`.
3. Restore inside one transaction; `replace` clears tables first, `merge` inserts only
   non-conflicting ids and reports conflicts.
4. Auto-backups keep the last 3 daily snapshots in the app documents directory.
5. CSV export is tasks-only and is never used for restore.

## 7. Query rules

- All reads that serve lists filter `deleted_at IS NULL` and select explicit columns.
- Transactions wrap multi-table writes (task + labels + reminders; restore; recurring spawn).
- Soft delete cascades are handled in services (e.g. deleting a task also soft-deletes subtasks
  and cancels reminders) inside the same transaction.
- No raw SQL outside `src/db/`.
