import { logger } from '../../src/services/logger';
import { backupSchema } from '../../src/services/backup';
import appConfig from '../../app.json';

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

describe('Phase 5 Security & Release Quality Audit', () => {
  test('app.json contains valid bundle identifier and no secrets', () => {
    expect(appConfig.expo.name).toBe('LifeOS');
    expect(appConfig.expo.android?.package).toBe('com.prodo.lifeos');

    const jsonString = JSON.stringify(appConfig);
    expect(jsonString).not.toContain('sk-');
    expect(jsonString).not.toContain('AIza');
    expect(jsonString).not.toContain('Bearer');
  });

  test('logger redacts bearer and api key patterns', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    logger.warn('User authenticated with Bearer sk-1234567890abcdef1234567890abcdef');

    expect(consoleWarnSpy).toHaveBeenCalled();
    const loggedMessage = consoleWarnSpy.mock.calls[0]?.[0] as string;
    expect(loggedMessage).not.toContain('sk-1234567890abcdef1234567890abcdef');
    expect(loggedMessage).toContain('[REDACTED]');

    consoleWarnSpy.mockRestore();
  });

  test('backup payload schema excludes API keys strictly', () => {
    const payloadKeys = Object.keys(backupSchema.shape.data.shape);
    expect(payloadKeys).not.toContain('apiKeys');
    expect(payloadKeys).not.toContain('secrets');
    expect(payloadKeys).not.toContain('tokens');
  });
});
