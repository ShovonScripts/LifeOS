# 05 — Screens and User Flows

This document specifies every screen, navigation hierarchy, user interaction flow, state handling (loading/empty/error), and accessibility requirements for LifeOS v1.

---

## 1. Navigation Architecture

LifeOS uses **Expo Router** with a root layout (`app/_layout.tsx`), an onboarding flow, and a bottom tab navigator (`app/(tabs)/_layout.tsx`) consisting of 5 tabs plus a prominent center Floating Action Button (FAB) for Quick Add.

```
Root Layout (_layout.tsx)
├── Onboarding (onboarding.tsx) - first launch only
└── Main Tabs ((tabs)/_layout.tsx)
    ├── Today (index.tsx)
    ├── Tasks (tasks.tsx)
    ├── Calendar (calendar.tsx)
    ├── Quick Add FAB (BottomSheet) → opens quick capture sheet
    ├── Grow (grow.tsx) - Segmented: Habits | Goals
    └── Notes (notes.tsx)
```

### Global Header Elements (on Tab screens)
- **Top Left:** App title / context indicator + Language toggle / quick sync status.
- **Top Right:** AI Assistant entry point (`/ai`) + Settings gear (`/settings`).

---

## 2. Screen Specifications & Flows

### 2.1 Today Dashboard (`app/(tabs)/index.tsx`)
- **Purpose:** Central daily hub answering "What should I focus on right now?"
- **Components:**
  - Date header with streak badge and greeting.
  - Focus widget (quick launch to active focus session).
  - Smart sections:
    1. *Due Today Tasks* (checkbox, priority chip, title, time).
    2. *Habits due today* (one-tap check-in buttons).
    3. *Upcoming calendar events* (timeline view).
    4. *Daily AI Plan summary* (if generated).
- **States:**
  - **Loading:** Skeleton loader for sections.
  - **Empty:** Clean encouragement message + "Add Task" / "Add Habit" quick actions.
  - **Error:** Snackbar alert + retry button.

### 2.2 Tasks Tab (`app/(tabs)/tasks.tsx`)
- **Purpose:** Comprehensive task management across smart lists and projects.
- **Components:**
  - Filter chips: Inbox, Today, Upcoming, Overdue, Done.
  - Project filter dropdown / horizontal chip scroll.
  - FlashList of tasks with swipe actions (swipe right = complete, swipe left = delete/reschedule).
  - Search bar integration.
- **Interactions:**
  - Tap task row → Navigates to Task Detail (`app/task/[id].tsx`).
  - Checkbox tap → Completes task with haptic feedback and Undo snackbar.
  - Swipe action → Triggers action with confirmation/undo.

### 2.3 Calendar Tab (`app/(tabs)/calendar.tsx`)
- **Purpose:** Time-blocking and schedule overview.
- **Components:**
  - Month view / Week view / Day Agenda toggle.
  - Event and task-with-due-date timeline renderer.
  - FAB to add new event (`app/event/new.tsx`).

### 2.4 Grow Tab (`app/(tabs)/grow.tsx`)
- **Purpose:** Personal development tracking (Habits & Goals).
- **Sub-navigation / Segments:**
  - *Habits:* Habit list with heatmap / streak counters, one-tap check-in, add habit modal.
  - *Goals:* Milestone progress bars, linked tasks, add goal flow.

### 2.5 Notes Tab (`app/(tabs)/notes.tsx`)
- **Purpose:** Quick notes, journals, and markdown snippets.
- **Components:**
  - Pinned notes section.
  - FlashList of note cards (title, snippet, updated date).
  - Search filtering.
  - Tap note → Note Editor (`app/note/[id].tsx`) with autosave.

---

## 3. Key Modals & Action Sheets

### 3.1 Quick Add Sheet (Global FAB)
- **Trigger:** Center FAB on tab bar.
- **Input:** Single text field with smart natural language parser (`domain/parser.ts`).
- **Parsing Examples:**
  - `"Meeting with team tomorrow 3pm !high #work"` → Title: "Meeting with team", Due: Tomorrow 15:00, Priority: High, Label: work.
- **Actions:** Save or expand into detailed task form.

### 3.2 Task Detail (`app/task/[id].tsx`)
- Full editor for title, description, due date, reminder, priority, project, labels, recurrence rule (RRULE), and subtasks checklist.

---

## 4. Accessibility & Design Compliance
- Touch targets ≥ 48x48dp on all buttons and list items.
- Dynamic Type / font scaling support.
- Accessibility labels (`accessibilityRole`, `accessibilityLabel`) on all interactive controls.
- Full light and dark theme contrast compliance (WCAG AA 4.5:1).
