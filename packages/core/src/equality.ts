/**
 * Object that can be compared for equality.
 */
export interface Equatable {
  /**
   * Compares this object to another for equality.
   */
  equals(other: this): boolean;
}

/**
 * Compares two nullable objects for equality.
 */
export function isEqual<T extends Equatable>(
  a: T | null | undefined,
  b: T | null | undefined,
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.equals(b);
}
