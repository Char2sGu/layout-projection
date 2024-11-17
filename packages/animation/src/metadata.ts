/**
 * A token that can be used to define and retrieve metadata on an object.
 * The type parameter is essential for type safety.
 * @example
 *  ```ts
 *  const RATIO = new MetadataToken<number>("RATIO");
 *  ```
 */
export class MetadataToken<T> {
  readonly key: symbol;
  readonly type?: T;
  constructor(readonly name: string) {
    this.key = Symbol(this.name);
  }
}

/**
 * Service that is responsible for defining and retrieving metadata on objects.
 *
 * @example
 *  ```ts
 *  const RATIO = new MetadataToken<number>("RATIO");
 *  manager.define(object, RATIO, 0.5);
 *  const ratio = manager.resolve(object, RATIO);
 *  ```
 */
export abstract class MetadataManager {
  /**
   * Defines a value for a metadata token on the given object.
   * Duplicate definitions overwrites the previous value.
   */
  abstract define<T>(
    target: object,
    token: MetadataToken<T>,
    value: NoInfer<T>,
  ): void;

  /**
   * Resolves the value of a metadata token on the given object.
   * @returns the value of the token or undefined if not defined
   */
  abstract resolve<T>(target: object, token: MetadataToken<T>): T | undefined;
}

/**
 * Implementation of {@link MetadataManager} that
 * stores metadata as a property on the target object.
 */
export class InPlaceMetadataManager implements MetadataManager {
  define<T>(target: object, token: MetadataToken<T>, value: T): void {
    Reflect.set(target, token.key, value);
  }
  resolve<T>(target: object, token: MetadataToken<T>): T | undefined {
    return Reflect.get(target, token.key);
  }
}
