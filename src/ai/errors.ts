import { AppError } from '@/core/errors';
import type { AIErrorCode } from './types';

export class AIError extends AppError {
  readonly aiCode: AIErrorCode;

  constructor(aiCode: AIErrorCode, userMessage: string, cause?: unknown) {
    super({ code: 'AI_AUTH', userMessage, cause });
    this.name = 'AIError';
    this.aiCode = aiCode;
  }
}
