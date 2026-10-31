LifeOS — Personal Life Manager

<p align="center">
  <strong>Your Life. Your Goals. Your Control.</strong>
  <br />
  A modern, AI-powered personal productivity and life management app.
</p><p align="center">
  <img src="https://img.shields.io/badge/Platform-Android-3DDC84?style=flat-square&logo=android&logoColor=white" alt="Android" />
  <img src="https://img.shields.io/badge/React_Native-Expo-4630EB?style=flat-square&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/AI-BYOK-8B5CF6?style=flat-square" alt="BYOK AI" />
  <img src="https://img.shields.io/badge/Architecture-Local--First-success?style=flat-square" alt="Local First" />
</p>---

Overview

LifeOS is a personal life management application designed to bring your everyday productivity into one organized workspace.

Manage tasks, projects, habits, goals, notes, schedules, and focus sessions without switching between multiple applications.

LifeOS follows a local-first architecture, meaning your core personal data stays on your device and remains accessible offline.

It also supports a Bring Your Own Key (BYOK) AI architecture, allowing every user to connect their own AI provider and API key instead of depending on a shared paid AI subscription.

The goal is simple:

«Build one intelligent workspace to organize your life, manage your time, and achieve your goals.»

Core Philosophy

- Privacy First: Your personal information belongs to you.
- Local First: Core functionality works without an internet connection.
- AI Optional: Use AI when you need it, not because the application requires it.
- Bring Your Own AI: Every user controls their own AI provider, API key, and model.
- No Forced Subscription: Core productivity features should remain independently usable.
- User Control: You control your data, settings, and AI configuration.

Features

1. Smart Dashboard

A centralized overview of your daily activities.

- Today's tasks and upcoming deadlines.
- Daily productivity progress.
- Overdue task tracking.
- Quick task creation.
- Daily activity summary.
- Optional AI-generated daily plans.

2. Task Management

Organize your work and personal responsibilities.

- Create, edit, complete, and archive tasks.
- Priority levels: Low, Medium, High, and Urgent.
- Task status management.
- Due dates and reminders.
- Subtasks and checklists.
- Labels and filtering.
- Recurring tasks.

3. Projects Management

Organize larger activities into manageable projects.

- Create and manage projects.
- Assign tasks to projects.
- Track project progress.
- Manage project deadlines.
- Organize tasks by category and priority.

4. Smart Calendar

Keep your schedule organized.

- Daily, weekly, and monthly views.
- Upcoming events.
- Task deadlines.
- Personal schedules.
- Recurring events.
- Reminder integration.

5. Habit Tracker

Build better routines through consistent actions.

- Create daily and weekly habits.
- Track completion history.
- Monitor habit streaks.
- View consistency reports.
- Track missed and completed habits.

6. Goals & Milestones

Turn long-term ambitions into actionable plans.

- Create personal and professional goals.
- Set target dates.
- Define measurable targets.
- Break goals into milestones.
- Monitor progress.
- Connect goals with actionable tasks.

7. Notes & Quick Capture

Keep important information accessible.

- Create and edit notes.
- Organize personal information.
- Pin important notes.
- Capture ideas quickly.
- Search saved notes.

8. Focus & Productivity

Improve concentration and understand how you spend your time.

- Focus timer.
- Custom focus sessions.
- Session history.
- Task-linked focus tracking.
- Productivity statistics.

9. AI Productivity Assistant

An optional AI assistant that helps users organize and plan their lives.

Planned capabilities:

- Generate daily productivity plans.
- Break down large goals into smaller tasks.
- Suggest task priorities.
- Summarize notes.
- Generate project task lists.
- Provide productivity suggestions.
- Conversational productivity assistance.

AI features require the user's own API credentials.

10. Personal Settings

- Light and dark themes.
- Notification preferences.
- Data management.
- Backup and restore.
- AI provider configuration.
- Privacy and security controls.

---

Bring Your Own Key (BYOK) AI

LifeOS uses a user-owned AI integration model.

Each user can configure their own API provider, API key, and preferred model.

LifeOS does not require users to purchase an AI subscription from the application developer.

Supported AI Providers

