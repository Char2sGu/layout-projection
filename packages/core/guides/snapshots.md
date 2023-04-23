# Snapshots

The `ProjectionNodeSnapper` service captures the current state of Projection Nodes into snapshots for future use:

```ts
const snapper = new ProjectionNodeSnapper(...deps);
const snapshot = snapper.snapshot(node); // ProjectionNodeSnapshot
```

To snapshot a whole subtree of Projection Nodes, use `snapshotTree()` instead, which traverse down the Projection Tree starting from the provided `root` , snapshot each node, and save the snapshots in a map:

```ts
const snapshots = snapper.snapshotTree(root); // ProjectionNodeSnapshotMap
```

Optionally, a `filter` can be specified to skip some child nodes in the traversal:

```ts
snapper.snapshotTree(root, (node) => node.element.tagName !== 'span');
```

Projection Nodes are identified by their ids, thus the id should be used to retrieve the snapshot of a specific node from the snapshot map:

```ts
const snapshot = snapshots.get(root.id);
```

Snapshot maps can merge other snapshot maps, enabling developers to maintain an overall snapshot map for all Projection Nodes:

```ts
const snapshots = new ProjectionNodeSnapshotMap();
snapshots.merge(snapper.snapshotTree(root));
```
