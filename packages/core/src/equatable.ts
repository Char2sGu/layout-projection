/**
 * Object that can be compared for equality.
 */
export interface Equatable {
  /**
   * Compares this object to another for equality.
   */
  equals(other: this): boolean;
}
