# Animation

Animations are handled by animators, represented by the `ProjectionAnimator` abstract class.

```ts
// say we already have an animator (more details later)
declare const animator: ProjectionAnimator;
const ref = animator.animate({
  node: node,
  from: snapshotPrev,
  to: snapshotCurr,
  duration: 1000,
  easing: (progress) => progress, // linear
});
```

The above `animate` call animates the given `node` from its previous state specified by `snapshotPrev` to its current state specified by `snapshotCurr`.
The duration of the animation is `1000` milliseconds, and the easing function is a linear function that maps the progress from `0` to `1` linearly.

The animator will try to animate only the given projection node and preserve the layout of its children by performing in-place projections on child nodes. A child node will be projected in-place if 1) it has been measured, or 2) it has been projected.

This enables nested and concurrent animations on any node in the projection tree without interfering with each other, i.e. you can animate multiple nodes at the same time, and each node will be animated independently of others. Therefore, it is recommended to make sure all nodes in the projection tree are measured before animating:

```ts
// separate DOM read and write phases to avoid layout thrashing
// https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
root.traverse((n) => n.reset());
root.traverse((n) => void n.measure());
```

An `AnimationRef` is a `PromiseLike` object returned from the `animate` method, offering access and control to the state of the animation:

```ts
expect(ref.resolved() === false);
expect(ref.progress() === 0);
setTimeout(() => ref.stop(), 500);
await ref; // wait till complete or stop
expect(ref.resolved() === true);
```

The behavior of starting a new animation on a node that is already being animated is defined by `ProjectionAnimator` implementations.

## CompositeProjectionAnimator

`CompositeProjectionAnimator` is the built-in implementation of `ProjectionAnimator`.
It delegates most of the animation logic to a list of `ProjectionAnimationHandler`s, where each of them is responsible for handling an aspect of the animation in each frame.

Using `CompositeProjectionAnimator`, when a new animation starts on a node that has a pending animation, the pending animation will be stopped, and the new animation will be modified to start from the last frame of the previous animation.

```ts
const handlers: ProjectionAnimationHandler[] = []; // empty for now
const animator: ProjectionAnimator = new CompositeProjectionAnimator(handlers);
```

Since no handlers are supplied to the animator instance above, it will not perform any actual animation when `animate` is called.

### LayoutProjectionAnimationHandler

`LayoutProjectionAnimationHandler` handles the most important layout aspect of the animation.
It projects the node to different layout in each frame based on the animation specification and progress.

```ts
const layoutFramer = new LayoutAnimationFramer(); // internal dependency
const layoutHandler: ProjectionAnimationHandler =
  new LayoutProjectionAnimationHandler(layoutHandler);
```

When this handler is supplied to the animator, the layout of the node will be animated as specified:

```ts
const handlers: ProjectionAnimationHandler[] = [layoutHandler];
const animator: ProjectionAnimator = new CompositeProjectionAnimator(handlers);
```
