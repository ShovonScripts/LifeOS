# 10 — Project Setup Guide

Prereqs: Node LTS, Git, Android Studio (emulator + SDK) or a physical Android device with USB debugging, an Expo account (for EAS).

## 1. Create the project

```bash
npx create-expo-app@latest lifeos --template default
cd lifeos
# (If the default template includes sample screens, remove app-example/ via the template's reset script or manually.)
```

Use the latest stable SDK at creation time. Check the Expo changelog for current requirements.

## 2. Install dependencies

Use `npx expo install` for Expo-aware version matching:

```bash
npx expo install expo-sqlite expo-secure-store expo-notifications expo-localization \
  expo-font expo-haptics expo-file-system expo-sharing expo-document-picker \
  expo-splash-screen expo-linking expo-constants expo-keep-awake \
  react-native-reanimated react-native-gesture-handler react-native-svg \
  react-native-safe-area-context react-native-screens

npm i drizzle-orm zustand zod react-hook-form @hookform/resolvers \
  date-fns date-fns-tz rrule i18next react-i18next ulid \
  @gorhom/bottom-sheet @shopify/flash-list lucide-react-native

npm i -D drizzle-kit typescript eslint prettier jest jest-expo \
  @testing-library/react-native @types/jest husky lint-staged
```

Fonts (Google Fonts via Expo packages):

```bash
npx expo install @expo-google-fonts/plus-jakarta-sans @expo-google-fonts/hind-siliguri
```

> Package names/versions evolve; if an install fails, check the package's current docs. Prefer `npx expo install` for anything native.

## 3. Config files

**tsconfig.json**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

**app.json (essentials)**
```json
{
  "expo": {
    "name": "LifeOS",
    "slug": "lifeos",
    "scheme": "lifeos",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "android": {
      "package": "com.prodo.lifeos",
      "versionCode": 1,
      "adaptiveIcon": { "foregroundImage": "./assets/icons/adaptive-foreground.png", "backgroundColor": "#7657E8" },
      "permissions": ["POST_NOTIFICATIONS"]
    },
    "plugins": [
      "expo-router",
      "expo-sqlite",
      "expo-secure-store",
      ["expo-notifications", { "color": "#7657E8" }],
      "expo-font",
      "expo-localization"
    ],
    "experiments": { "typedRoutes": true }
  }
}
```
Adjust to what the current SDK requires (some options change between SDK versions).

**drizzle.config.ts**
```ts
import type { Config } from 'drizzle-kit';
export default {
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
```

**babel.config.js** — add the Reanimated plugin per current Reanimated docs; and Drizzle's SQL migration support (`inline-import` plugin for `.sql` files) if using generated migrations with Expo.

**metro.config.js** — add `sql` to `sourceExts` for Drizzle migrations.

**eas.json**
```json
{
  "cli": { "version": ">= 12.0.0" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal", "android": { "buildType": "apk" } },
    "production": { "android": { "buildType": "app-bundle" } }
  }
}
```

**package.json scripts**
```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "jest",
    "db:generate": "drizzle-kit generate",
    "prepare": "husky"
  }
}
```

## 4. DB bootstrap pattern

```ts
// src/db/client.ts
import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const sqlite = openDatabaseSync('lifeos.db', { enableChangeListener: true });
sqlite.execSync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
export const db = drizzle(sqlite, { schema });
```

```tsx
// app/_layout.tsx (sketch)
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/db/migrations/migrations';
// 1) load fonts  2) run migrations  3) hide splash  4) render providers + Stack/Tabs
```

## 5. Secrets helper pattern

```ts
// src/storage/secure-secrets.ts
import * as SecureStore from 'expo-secure-store';
const k = (p: string) => `lifeos.ai.key.${p}`;
export const saveKey = (p: string, v: string) => SecureStore.setItemAsync(k(p), v);
export const getKey = (p: string) => SecureStore.getItemAsync(k(p));
export const deleteKey = (p: string) => SecureStore.deleteItemAsync(k(p));
```

## 6. Run and build

```bash
npm run android                      # dev build on device/emulator
eas login && eas build:configure
eas build -p android --profile preview      # APK for testing
eas build -p android --profile production   # AAB for Play
```

Note: `expo-sqlite`, notifications and SecureStore need a development build (not Expo Go) for full behavior — use `expo run:android` or an EAS development build.

## 7. Repo hygiene

- `.gitignore`: `node_modules`, `.expo`, `dist`, `*.keystore`, `.env*`, `android/` `ios/` if using CNG (prebuild).
- Commit convention: Conventional Commits (`feat:`, `fix:`, `docs:`).
- Branches: `main` (stable) + short-lived `feat/*`.
- CI (GitHub Actions): install → typecheck → lint → test on PR.
- Copy `lifeos-docs/` to `docs/` and place `CLAUDE.md` at the repo root.

## 8. First-day checklist

- [ ] App runs on a physical device
- [ ] Theme tokens + one screen styled in light/dark
- [ ] DB created, one migration applied, one row inserted and read via repository
- [ ] One local notification scheduled and received
- [ ] SecureStore write/read verified
- [ ] First preview APK built via EAS
