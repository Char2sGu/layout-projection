# Applying Behaviors

Behaviors are composable pieces of additional functionality that can be applied to projection nodes.
Technically, a behavior is an instance of `ProjectionNodeBehavior`,
which implements the `ProjectionNode` interface and serves as a proxy to an underlying `ProjectionNode`.
A behavior is also known as a _decorator_ in the [decorator design pattern](https://refactoring.guru/design-patterns/decorator).

```ts
declare const node: ProjectionNode;
const nodeFoo: ProjectionNode = FooBehavior.for(node); // with foo behavior
expect(nodeFoo instanceof FooBehavior);
const nodeFooBar: ProjectionNode = BarBehavior.for(nodeFoo); // with foo and bar behaviors
expect(nodeFooBar instanceof BarBehavior);
```

Behavior classes' constructors are marked as protected
to ensure all instances are created through the static `for` method,
which always returns the same instance for a specific node
leveraging a `WeakMap` under the hood:

```ts
expect(FooBehavior.for(node) === FooBehavior.for(node));
```

Behaviors will lazily propagate.
Accessing any relational nodes (parent, children) on a behavior object
will automatically apply the behavior to those nodes as well.

```ts
// accessing ancestors will return nodes with the same behavior
expect(nodeFoo.parent() instanceof FooBehavior);
expect(nodeFoo.parent().parent() instanceof FooBehavior);

// accessing children will return nodes with the same behavior
for (const child of nodeFoo.children()) {
  expect(child instanceof FooBehavior);
}
```

Traversing the projection tree will also propagate behaviors:

```ts
nodeFoo.traverse((child) => {
  expect(child instanceof FooBehavior);
});
```

## Built-in Behaviors

By default, when performing layout projections,
only the position and boundaries of the projection nodes are considered.

Certain styles might be proportionally scaled and/or distorted
as the visual size of the element changes after projection,
and thus a set of built-in behaviors are provided
to ensure the visual consistency of these styles
before and after projection.

### Border Radius

```ts
const parser = new ComputedStylesBorderRadiusParser();
const measurer = new ComputedStylesBorderRadiusMeasurer();

declare let node: ProjectionNode;
node = MeasureBorderRadius.for(node);
node = CalibrateBorderRadius.for(node, measurer);
```

These two behaviors must be applied together and in the above order to take effect.

- `MeasureBorderRadius` additionally measures the border radius of the node when `measure` is called,
- `CalibrateBorderRadius` adjusts the border radius of the node when `project` is called.

### Box Shadow

Coming soon...
