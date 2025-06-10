# Snapshots

In this library, snapshots are used to define the beginning and end states for animations.

To create an animation that smoothly transits a layout change, the beginning of a layout animation should be defined by the snapshot of the node before the layout change, and the end should be defined by the snapshot of the node's current state.

A `ProjectionNodeSnapshot` captures various state of a projection node at a certain time, including hierarchy and measurement. Invoke `createSnapshot` on a projection node to create a snapshot of its current state:

```ts
declare const node: ProjectionNode;
node.measure();
const snapshotPrev: ProjectionNodeSnapshot = createSnapshot(node);
updateLayout();
node.measure();
const snapshotCurr: ProjectionNodeSnapshot = createSnapshot(node);
```
