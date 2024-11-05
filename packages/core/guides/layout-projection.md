# Layout Projection

A Layout Projection projects an element from it's browser-computed layout (position + size) to an arbitrary destination layout by applying CSS `transform`s, while ensuring that the element is not distorted because of the effect of CSS `transform`s applied on parent elements, enabling nested Layout Projections.

Based on this technique, developers can implement **GPU accelerated** smooth animations by continuously projecting an element from one layout to another in each frame.

This guide introduces the basic mechanism of Layout Projection with some fundamental APIs of `@layout-projection/core` for performing Layout Projections.

## Projection Tree

The Projection Tree is a tree of Projection Nodes constructed in a hierarchial structure that is synchronized with the DOM tree, serving as the foundation of Layout Projections.

The Projection Tree consists of Projection Nodes. Each Projection Node is a piece of content that can be projected, represented by the `ProjectionNode` class. A `ProjectionNode` instance is strictly bound to a specific DOM element, responsible for performing Layout Projection for that element:

```ts
const parent = new ProjectionNode(rootElement);
const child = new ProjectionNode(childElement);
child.attach(parent);
```

The purpose of the Projection Tree is to keep track of the layout information of the DOM elements, and to provide the necessary information for Layout Projections. The Projection Tree does not need to include every DOM elements. Only the elements that are useful for Layout Projections need to be added to the Projection Tree.

<!-- There should be only one Projection Tree for each application:

- there should be only one root node - any other nodes should be attached to a parent
- there shouldn't be more than one nodes referring to a same DOM element at the same time.

The Projection Tree do not need to include every DOM elements. You may want to add a DOM element to the Projection Tree only when a Layout Projection needs to be performed on it. -->

The Projection Tree needs to be strictly synchronized with the DOM tree in order to ensure the correctness of Layout Projections and prevent memory leaks:

- Once a `ProjectionNode` is instantiated, it should be attached to an appropriate parent based on the DOM tree, which should be the `ProjectionNode` instance of the nearest ancestor DOM element.
- Once a DOM element in the Projection Tree is removed from the DOM tree, its corresponding Projection Node (if exists) should be immediately detached from its parent and references of the `ProjectionNode` instance should be eliminated.

Framework adapters should be able to construct and synchronize the Projection Tree with the DOM tree automatically and declaratively.

### Node Identity

A Projection Node is a piece of content that can be projected, but the same "piece of content" can be different DOM element instances in different phrases of your application.

As a `ProjectionNode` instance is strictly bound to a specific DOM element, you might need to instantiate multiple `ProjectionNode` instances for a same piece of content at different phrases.

Projection Nodes are always identified by their unique ids instead of `ProjectionNode` instance references.

By default, a random id is generated for each new `ProjectionNode` instance. If a Projection Node is represented by more than one `ProjectionNode` instances, you'll need to explicitly identify these `ProjectionNode` instances using a same unique id:

```ts
const oldNode = new ProjectionNode(oldElement);
oldNode.identifyAs('the-same-and-unique-id');
const newNode = new ProjectionNode(newElement);
newNode.identifyAs('the-same-and-unique-id');
```

### Node Deactivation

A Projection Node is activated by default, but can be deactivated to omit the node and its children from tree traversals.

The `activate()` and `deactivate()` methods can be used to update the activation state:

```ts
someChild.deactivate();
root.traverse((node) => someOperation(node));
someChild.activate();
```

## Projection Process

The Projection Tree usually needs to be initialized and updated to supply the essential information for Layout Projections on each nodes:

```ts
root.traverse((node) => node.reset(), { includeSelf: true });
root.traverse((node) => node.measure(), { includeSelf: true });
```

The `reset()` method removes the applied `transform` styles from the element, and the `measure()` method measures the element's current layout and save it in the instance.

The nodes needs to be reset before measured to make sure that the measured layouts are not distorted by applied `transform` styles on ancestor elements. Besides, the Projection Tree must be traversed twice to perform the DOM-write and DOM-read operations separately to prevent [layout-thrashing](https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/) which would severely damage the performance.

Now all the Projection Nodes are ready for Layout Projections.

The `project()` method projects a node's corresponding element into an arbitrary layout:

```ts
const dest = new BoundingBox({ top: 0, left: 0, right: 100, bottom: 100 });
node.project(dest);
```

A Layout Projection on a specific Projection Node generally involves these steps:

1. Calculate the element's distorted layout based on its latest measured layout and the `transform`s of its ancestor nodes.
1. Calculate the `transform` that will be applied to project the element from its distorted layout to the destination layout.
1. Apply the calculated `transform` to the element's style.

As long as the measured layouts are up-to-date, developers can accurately project any elements within the Projection Tree into any layouts using pure CSS `transform`s, which is GPU-accelerated by the browser.

## Calibrating Styles

During a projection, the element's logical layout remains unchanged. It is the CSS transforms that makes the element appear to be of a different size and position. In case the projected layout has a different size or aspect ratio, some CSS styles will be distorted. For example, when a 100x100 element with a 10px border radius is projected to a 200x200 layout, the border radius will be distorted to 20px. Therefore, it is necessary to calibrate such styles to make them consistent with the projected layout.

The `ProjectionNode` constructor accepts a second parameter: an array of `ProjectionComponent` instances. Each `ProjectionComponent` is responsible for calibrating specific CSS properties. `@layout-projection/core` provides some built-in `ProjectionComponent` implementations for calibrating common CSS properties, such as `BorderRadiusProjectionComponent` for border radiuses:

```ts
const projectionComponents = [
  new BorderRadiusProjectionComponent(
    new BorderRadiusMeasurer(new CssBorderRadiusParser()), // dependencies of ths component
  ),
];
const node = new ProjectionNode(element, projectionComponents);
```

> The built-in `ProjectionComponent` implementations are not enabled by default. You need to explicitly add them to the `ProjectionNode` constructor. This is to allow developers to have full control over the calibration process.

Developers are encouraged to implement any additional `ProjectionComponent` classes for any additional CSS properties. See the source code of built-in `ProjectionComponent` classes for reference.
