# Layout Projection

A Layout Projection projects an element from it's browser-computed layout (size + position) to an arbitrary destination layout by applying CSS `transform`s, while ensuring that the element is not distorted because of the effect of CSS `transform`s applied on parent elements, enabling nested Layout Projections.

Based on this technique, developers can implement **GPU accelerated** high frame rate animations by continuously projecting an element from one layout to another in each frame.

This guide introduces you the basic mechanism of Layout Projection with some fundamental APIs of `@layout-projection/core` for performing Layout Projections.

## Projection Tree

The Projection Tree serves as the infrastructure for Layout Projections. It is an abstract concept referring to a tree of Projection Nodes in a hierarchy based on the DOM tree.

A Projection Node is a piece of content that can be projected, which is represented by the `ProjectionNode` class. A `ProjectionNode` instance is bound to a specific DOM element, responsible for performing Layout Projection for the element, where the states of its parents in the Projection Tree are involved to cancel the side effect of parent Layout Projections.

Instantiate a `ProjectionNode` for a DOM element and attach it to a parent node to add the element into the Projection Tree. The following example constructs a Projection Tree consisting of two Projection Nodes:

```ts
const root = new ProjectionNode(rootElement, ...);
const child = new ProjectionNode(childElement, ...);
child.attach(root);
```

It is strongly recommended to construct only one Projection Tree throughout the DOM for performance and stability, which means that:

- there should be only one root node that doesn't have a parent
- there shouldn't be more than one nodes referring to a same DOM element at the same time.

The Projection Tree do not need to include every DOM elements. You may want to add a DOM element to the Projection Tree only when a Layout Projection needs to be performed on it.

### DOM Synchronization

The Projection Tree needs to be strictly synchronized with the DOM tree in order to ensure the correctness of Layout Projections and prevent memory leaks, which means that:

- Once a `ProjectionNode` is instantiated, it should be attached to a correct parent, which should be the nearest Projection Node corresponding to an ancestor of the element.
- Once a DOM element in the Projection Tree is removed from the DOM tree, its corresponding Projection Node (if exists) should be immediately detached from its parent and references of the `ProjectionNode` instance should be eliminated.

Framework adapters should be able to construct and synchronize the Projection Tree with the DOM tree automatically and declaratively.

### Node Identity

A Projection Node is a piece of content that can be projected, but the same "piece of content" can be different DOM element instances in different phrases of your application.

As a `ProjectionNode` instance is strictly bound to a specific DOM element, you might need to instantiate multiple `ProjectionNode` instances for a same piece of content at different phrases.

Projection Nodes are always identified by their unique ids instead of `ProjectionNode` instance references.

By default, a random id is generated for each new `ProjectionNode` instance. If a Projection Node is represented by more than one `ProjectionNode` instances, you'll need to explicitly identify these `ProjectionNode` instances using a same unique id:

```ts
const oldNode = new ProjectionNode(oldElement, ...deps);
oldNode.identifyAs('the-same-and-unique-id');
const newNode = new ProjectionNode(newElement, ...deps);
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

## What's Next

When supplied with a plan of what layout each element should be projected into in each frame, it's now possible to animate elements throughout the viewport without the constraint of the DOM structure.

Checkout the [Layout Animation guide](./layout-animation.md) for the built-in animation support based on the Layout Projection technique.
