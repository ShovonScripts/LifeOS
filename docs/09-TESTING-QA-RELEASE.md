# 09 — Testing, QA and Release

## 1. Test pyramid

| Level | Tooling | Targets |
|-------|---------|---------|
| Unit | Jest | `domain/*` (recurrence, streaks, parser, progress, dates), AI validation, adapters (mock fetch), backup validation |
| Integration | Jest + in-memory/temporary SQLite | repositories, services, migrations, restore round-trip, reminder reconcile |
| Component | React Native Testing Library | Quick Add, TaskCard, HabitCard, forms |
| E2E | Maestro (YAML flows) | onboarding, add/complete task, habit check-in, backup/restore, AI settings (mock server) |
| Manual | Physical devices | notifications, battery optimization, gestures, keyboard, performance |

Coverage goals: `domain/` ≥ 90%, services ≥ 80%, overall ≥ 70%.

## 2. Critical unit-test scenarios

**Recurrence:** daily/weekly/monthly (31st), weekdays, every N days, DST start/end in zones with DST, leap day, end date/count, completing late vs early.
**Streaks:** daily; specific days; X-per-week; skipped day; missed day; count habits; change of schedule mid-streak; start date in the future; timezone change.
**Parser:** "tomorrow 5pm", "next fri", "in 3 days", "!high", "#proj", "@label", Bangla numerals (৫টায়), ambiguous input stays plain title.
**AI validation:** valid, missing fields, extra fields, huge arrays, wrong types, fenced JSON (```), injection text inside titles.
**Backup:** valid file, wrong app, newer schema, truncated JSON, duplicate IDs, orphan relations.

## 3. Migration tests

- Create fixture DBs for each released schema version.
- Upgrade → assert counts, foreign keys, indexes, `user_version`.
- Simulate crash mid-migration → DB remains at previous version.

## 4. Offline and lifecycle

- Airplane mode: all core flows work; AI shows offline message.
- Kill app during write → data intact on restart.
- Rotate screen, split-screen, font scale 1.3×/2×.
- Low-storage behavior: friendly error on write/backup failure.

## 5. Notification tests (physical devices)

| Case | Expected |
|------|----------|
| Reminder while app foreground / background / killed | Fires, tap opens entity |
| Reboot device | Scheduled reminders still fire (or are restored on next open) |
| Change timezone / DST shift | Reminders reschedule to correct local time |
| Deny permission | Clear explanation + link to settings |
| Complete task before reminder | Reminder cancelled |
| Battery saver / OEM optimization (Xiaomi, Oppo/Realme, Vivo, Samsung) | Documented behavior + in-app guide |

## 6. AI test matrix

Providers: Gemini, OpenAI, OpenRouter, Custom. Scenarios per provider: valid key; invalid key; unsupported model; quota/billing error; timeout; offline; cancelled mid-request; malformed JSON; oversized response. Verify: error messages, no writes on failure, usage log row, no secrets in logcat.

## 7. Device matrix (minimum)

- Low-end: 2–3 GB RAM, Android 10/11 (e.g. entry Redmi/Realme/Samsung A0x).
- Mid-range: Android 13/14.
- Latest: Android 15/16 (gesture nav + 3-button nav).
- At least one small screen (≤5.5") and one large/tablet or foldable-size check.

## 8. Performance budgets

| Metric | Target |
|--------|--------|
| Cold start (mid-range) | < 2 s to interactive |
| Quick Add open | < 150 ms |
| Task list 2,000 rows scroll | no visible jank (≥ 55 fps) |
| Memory | < 250 MB typical |
| AAB download size | < 40 MB (target), APK universal under 60 MB |

Tools: React Native DevTools / Perfetto, `expo-atlas` for bundle analysis, Android Studio profiler.

## 9. Release acceptance criteria (from blueprint, extended)

- [ ] Core features work without account or internet.
- [ ] Data survives restarts; export/restore round-trip passes.
- [ ] All four provider options configurable and testable against their APIs.
- [ ] Invalid keys, unsupported models, quota, timeouts, offline show clear messages.
- [ ] AI changes require user confirmation; failures change nothing.
- [ ] No API keys in logs, analytics, backups, or bundle.
- [ ] Notifications, accessibility (TalkBack), dark mode, Bangla tested on physical devices.
- [ ] App usable with no AI provider configured.
- [ ] Crash-free in a 7-day internal dogfood.
- [ ] Privacy policy URL live; Data Safety form matches reality.

## 10. Release checklist

1. Version bump (`app.json` version + `android.versionCode`), update `CHANGELOG.md`.
2. `npx tsc --noEmit && npm run lint && npm test`.
3. `eas build --platform android --profile production` (AAB) and `preview` (APK) for device testing.
4. Smoke test the **release** build (not just dev): notifications, SecureStore, SQLite, fonts, deep links.
5. Verify signing (let EAS manage keystore; back up credentials).
6. Play Console: store listing (en + bn), screenshots (phone), feature graphic 1024×500, icon 512×512, content rating, Data Safety, target API level compliance (check Play's current requirement), app category Productivity.
7. Roll out: Internal → Closed → Production staged (10% → 50% → 100%).
8. Monitor: Play vitals (ANR/crash), user feedback; hotfix path ready (EAS Update for JS-only fixes if enabled).

## 11. Bug triage

P0 data loss/crash on launch/secret leak → hotfix immediately. P1 notification failure, wrong streak/recurrence → next patch. P2 UI glitches → backlog.