Provider| Integration
Google Gemini| Native Gemini API
OpenAI| OpenAI API
OpenRouter| OpenRouter API
Custom Provider| OpenAI-compatible API

AI Configuration

Users will be able to:

- Select their preferred AI provider.
- Enter their own API key.
- Select or manually enter a model ID.
- Configure a custom API endpoint where supported.
- Test API connectivity.
- Replace or remove API credentials.
- Enable or disable AI functionality.

BYOK Architecture

LifeOS
  │
  ├── AI Settings
  │     ├── Provider Selection
  │     ├── API Key Management
  │     └── Model Configuration
  │
  ├── AI Provider Registry
  │     │
  │     ├── Google Gemini Adapter
  │     ├── OpenAI Adapter
  │     ├── OpenRouter Adapter
  │     └── Custom OpenAI-Compatible Adapter
  │
  └── AI Assistant
        ├── Daily Planning
        ├── Task Generation
        ├── Goal Breakdown
        ├── Note Summarization
        └── Smart Suggestions

API Key Security

- API keys are stored using Expo SecureStore.
- API keys are never stored as plaintext in SQLite or AsyncStorage.
- Credentials are excluded from application logs and backups.
- Users can remove or replace their API keys.
- AI requests are made only when requested by the user.
- API credentials are not automatically synchronized to a cloud server.

Important: Users are responsible for their own API provider accounts, usage limits, and billing. Third-party provider pricing and free-tier availability are determined by those providers.

---

Technology Stack

Technology| Purpose
React Native| Cross-platform mobile framework
Expo| Development and native application tooling
TypeScript| Type safety
Expo Router| File-based navigation
Expo SQLite| Local database
Expo SecureStore| Secure credential storage
Zustand / Context API| State management
React Hook Form| Form management
Zod| Schema validation
Expo Notifications| Local notifications
Expo FileSystem| File operations and backups

Future Backend

A backend is not required for the initial release.

Future cloud synchronization may use:

- Laravel 12 — REST API.
- Laravel Sanctum — Authentication.
- Filament — Optional administration.
- MySQL — Cloud database.
- Device-aware synchronization and conflict resolution.

---

Architecture

LifeOS follows a modular, local-first architecture.

Presentation Layer
       │
       ▼
Application Layer
       │
       ├── Task Services
       ├── Project Services
       ├── Habit Services
       ├── Goal Services
       ├── Notes Services
       └── AI Services
              │
       ┌──────┴──────┐
       ▼             ▼
   SQLite       AI Provider
       │             │
       ▼             ├── Gemini
  Local Data          ├── OpenAI
                      ├── OpenRouter
                      └── Custom API

SecureStore
    │
    └── User API Credentials

Architectural Principles

1. SQLite is the primary source of truth.
2. Core application functionality must work offline.
3. UI components must not directly access database queries.
4. Business logic should remain independent of the UI.
5. AI providers must use a common adapter interface.
6. AI-generated content must be validated before saving.
7. Cloud synchronization must remain optional.

---

Project Structure

lifeos/
│
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── tasks.tsx
│   │   ├── calendar.tsx
│   │   ├── habits.tsx
│   │   ├── goals.tsx
│   │   └── notes.tsx
│   │
│   ├── tasks/
│   ├── projects/
│   ├── ai/
│   └── settings/
│
├── src/
│   ├── components/
│   ├── features/
│   ├── db/
│   │   ├── client.ts
│   │   ├── migrations/
│   │   ├── repositories/
│   │   └── queries/
│   │
│   ├── ai/
│   │   ├── types.ts
│   │   ├── registry.ts
│   │   ├── router.ts
│   │   ├── validation.ts
│   │   ├── prompts/
│   │   └── providers/
│   │
│   ├── storage/
│   ├── services/
│   ├── hooks/
│   ├── store/
│   ├── schemas/
│   ├── theme/
│   ├── utils/
│   └── constants/
│
├── assets/
├── tests/
├── app.json
├── package.json
└── tsconfig.json

---

Database Design

LifeOS uses SQLite for local persistence.

Planned database tables:

