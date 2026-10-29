import { monotonicFactory } from 'ulid';

function prng(): number {
  return Math.random();
}

const generateUlid = monotonicFactory(prng);

export function newId(): string {
  return generateUlid();
}

export function isId(value: string): boolean {
  return /^[0-9A-HJKMNP-TV-Z]{26}$/.test(value);
}
