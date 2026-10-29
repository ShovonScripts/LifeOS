type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const SECRET_PATTERNS = [
  /\bsk-[A-Za-z0-9_-]{8,}\b/g,
  /\bAIza[0-9A-Za-z_-]{10,}\b/g,
  /\bBearer\s+[A-Za-z0-9._~+/=-]+/gi,
  /lifeos\.ai\.key\.[A-Za-z0-9._-]+/g,
];

const isDev = (globalThis as { __DEV__?: boolean }).__DEV__ !== false;
const minimumLevel: LogLevel = isDev ? 'debug' : 'warn';

export function redactString(value: string): string {
  return SECRET_PATTERNS.reduce((result, pattern) => result.replace(pattern, '[REDACTED]'), value);
}

export function redactValue(value: unknown, depth = 0): unknown {
  if (typeof value === 'string') {
    return redactString(value);
  }

  if (depth > 4 || value === null || typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, depth + 1));
  }

  if (value instanceof Error) {
    return { name: value.name, message: redactString(value.message) };
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      redactValue(item, depth + 1),
    ]),
  );
}

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[minimumLevel];
}

function emit(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
  if (!shouldLog(level)) {
    return;
  }

  const details = meta ? ` ${JSON.stringify(redactValue(meta))}` : '';
  const line = `[${level}] ${redactString(message)}${details}`;

  if (level === 'error') {
    console.error(line);
    return;
  }

  if (level === 'warn') {
    console.warn(line);
    return;
  }

  console.log(line);
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => emit('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => emit('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => emit('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emit('error', message, meta),
};
