# Layout Animation

Thanks to the Layout Projection technique, GPU-accelerated layout animations are made possible.

Several services are built into `@layout-projection/core` to allow developers to easily create smooth layout animations based on the Layout Projection technique.

Through this guide, you will learn about the animation API of `@layout-projection/core`, through which you can create a variety of fancy layout animations including shared-element transitions and container transforms.

## Prerequisites

To make sure this guide is easy to comprehend, it is recommended to go through the following topics first:

- [Layout Projection](./layout-projection.md)

## Animation Engines

Animation Engines are the underlying engines powering all the layout animations, responsible for animating a certain target based on the given route, duration and easing.

In most cases, you would not need to directly use the underlying Animation Engines, but it's still good to learn their existence.

### Node Animation Engine

The `ProjectionNodeAnimationEngine` is the most fundamental Animation Engine, responsible for animating a specific Projection Node:

```ts
const animationEngine = new ProjectionNodeAnimationEngine();
const animationRef = animationEngine.animate(node, config);
```

The `config` parameter should be a `ProjectionNodeAnimationConfig`:

```ts
interface ProjectionNodeAnimationConfig {
  duration: number;
  easing: (v: number) => number;
  route: {
    boundingBoxFrom: BoundingBox;
    boundingBoxTo: BoundingBox;
    borderRadiusesFrom: BorderRadiusConfig;
    borderRadiusesTo: BorderRadiusConfig;
  };
}
```

...where:

