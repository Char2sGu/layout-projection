# Snapshots

A `ProjectionNodeSnapshot` captures various state of a projection node at a certain time, including hierarchy and measurement. In this library, snapshots are used to create animations that transition between different states of a node.

To create an animation that smoothly transits a layout change, the start of a layout animation should be the snapshot of the node before the layout change, and the end should be the snapshot of the node's current state.

Invoke `createSnapshot` on a projection node to create a snapshot of its current state:

```ts
declare const node: ProjectionNode;
node.measure();
const snapshotPrev: ProjectionNodeSnapshot = createSnapshot(node);
updateLayout();
node.measure();
const snapshotCurr: ProjectionNodeSnapshot = createSnapshot(node);
```
