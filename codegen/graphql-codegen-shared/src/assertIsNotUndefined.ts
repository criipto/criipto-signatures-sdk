import { AssertionError } from 'assert';

export function assertIsNotUndefined<T>(
  value: T | undefined,
  message?: string,
): asserts value is T {
  if (value === undefined) {
    throw new AssertionError({ message: message ?? 'Value is undefined' });
  }
}
