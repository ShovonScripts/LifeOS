# 06 — AI & BYOK (Bring Your Own Key) Architecture Specification

This document defines how LifeOS integrates optional artificial intelligence features securely and robustly using user-provided API keys (BYOK).

---

## 1. Core Principles

1. **Strictly Optional:** LifeOS is 100% functional without any AI configured or network connection.
2. **Key Security:** API keys are stored **only** in encrypted storage (`expo-secure-store`). They never touch SQLite, logs, crash reports, backups, or Zustand state.
3. **Contract-Driven AI:** All AI outputs must conform to rigid Zod schemas. If an LLM response fails validation, exactly one automatic repair attempt is made with the error feedback.
4. **Preview & Confirm:** AI output is **never** written directly to the database or executed automatically. Every AI action produces a structured proposal that is presented in a dedicated preview screen for user review and confirmation.
5. **No Telemetry or Key Logging:** Requests are made directly from the device to the chosen provider endpoint. No intermediary server or logging of prompts/responses occurs.

---

## 2. Supported Providers & Adapters

LifeOS supports modular provider adapters implementing a common interface (`AIProvider`):

1. **Google Gemini** (`gemini-2.5-flash`, `gemini-2.5-pro`)
2. **OpenAI** (`gpt-4o-mini`, `gpt-4o`)
3. **OpenRouter** (access to multi-provider models)
4. **OpenAI-Compatible Custom Endpoint** (local or proxy models)

---

## 3. Data Flow & Security

```
User Prompt + Local Context (Tasks/Habits summary)
       ↓
AI Router / Service
       ↓ (API Key retrieved from SecureStore on demand)
LLM Provider API (HTTPS)
       ↓
Raw Response JSON
       ↓
Zod Schema Validation (with 1 retry repair on parse error)
       ↓
Structured Proposal Object
       ↓
AI Preview Screen (app/ai/plan-preview.tsx)
       ↓ (User Tap Confirm)
Database Transaction (`applyProposals`) → SQLite Source of Truth
```

---

## 4. Error Handling & Privacy Disclosures

- **AIError Codes:** `INVALID_KEY`, `RATE_LIMITED`, `TIMEOUT`, `VALIDATION_FAILED`, `NETWORK_ERROR`.
- **User Feedback:** Clear, non-technical `userMessage` shown via Snackbar; raw stack traces logged securely without keys or PII.
- **Privacy Notice:** Clear disclosure screen explaining what context data is sent to the LLM (e.g., today's active tasks and calendar summaries) and confirming that keys remain secure on-device.
