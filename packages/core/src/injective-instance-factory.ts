/**
 * Utility function that create an injective (one-to-one) instance factory
 * which ensures there is only one instance created for a specific target.
 * @param factory the actual factory to create new instances
 * @returns a wrapped factory that returns an existing instance for a target if
 * applicable, and delegates to the actual factory otherwise
 */
export function createInjectiveInstanceFactory<
  Factory extends (target: any, ...args: any[]) => any,
>(factory: Factory): Factory {
  type Target = Parameters<Factory>[0];
  type Product = ReturnType<Factory>;
  const instances = new WeakMap<Target, Product>();
  const wrapped = (...[target, ...args]: Parameters<Factory>) => {
    const existing = instances.get(target);
    if (existing) return existing as ReturnType<Factory>;
    const instance = factory(target, ...args);
    instances.set(target, instance);
    return instance;
  };
  return wrapped as Factory;
}
