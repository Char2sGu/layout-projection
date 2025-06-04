# Performing Projection

Each `ProjectionNode` instance is capable of projecting its corresponding element to an arbitrary layout: combination of position and dimensions. But the prerequisite is that the instance must possess an up-to-date `measurement`, a snapshot of relevant styling of the corresponding element, acquired by invoking `measure()`:

```ts
expect(node.measurement() === null);
node.measure();
expect(node.measurement() !== null);
```

Leveraging the `traverse` method, the entire projection tree can be easily measured:

```ts
root.traverse((node) => node.measure());
```

Then, to perform a layout projection, supply a destination `Layout` to the `project` method:

```ts
const dest = Layout.fromTopLeft({
  topLeft: new Coordinate(0, 0),
  width: 200,
  height: 200,
});
root.project(dest);
```

This applies a CSS `transform` to the element that makes the element appear that it is positioned at the specified coordinates and has the specified dimensions, with all parental `transform`s cancelled out.

In other words, if a child node is projected after its parent being projected, the child node can still be accurately projected to the expected position and dimensions, immune to the distortion caused by the parent's `transform`.
