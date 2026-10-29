import type { Db } from './client';

export type Executor = Db;

/**
 * Runs a multi-table write atomically. Repositories accept an Executor, so they can be composed
 * inside a transaction by the service layer.
 */
export function runInTransaction<T>(db: Db, work: (tx: Executor) => T): T {
  return db.transaction((tx) => work(tx as unknown as Executor));
}
