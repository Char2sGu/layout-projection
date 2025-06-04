# Projection Tree

A projection tree establishes the foundation of layout projections.
It models a subset of the DOM tree, tracking the layout information about critical DOM elements - rendered elements with a box model - to help computing the `transform` when performing layout projections.

> It does no harm, though not necessary, for a projection tree to model the entire DOM tree regardless of which element to pick.

A projection node, like a DOM node, is a node in the projection tree, represented by the `ProjectionNode` abstract class in this library, implemented as `BasicProjectionNode`:

```ts
declare const element: HTMLElement;
const const node: ProjectionNode = new BasicProjectionNode(element, "unique-id");
expect(node.identity() === 'unique-id');
```

Like in the DOM, a projection node must be attached as a child of a parent projection node, in order to be connected to the projection tree, unless it serves as the root:

```ts
declare const root: ProjectionNode;
expect(node.parent() === null);
node.attach(root);
// alternatively: root.appendChild(node);
expect(node.parent() === root);
expect(root.children().has(node));
```

The projection tree must be kept in sync with the DOM tree, so that the projection nodes can be created, updated, or removed as necessary.

When the associated element of a projection node is removed from the DOM, the projection node must be disposed of:

```ts
node.dispose();
```
