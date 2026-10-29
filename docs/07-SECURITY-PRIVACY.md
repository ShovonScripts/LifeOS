# 07 — Security and Privacy

## 1. Assets and threats

| Asset | Threats | Controls |
|-------|---------|----------|
| API keys | Leak via logs, backups, source control, screenshots, rogue endpoint | SecureStore only; redaction; excluded from backups; masked UI; host confirmation |
| Personal data (tasks, notes) | Device theft, shared device, accidental share | Optional app lock (v1.1), no cloud by default, export is user-initiated |
| Data sent to AI | Over-sharing, provider retention | Minimal context, explicit consent screen, per-feature "what's sent" preview |
| Integrity of DB | Corrupt restore, malicious backup | Zod validation, transaction restore, version checks |
| Supply chain | Malicious/unmaintained dependencies | Lockfile, minimal deps, `npm audit`, review upgrades |

## 2. Key management

- Store in `expo-secure-store` under `lifeos.ai.key.<provider>`; `requireAuthentication` optional (v1.1 biometrics).
- Never in `app.json`, `.env` committed files, logs, analytics, crash reports, `app_settings`, backups or screenshots (use `FLAG_SECURE`-like protection for key screen if feasible; at minimum mask input).
- UI: masked by default; "show" toggle; paste supported; after saving, display only last 4 chars.
- Lifecycle: add → test → save; replace (overwrite); delete provider removes secret + settings.
- Memory: read key at call time, don't keep it in global state or Zustand.
- Disable Android auto-backup for sensitive stores or ensure SecureStore items aren't restored cross-device (`android:allowBackup="false"` or backup rules XML excluding secure prefs; verify behavior for the chosen SDK).

## 3. Network

- HTTPS only (custom: see doc 06 §10). Set timeouts (30 s default) and max response size.
- No cleartext traffic flag in release (`usesCleartextTraffic=false`).
- No analytics or tracking SDKs in v1. If crash reporting is added later, make it opt-in and scrub payloads.
- Do not follow cross-origin redirects with credentials.
- Never execute, `eval`, or render AI output as HTML. Render as plain text/markdown-lite with link sanitization.

## 4. Logging rules

- Logger redacts patterns: `sk-…`, `AIza…`, `Bearer …`, any value from known secret keys.
- Do not log request bodies, prompts, notes, or task content. Log operation names, status codes, durations, error codes only.
- Release builds: log level `warn`+.
- Add a CI/lint check (grep) for `console.log` and for secret-like strings.

## 5. Data protection on device

- App data stays in the app sandbox. Optional DB encryption (SQLCipher) is out of scope for v1; document the limitation.
- Auto-backups live in app documents dir; they exclude secrets; user exports go through the system share sheet.
- Backup files contain personal data in plain JSON — warn on export: "Store this file somewhere safe."
- "Clear all data" requires typed confirmation and also deletes SecureStore keys and scheduled notifications.

## 6. Permissions (Android)

| Permission | When | Why |
|-----------|------|-----|
| `POST_NOTIFICATIONS` | contextual, on first reminder | reminders |
| `SCHEDULE_EXACT_ALARM` / `USE_EXACT_ALARM` | only if exact times needed | precise reminders (review Play policy before using) |
| `RECEIVE_BOOT_COMPLETED` | provided by notifications lib | restore scheduled notifications |
| `VIBRATE` | default | haptics |
| `FOREGROUND_SERVICE` (+ type) | only if the focus timer needs one | focus timer notification |

Request the minimum. No contacts, location, storage or camera permissions in v1 (use document picker and share sheet instead).

## 6.1 AI privacy explainer (shown before first AI use)

"LifeOS sends only what is needed for the action you choose (for example the titles and due dates of today's tasks) directly from your phone to the provider you configured. LifeOS has no servers and never sees your key or data. The provider's own terms and privacy policy apply, and some providers may retain data. You can remove your key anytime."

Include a per-request "What will be sent" disclosure (expandable).

## 7. Privacy policy points (for Play Store)

- No account, no server, no analytics in v1.
- Data stored locally; user can export/delete.
- Optional AI sends selected content to a third-party provider chosen by the user using their own key.
- Notifications are local.
- Contact email and policy URL required by Google Play; Data Safety form: "No data collected" (if accurate at release time) with AI disclosure in the description.

## 8. Security test checklist

- [ ] Search decompiled/bundled JS and `app.json` for secrets: none.
- [ ] Inspect logcat during all flows: no keys/prompts.
- [ ] Export backup: no keys, validates and restores.
- [ ] Network capture (e.g. mitmproxy on a test device): requests go only to the configured host, TLS enforced.
- [ ] Custom endpoint with redirect to another host: blocked.
- [ ] Invalid/malicious AI JSON (huge arrays, wrong types, injected instructions in notes): safely rejected.
- [ ] Clear data wipes DB, SecureStore, notifications.
- [ ] `npm audit` clean or triaged.
