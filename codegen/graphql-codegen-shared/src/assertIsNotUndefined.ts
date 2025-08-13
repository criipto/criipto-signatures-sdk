import { AssertionError } from 'assert';

export function assertIsNotUndefined<T>(value: T | undefined): asserts value is T {
  if (value === undefined) {
    throw new AssertionError({ message: 'Value is undefined' });
  }
}
