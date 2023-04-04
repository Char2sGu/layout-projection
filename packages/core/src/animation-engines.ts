import { animate, Easing, mix } from 'popmotion';

import {
  BorderRadiusConfig,
  BorderRadiusCornerConfig,
  BoundingBox,
} from './core.js';
import { Node } from './node.js';

export class NodeAnimationEngine {
  protected pendingAnimations = new WeakMap<Node, AnimationRef>();

  animate(node: Node, config: NodeAnimationConfig): AnimationRef {
    this.pendingAnimations.get(node)?.stop();

    let stopper: () => void;

    const promise = new Promise<void>((resolve) => {
      const { duration, easing, route } = config;

      const animateFrame = (progress: number) =>
        this.animateFrame(node, route, progress);

      animateFrame(0);

      stopper = animate({
        from: 0,
        to: 1,
        duration,
        ease: easing,
        onUpdate: animateFrame,
        onComplete: () => {
          node.reset();
          resolve();
        },
        onStop: resolve,
      }).stop;
    });

    const ref = new AnimationRef(promise, () => stopper());
    this.pendingAnimations.set(node, ref);
    return ref;
  }

  protected animateFrame(
    node: Node,
    route: NodeAnimationRoute,
    progress: number,
  ): void {
    const boundingBox = this.calculateBoundingBox(route, progress);
    const borderRadiuses = this.calculateBorderRadiuses(route, progress);
    node.borderRadiuses = borderRadiuses;
    node.project(boundingBox);
  }

  protected calculateBoundingBox(
    route: NodeAnimationRoute,
    progress: number,
  ): BoundingBox {
    const from = route.boundingBoxFrom;
    const to = route.boundingBoxTo;
    return new BoundingBox({
      top: mix(from.top, to.top, progress),
      left: mix(from.left, to.left, progress),
      right: mix(from.right, to.right, progress),
      bottom: mix(from.bottom, to.bottom, progress),
    });
  }

  protected calculateBorderRadiuses(
    route: NodeAnimationRoute,
    progress: number,
  ): BorderRadiusConfig {
    const from = route.borderRadiusesFrom;
    const to = route.borderRadiusesTo;

    const mixRadius = (
      from: BorderRadiusCornerConfig,
      to: BorderRadiusCornerConfig,
      progress: number,
    ): BorderRadiusCornerConfig => ({
      x: mix(from.x, to.x, progress),
      y: mix(from.y, to.y, progress),
    });

    return {
      topLeft: mixRadius(from.topLeft, to.topLeft, progress),
      topRight: mixRadius(from.topRight, to.topRight, progress),
      bottomLeft: mixRadius(from.bottomLeft, to.bottomLeft, progress),
      bottomRight: mixRadius(from.bottomRight, to.bottomRight, progress),
    };
  }
}

export class TreeAnimationEngine {
  protected pendingAnimations = new WeakMap<Node, AnimationRef>();

  constructor(protected engine: NodeAnimationEngine) {}

  animate(root: Node, config: TreeAnimationConfig): AnimationRef {
    this.pendingAnimations.get(root)?.stop();
    const { duration, easing, routes } = config;

    const animations: AnimationRef[] = [];
    root.traverse(
      (node) => {
        const route = routes.get(node.id);
        if (!route) throw new Error('Unknown node');
        const config: NodeAnimationConfig = { duration, easing, route };
        const animation = this.engine.animate(node, config);
        animations.push(animation);
      },
      { includeSelf: true },
    );

    const ref = new AnimationRef(
      Promise.all(animations), //
      () => animations.forEach((ref) => ref.stop()),
    );
    this.pendingAnimations.set(root, ref);
    return ref;
  }
}

export interface AnimationConfig {
  duration: number;
  easing: Easing;
}

export interface NodeAnimationConfig extends AnimationConfig {
  route: NodeAnimationRoute;
}

export interface TreeAnimationConfig extends AnimationConfig {
  routes: NodeAnimationRouteMap;
}

export interface NodeAnimationRoute {
  boundingBoxFrom: BoundingBox;
  boundingBoxTo: BoundingBox;
  borderRadiusesFrom: BorderRadiusConfig;
  borderRadiusesTo: BorderRadiusConfig;
}

export class NodeAnimationRouteMap extends Map<
  Node['id'],
  NodeAnimationRoute
> {}

export class AnimationRef implements PromiseLike<void> {
  constructor(private promise: Promise<any>, private stopper: () => void) {}

  then<TResult1 = void, TResult2 = never>(
    onfulfilled?:
      | ((value: void) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  stop(): void {
    this.stopper();
  }
}
