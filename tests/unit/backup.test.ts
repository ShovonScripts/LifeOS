import { backupSchema } from '../../src/services/backup';

jest.mock(
  'expo-asset',
  () => ({
    Asset: {
      fromModule: jest.fn(() => ({ downloadAsync: jest.fn() })),
    },
  }),
  { virtual: true },
);

jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    prepareSync: jest.fn(() => ({
      executeSync: jest.fn(() => ({
        getAllSync: jest.fn(() => []),
        getFirstSync: jest.fn(() => null),
      })),
      finalizeSync: jest.fn(),
    })),
    transactionSync: jest.fn((cb: (tx: unknown) => unknown) => cb({})),
  })),
}));

describe('Backup & Restore Data Safety Schema', () => {
  test('validates backup schema strictly', () => {
    const validPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        projects: [{ id: 'proj-1', name: 'Work' }],
        tasks: [{ id: 'task-1', title: 'Finish report' }],
        subtasks: [],
        labels: [],
        events: [],
        habits: [],
        habitLogs: [],
        goals: [],
        goalMilestones: [],
        notes: [],
        focusSessions: [],
      },
    };

    const parsed = backupSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  test('rejects invalid backup payloads with missing tables or wrong version', () => {
    const invalidPayload = {
      version: 99,
      exportedAt: new Date().toISOString(),
      data: {},
    };

    const parsed = backupSchema.safeParse(invalidPayload);
    expect(parsed.success).toBe(false);
  });
});
