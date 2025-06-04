# Authoring Behaviors

Custom behavior classes can be easily created utilizing the following boilerplate:

```ts
export class MyBehavior extends ProjectionNodeBehavior {
  static readonly for = createInjectiveInstanceFactory(
    (node: ProjectionNode) => new MyBehavior(node),
  );

  protected constructor(kernel: ProjectionNode) {
    super(kernel);
  }

  protected override decorate(target: ProjectionNode): this {
    return MyBehavior.for(target, this.measurer) as this;
  }
}
```

All methods of the `ProjectionNodeBehavior` class can be overridden to implement custom behaviors:

```ts
export class MyBehavior extends ProjectionNodeBehavior {
  // ...

  override measure(): Measurement {
    const measurement = super.measure() as MyExtendedMeasurement;
    measurement.myProperty = 'myValue';
    return measurement;
  }

  override project(dest: Layout): Projection {
    const projection = super.project(dest);
    const { measurement } = projection;
    const element = this.element();
    this.#updateElementStyles(element, measurement);
    return projection;
  }

  #updateElementStyles(
    element: HTMLElement,
    measurement: MyExtendedMeasurement,
  ): void {
    // ...
  }

  // ...
}
```
