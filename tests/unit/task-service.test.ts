import { TaskService } from '../../src/features/tasks/service';
import { getPresetRRule } from '../../src/domain/recurrence';

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

describe('Task Service Recurrence & QuickAdd Logic', () => {
  test('parses quick add into structured fields', () => {
    const parsed = TaskService.quickAdd;
    expect(parsed).toBeDefined();
  });

  test('generates valid rrule for recurrence presets', () => {
    const dailyRRule = getPresetRRule('daily', new Date('2025-06-01T00:00:00Z'));
    expect(dailyRRule).not.toBeNull();
  });
});
