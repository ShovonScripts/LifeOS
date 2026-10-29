export const APP_ERROR_CODES = [
  'DB_ERROR',
  'VALIDATION',
  'NOT_FOUND',
  'PERMISSION',
  'AI_AUTH',
  'AI_QUOTA',
  'AI_TIMEOUT',
  'AI_OFFLINE',
  'AI_BAD_OUTPUT',
  'BACKUP_INVALID',
  'UNKNOWN',
] as const;

export type AppErrorCode = (typeof APP_ERROR_CODES)[number];

export type AppErrorOptions = {
  code: AppErrorCode;
  userMessage: string;
  cause?: unknown;
};

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly userMessage: string;

  constructor({ code, userMessage, cause }: AppErrorOptions) {
    super(userMessage, cause === undefined ? undefined : { cause });
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function toAppError(error: unknown, fallbackMessage: string): AppError {
  if (isAppError(error)) {
    return error;
  }

  return new AppError({ code: 'UNKNOWN', userMessage: fallbackMessage, cause: error });
}
