# Metadata

Metadata are additional information associated to specific objects. This package offers a unified and type-safe API for metadata management, and utilizes metadata to customize certain animation behaviors.

## Metadata API

```ts
const SKIP = new MetadataToken<boolean>('SKIP');
```

A `MetadataToken` is a unique identifier for a specific metadata type. The above snippet defines a token for a boolean metadata type named `SKIP`.

```ts
declare const manager: MetadataManager; // more on this later
declare const target: object;
expect(manager.resolve(target, SKIP) === undefined);
manager.set(target, SKIP, true);
expect(manager.resolve(target, SKIP) === true);
manager.set(target, SKIP, false);
expect(manager.resolve(target, SKIP) === false);
```

`MetadataManager` is the service responsible for defining and accessing metadata. The `define` method defines a value for a specific metadata token on a target object, while the `resolve` method retrieves the value of that metadata token from the target object.

## Metadata Implementation

```ts
const manager: MetadataManager = new InPlaceMetadataManager();
```

`InPlaceMetadataManager` is the built-in implementation of `MetadataManager` that stores metadata directly on the target objects using a unique `symbol` for each metadata token. This allows for efficient and type-safe metadata management without the need for additional data structures.

## Metadata and Animation

Metadata can be used to customize the behavior of animations. Animation services might check metadata defined on the projection node object that is directly passed to it to determine how to handle the animation.

```ts
manager.define(node, SKIP, true);
animator.animate(node);
```

When the projection node is wrapped by certain behaviors, the metadata must be defined on the out-most wrapper object, not the projection node itself, because the animator will only check metadata on the node object that is **directly** passed to it.
