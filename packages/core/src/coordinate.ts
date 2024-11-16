import { Equatable } from './equatable.js';

/**
 * A coordinate in 2D space.
 */
export class Coordinate implements Equatable {
  constructor(readonly x: number, readonly y: number) {}
  equals(other: this): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