Table| Description
"tasks"| Personal tasks
"projects"| Project information
"subtasks"| Task checklists
"labels"| Task labels
"task_labels"| Task-label relationships
"events"| Calendar events
"habits"| Habit definitions
"habit_logs"| Habit completion records
"goals"| Personal goals
"goal_milestones"| Goal milestones
"notes"| Personal notes
"reminders"| Scheduled reminders
"focus_sessions"| Focus history
"app_settings"| Application preferences
"ai_usage_logs"| AI usage metadata

Database migrations, indexing, foreign-key constraints, and backup/restore support will be implemented as part of the development process.

---

Design System

LifeOS follows a modern, minimal, premium productivity interface.

Visual Direction

- Clean dashboard layout.
- Purple-gradient primary visual identity.
- Rounded cards and soft shadows.
- Clear typography and readable spacing.
- Minimal navigation.
- Accessible controls.
- Light and dark themes.

Color Palette

Color| Hex
Primary| "#7657E8"
Accent| "#A78BFA"
Background| "#F7F7FC"
Surface| "#FFFFFF"
Primary Text| "#19172A"
Secondary Text| "#77758B"
Success| "#16A34A"
Error| "#DC2626"

---

Installation & Development

Requirements

- Node.js LTS.
- npm.
- Expo CLI through "npx".
- Android Studio or an Android device.
- Git.

1. Clone the repository

git clone <repository-url>
cd lifeos

2. Install dependencies

npm install

3. Start the development server

npx expo start

4. Run on Android

npx expo start --android

For a native development build, configure the required Expo development build and Android tooling.

5. Type checking

npx tsc --noEmit

6. Linting

npx expo lint

---

Development Roadmap

Phase| Scope| Status
Phase 1| Project foundation and architecture| Planned
Phase 2| SQLite and core productivity features| Planned
Phase 3| BYOK AI provider integrations| Planned
Phase 4| Testing, security and optimization| Planned
Phase 5| Android release| Planned
Phase 6| Optional cloud synchronization| Future

Phase 1 — Foundation

- Expo project initialization.
- TypeScript configuration.
- Expo Router setup.
- Theme and design system.
- SQLite initialization.
- Database migrations.
- Repository architecture.

Phase 2 — Core Productivity

- Dashboard.
- Tasks and projects.
- Calendar.
- Habits and goals.
- Notes.
- Focus timer.
- Notifications.
- Data backup and restore.

Phase 3 — AI Integration

- Secure API credential management.
- Provider adapter architecture.
- Gemini integration.
- OpenAI integration.
- OpenRouter integration.
- Custom API support.
- AI assistant.
- AI response validation.

Phase 4 — Quality & Security

- Database testing.
- Offline functionality testing.
- API error handling.
- Data recovery testing.
- Performance optimization.
- Security review.

Phase 5 — Android Release

- Android application configuration.
- App icon and splash screen.
- APK/AAB generation.
- Physical device testing.
- Release preparation.

Phase 6 — Future Development

- Optional user accounts.
- Laravel backend.
- Multi-device cloud synchronization.
- Optional web application.
- Additional productivity integrations.

---

Privacy & Data Ownership

LifeOS is designed around personal data ownership.

- Core productivity data is stored locally.
- An account is not required for the initial version.
- AI integration is optional.
- Users provide their own AI credentials.
- Users choose when to send information to an AI provider.
- API credentials are stored separately from productivity data.
- Cloud synchronization is planned as an optional future feature.

Third-party AI providers process requests according to their own privacy policies and data retention practices. Users should review those policies before connecting an account.

---

Contribution

Contributions, suggestions, bug reports, and feature requests are welcome.

Before submitting a pull request:

1. Keep TypeScript strict.
2. Follow the existing folder architecture.
3. Use repository and service layers for data operations.
4. Include appropriate validation.
5. Test offline functionality.
6. Never commit API keys or other secrets.

---

License

License: To be determined.

---

Project Vision

LifeOS aims to become more than a task manager.

It is a personal operating system that helps people organize their responsibilities, build consistent habits, manage their goals, and make better use of their time.

One workspace. Your data. Your AI. Your life.

<p align="center">
  <strong>LifeOS — Take Control of Your Life.</strong>
</p>
