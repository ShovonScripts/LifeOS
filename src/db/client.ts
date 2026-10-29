import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from './schema';

export const DATABASE_NAME = 'lifeos.db';

export const sqlite = openDatabaseSync(DATABASE_NAME, { enableChangeListener: true });

sqlite.execSync(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
  PRAGMA synchronous = NORMAL;
`);

export const db = drizzle(sqlite, { schema });

export type Db = typeof db;
