# 04 — UI/UX Design System

Visual reference: purple-gradient, soft shadows, rounded cards, functional minimalism.

## 1. UX principles

1. **Capture fast.** The primary action (add) is always one thumb-tap away, centered at the bottom.
2. **Today answers "what now?"** Show the single next best action first.
3. **Progressive disclosure.** Quick add shows only a title; date, priority, project, reminder appear as chips you can tap or ignore.
4. **Thumb-zone first.** Primary controls in the lower 60% of the screen; top bar is for navigation and secondary actions.
5. **Forgiving.** Every destructive or completion action has Undo (snackbar, 5 s). Soft delete everywhere.
6. **Calm feedback.** Subtle haptics, spring animations ≤ 300 ms, no confetti spam (one small celebration when all today's tasks are done).
7. **Honest states.** Every screen designs: loading (skeleton), empty (helpful), error (recoverable), offline (n/a for core).
8. **Accessible by default.** 48dp targets, AA contrast, TalkBack labels, font scaling to 200%, reduce-motion support.
9. **Bangla-ready.** No text baked into images; layouts tolerate 30% longer strings; Bangla line-height 1.5+.

## 2. Color tokens

### Light

| Token | Value | Use |
|-------|-------|-----|
| `primary` | `#7657E8` | Buttons, active tab, links |
| `primaryPressed` | `#5F42CC` | Pressed state |
| `primarySoft` | `#EFEBFD` | Chip/selected backgrounds |
| `accent` | `#A78BFA` | Highlights, gradient end |
| `bg` | `#F7F7FC` | App background |
| `surface` | `#FFFFFF` | Cards |
| `surfaceAlt` | `#F1F0F9` | Inputs, segmented controls |
| `border` | `#E6E4F2` | Dividers |
| `text` | `#19172A` | Primary text |
| `textSecondary` | `#6B6980` | Secondary (darkened from `#77758B` for AA on small text) |
| `textOnPrimary` | `#FFFFFF` | |
| `success` | `#16A34A` | |
| `warning` | `#F59E0B` | |
| `error` | `#DC2626` | |
| `info` | `#2563EB` | |

Priority colors: High `#DC2626`, Medium `#F59E0B`, Low `#3B82F6`, None `#9CA3AF`.

### Dark

| Token | Value |
|-------|-------|
| `bg` | `#0F0E17` |
| `surface` | `#181726` |
| `surfaceAlt` | `#211F33` |
| `border` | `#2D2B45` |
| `text` | `#F4F3FB` |
| `textSecondary` | `#A5A3BC` |
| `primary` | `#9279F2` (lighter for contrast on dark) |
| `primarySoft` | `#2A2250` |
| `accent` | `#C4B5FD` |
| `success` | `#4ADE80` |
| `error` | `#F87171` |

Gradients: `heroGradient = ['#7657E8', '#A78BFA']` (135°), dark hero `['#5B3FD0', '#8B6CF0']`.

> Verify every text/background pair with a contrast checker before release (AA: 4.5:1 body, 3:1 large text and UI components). Values above are the intended targets; adjust if a pair fails.

## 3. Typography

- Latin: **Plus Jakarta Sans** (or Inter).
- Bangla: **Hind Siliguri** (or Noto Sans Bengali). Load via `expo-font`; use font fallback by language.
- Respect system font scale; test at 1.3× and 2×.

| Style | Size / Line | Weight |
|-------|-------------|--------|
| `display` | 32 / 40 | 700 |
| `h1` | 26 / 34 | 700 |
| `h2` | 20 / 28 | 600 |
| `h3` | 17 / 24 | 600 |
| `body` | 15 / 22 | 400 |
| `bodyStrong` | 15 / 22 | 600 |
| `caption` | 13 / 18 | 500 |
| `micro` | 11 / 16 | 600 (uppercase labels only) |

Bangla line-heights: multiply by 1.1.

## 4. Spacing, radius, elevation

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40 dp. Screen horizontal padding: 20 dp.
- Radius: chip 999, input 14, card 20, sheet 28 (top corners), button 16.
- Elevation (light): card `0 4 16 rgba(25,23,42,0.06)`; floating `0 10 30 rgba(118,87,232,0.25)`. Dark mode: no shadow, use `border` + slightly lighter surface.
- Minimum touch target 48×48 dp (use `hitSlop` for small icons).

## 5. Motion

| Interaction | Spec |
|-------------|------|
| Press | scale 0.97, 90 ms |
| Sheet open | spring (damping 18, stiffness 180) |
| Checkbox complete | stroke draw 180 ms + light haptic, row fades/collapses 220 ms |
| Progress ring/bar | ease-out 500 ms |
| Tab switch | cross-fade 150 ms |
| Page transition | native stack default (slide) |

Respect `AccessibilityInfo.isReduceMotionEnabled` → replace with fades or instant changes.

## 6. Core components

| Component | Notes |
|-----------|-------|
| `Button` | variants: primary (gradient optional), secondary, ghost, destructive; sizes md/lg; loading state |
| `IconButton` | 48dp hit area |
| `Card` | radius 20, padding 16 |
| `Chip` | selectable; used for date/priority/project/label |
| `Checkbox` | circular, animated; priority-colored ring |
| `TaskCard` | checkbox, title, meta row (due, project dot, subtask count, repeat icon), swipe actions |
| `ProgressRing` / `ProgressBar` | SVG, animated |
| `HabitCard` | icon, name, streak flame, 7-day dots, one-tap check |
| `GoalCard` | title, progress, next milestone, target date |
| `NoteCard` | title, 2-line preview, pin |
| `SectionHeader` | title + optional action |
| `EmptyState` | illustration (simple SVG), headline, one CTA |
| `Skeleton` | shimmer placeholders |
| `BottomSheet` | quick add, pickers, filters |
| `DateTimePicker` | custom sheet: quick options (Today, Tomorrow, This weekend, Next week) + calendar + time |
| `SegmentedControl` | Habits/Goals, Day/Week/Month |
| `Snackbar` | undo actions |
| `Toast` | non-blocking info |
| `ConfirmDialog` | only for irreversible actions |
| `AIProviderCard` | logo, status (connected/not configured), model |
| `AIPreviewList` | editable proposed items with accept/reject |
| `FAB` | center quick-add, gradient, 60dp |
| `ErrorState` | message + Retry |

## 7. Iconography

One set (Lucide). 24dp default, stroke 1.75. Tab icons: filled variant when active (or color + dot indicator).

## 8. Navigation chrome

Bottom bar (height 64 + safe-area): **Today · Tasks · [＋] · Calendar · Grow · Notes** (center FAB floats above the bar; Notes sits as the 5th tab — see doc 05). Active tab: primary color icon + label; inactive: `textSecondary`. Support Android gesture navigation and 3-button navigation (edge-to-edge insets).

## 9. Accessibility checklist

- `accessibilityRole`, `accessibilityLabel`, `accessibilityState` on every interactive element (checkbox says "Complete task: Buy milk, due today").
- Swipe actions also available via long-press menu and TalkBack custom actions.
- Color never the only signal (priority also has an icon/label).
- Focus order matches visual order; modals trap focus.
- Dynamic type to 200% without clipping (use `minHeight`, not fixed heights).
- Reduce-motion and high-contrast respected.

## 10. Microcopy tone

Friendly, short, active. Examples: "Nothing due today. Enjoy the space." · "Add your first habit — start small." · "Couldn't reach OpenAI. Your tasks are safe." · Avoid blame ("You entered an invalid key" → "That key didn't work. Check it and try again.").

## 11. Design deliverables checklist (Figma or direct-to-code)

- [ ] Token file → `src/theme/tokens.ts`
- [ ] Component library page (light + dark)
- [ ] Hi-fi: Today, Quick Add, Tasks, Task detail, Calendar (3 views), Grow (habits+goals), Habit detail, Goal detail, Notes, Focus, Search, Settings, AI settings, AI preview, Onboarding
- [ ] Empty / loading / error variants for each list screen
- [ ] App icon (adaptive, 432×432 foreground safe zone 66%), splash, Play Store assets
