# Snapshots

In many cases, you might want to capture the current state of a specific Projection Node into a snapshot for future animation use.

The `ProjectionNodeSnapper` service can be used to create such snapshots:

```ts
const snapper = new ProjectionNodeSnapper(...deps);
const snapshot = snapper.snapshot(node);
```

The return value of the `snapshot()` method is a `ProjectionNodeSnapshot`:

```ts
interface ProjectionNodeSnapshot {
  element: HTMLElement;
  boundingBox: BoundingBox;
  borderRadiuses: BorderRadiusConfig;
}
```

To capture a whole sub-tree of Projection Nodes, use the `snapshotTree()` method instead:

```ts
const snapshots = snapper.snapshotTree(root);
```

The return value is a `ProjectionNodeSnapshotMap`:

```ts
class ProjectionNodeSnapshotMap extends Map<
  ProjectionNode['id'],
  ProjectionNodeSnapshot
> { ... }
```

Optionally, you can specify a `filter` to only snapshot part of the sub-tree:

```ts
const snapshots = snapper.snapshotTree(
  root,
  (node) => node.element.tagName !== 'span',
);
```