- the `duration` property is the duration of the animation in milliseconds,
- the `easing` property is a function with the time `0`-`1` as input and progress `0`-`1` as the output. You may want to pass in a [popmotion](https://popmotion.io) easing function,
- the `route` property controls the route the element would animate through.

The `animate()` method would animate the Projection Node according to the given config, while returning an `AnimationRef` for the developer to wait for the animation to settle:

```ts
await animationRef;
```

...or eagerly stop the animation:

```ts
animationRef.stop();
```

Note that the `AnimationRef` is a `PromiseLike` which would never reject and would resolve once the animation is settled despite of the reason, which means that it would resolve no matter the animation is finished or stopped.

The resolve value is an item from the `AnimationResult` enum, which can be either `AnimationResult.Completed` or `AnimationResult.Stopped`, indicating the result of the animation.

The element will be projected to the layout of the last animation frame when the animation is settled. You may want to `reset()` the Projection Node to remove the applied `transform` styles and put it back into its original layout.

When invoking `animate()` on a Projection Node where another animation is pending, the Animation Engine will automatically eagerly stop the pending animation to perform the new animation.

### Tree Animation Engine

The `ProjectionTreeAnimationEngine` is built on top of the `ProjectionNodeAnimationEngine`, responsible for animating a whole subtree within the Projection Tree:

```ts
const underlying = new ProjectionNodeAnimationEngine();
const animationEngine = new ProjectionTreeAnimationEngine(underlying);
const animationRef = animationEngine.animate(root, config);
```

The only difference in the `config` parameter is that it uses `routes` as a source to retrieve the route of each Projection Node within the subtree instead of `route`:

```ts
interface ProjectionTreeAnimationConfig {
  duration: number;
  easing: (v: number) => number;
  routes: Map<
    ProjectionNode['id'],
    {
      boundingBoxFrom: BoundingBox;
      boundingBoxTo: BoundingBox;
      borderRadiusesFrom: BorderRadiusConfig;
      borderRadiusesTo: BorderRadiusConfig;
    }
  >;
}
```

The `AnimationRef` returned from the `ProjectionTreeAnimationEngine` reflects and controls the state of the animation of the whole subtree. It resolves only when all animations on every Projection Nodes in the subtree are settled, and invoking the `stop()` method will stop the whole subtree.

Animations on subtrees are identified using the `root`. If there is already a pending animation on the given `root`, the pending animation will be automatically stopped in order to start the new one.

## Layout Animator

The `LayoutAnimator` is a much higher-level service built on top of the Animation Engines, focusing on animating a subtree of the Projection Tree from their snapshot layouts to their current layouts.

The `LayoutAnimator` covers the most common layout animations, and thus it should be the service you'll be working with the most.

Just like the Animation Engines, `LayoutAnimator` exposes an `animate()` method to perform animations:

```ts
const animator = new LayoutAnimator(...deps);
const animationRef = animator.animate({
  root: root,
  from: snapshots,
});
```

But `LayoutAnimator` works completely different from Animation Engines.

`LayoutAnimator` would first `reset()` and re-`measure()` whole subtree starting from the given `root` to ensure the subtree is up-to-date, and then invoke its underlying AnimationEngine with automatically generated animation routes to animate each node within the subtree from their previous layout according to their snapshots to their current layouts. After the nodes are animated to their current layouts, `LayoutAnimator` will `reset()` the subtree to remove the `transform` styles.

With `LayoutAnimator`, it is extremely easy to animate the changes in the layouts: All you need to do is to capture the layout of each nodes in the subtree before changing their layouts, and then invoke the `animate()` method after the layouts are changed:

```ts
const snapper = new ProjectionNodeSnapper(...deps);
const animator = new LayoutAnimator(...deps);

const snapshots = snapper.snapshotTree(root);
updateLayout();
await animator.animate({ root: root, from: snapshots });
```

> The `ProjectionNodeSnapper` service captures the current state of Projection Nodes into snapshots. Learn more about this service [here](./snapshots.md).

Note that several requirements must be followed in order to perform the animation correctly:

- You should invoke `animate()` after changing the layouts as soon as possible, because the layout changes will be rendered after the current event loop is completed, and then the elements will blink on their new layouts before they are animated.
- The layout changes must be within the scope of the subtree starting from the `root` node you specified.

### Easing and Duration

The `easing` and `duration` properties in the `config` are optional, as default values are supplied for them.

There are also more syntaxes available for `easing` and `duration` in `LayoutAnimator`.

The `easing` can optionally be a string of CSS easing function:

```ts
animator.animate({ ..., easing: 'ease-in-out' });
animator.animate({ ..., easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
```

### Estimation

For some cases, the subtree might vary after changing the layout. For example. some nodes might be removed from the subtree and some new nodes might be added.

In such cases, there would be no corresponding snapshots for the new nodes to generate animation routes, thus they will not be animated at all and directly appear at their new layouts by default.

In order to include these new nodes in the animation, you need to set `estimation` to true so that `LayoutAnimator` will try to find an ancestor node which is not new for each new node, and estimate an animation route for each of the new node based on the ancestor's snapshot layout and new layout.

```ts
animator.animate({ ..., estimation: true });
```

## Layout Animation Entry

`LayoutAnimationEntry` is a facade-level API which integrated several services to simplify the process of performing non-disposable layout animations on the sub Projection Tree starting from a specified Projection Node:

```ts
const animationEntry = new LayoutAnimationEntry({
  node: root,
  deps: [animator, snapper],
});
```

`LayoutAnimationEntry` requires a config object to instantiate, where:

- the `node` property is the root node of the target subtree, and
- the `deps` property is a tuple of services depended by the animation entry.

The `snapshot()` method invokes the `ProjectionNodeSnapper` service to snapshot the subtree starting from the node specified in the config, and stores the snapshot map in its internal snapshot storage:

```ts
animationEntry.snapshot();
```

The `animate()` method invokes the `LayoutAnimator` service to animate nodes within the subtree from their layouts stored in the internal snapshot storage to their current layouts:

```ts
const animationRef = animationEntry.animate();
```

A simplified animation config object can be optionally provided to customize the animation behavior:

```ts
animationEntry.animate({
  duration: 225,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
});
```

Combining these two methods, the process of performing layout animation can be further simplified to the extreme:

```ts
animationEntry.snapshot();
updateLayout();
animationEntry.animate();
```

Note that the snapshot storage will not be automatically pruned. You should regularly clean up the snapshot storage to avoid excessive accumulation of stale snapshots.

To remove all snapshots from the snapshot storage, use `snapshots.clear()`:

```ts
animationEntry.snapshots.clear();
```

### Default Animation Config

Optionally, an animation config object can be provided during instantiation:

```ts
new LayoutAnimationEntry({ ..., animationConfig: { duration: 225 } });
```

This animation config will serve as the default animation config, and will be overridden by the one provided at the method level.

### External Snapshot Storage

By default, a new `ProjectionNodeSnapshotMap` instance will be instantiated to serve as the snapshot storage.

You can provide an external snapshot storage to use during instantiation:

```ts
new LayoutAnimationEntry({ ..., storage: sharedStorage });
```

## Usage Example

In this Vanilla JS example, a layout animation will be triggered to animate elements to their new layouts once the layout is updated.

- Click on a list item to remove it.
- Click on the background to add a new item to the list.

<md-iframe src="https://stackblitz.com/edit/layout-projection-example-list?embed=1&file=index.ts&hideNavigation=1&view=preview">
</md-iframe>

> Checkout [Standalone Usage](./standalone-usage.md) for advices on using `@layout-projection/core` without a framework adapter.
